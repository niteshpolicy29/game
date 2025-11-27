import Phaser from 'phaser';
import { LevelData } from '../data/levelData.js';
import { PlatformManager } from '../entities/PlatformManager.js';
import { Player } from '../entities/Player.js';
import { Goal } from '../entities/Goal.js';
import { Enemy } from '../entities/Enemy.js';
import { Checkpoint } from '../entities/Checkpoint.js';
import { Crow } from '../entities/Crow.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        console.log('GameScene create started');
        
        // Set world bounds
        this.physics.world.setBounds(0, 0, LevelData.worldBounds.width, LevelData.worldBounds.height);
        
        // Create parallax background layers
        this.createParallaxBackground();
        
        // Initialize lives system
        this.lives = 4;
        this.isRespawning = false;
        this.isFalling = false;
        this.currentCheckpoint = LevelData.playerStart;
        this.goalReached = false;
        
        // Track game time
        this.startTime = this.time.now;
        
        // Create platforms
        this.platformManager = new PlatformManager(this, LevelData);
        
        // Create player (moon position will be calculated in background creation)
        this.player = new Player(this, LevelData.playerStart.x, LevelData.playerStart.y, 
            LevelData.worldBounds.width * 0.75, LevelData.worldBounds.height * 0.2);
        
        // Create enemies
        this.enemies = this.physics.add.group();
        console.log('Enemy data:', LevelData.enemies);
        if (LevelData.enemies && LevelData.enemies.length > 0) {
            LevelData.enemies.forEach((enemyData, index) => {
                try {
                    console.log(`Creating enemy ${index} at`, enemyData);
                    const enemy = new Enemy(this, enemyData.x, enemyData.y, enemyData.patrolStart, enemyData.patrolEnd);
                    this.enemies.add(enemy);
                    console.log(`Enemy ${index} created:`, enemy.x, enemy.y, enemy.visible);
                } catch (error) {
                    console.error('Error creating enemy:', error);
                }
            });
            console.log('Total enemies created:', this.enemies.getLength());
        }
        
        // Create checkpoints
        this.checkpoints = this.physics.add.group();
        LevelData.checkpoints.forEach(cpData => {
            const checkpoint = new Checkpoint(this, cpData.x, cpData.y);
            this.checkpoints.add(checkpoint);
        });
        
        // Create goal
        this.goal = new Goal(this, LevelData.goal.x, LevelData.goal.y);
        
        // Create flying crows in background
        this.crows = [];
        this.createCrows();
        
        // Create water areas
        this.createWaterAreas();
        
        // Setup collisions
        this.platformManager.setupCollisions(this.player);
        
        // Setup checkpoint overlap
        this.physics.add.overlap(this.player, this.checkpoints, this.reachCheckpoint, null, this);
        
        // Setup enemy collisions
        this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, null, this);
        
        // Setup goal overlap
        this.physics.add.overlap(this.player, this.goal, this.reachGoal, null, this);
        
        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = {
            W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            E: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
            Q: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        };
        
        // Setup camera to follow player at normal zoom
        this.cameras.main.setBounds(0, 0, LevelData.worldBounds.width, LevelData.worldBounds.height);
        this.cameras.main.setZoom(1.0);
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        
        // Create lives UI
        try {
            this.createLivesUI();
            console.log('Lives UI created');
        } catch (error) {
            console.error('Error creating lives UI:', error);
        }
        
        console.log('GameScene create completed');
    }
    
    update() {
        // Check if player fell into a gap (below ground level)
        if (this.player.y > 1080 && !this.isRespawning && !this.isFalling) {
            this.isFalling = true;
            // Trigger death immediately
            this.handleDeath();
            this.isFalling = false;
        }
        
        // Update player (only if not respawning)
        if (!this.isRespawning) {
            this.player.update(this.cursors, this.keys);
        }
        
        // Check water physics for marshmallow
        if (this.waterBodies) {
            this.checkWaterPhysics();
        }
        
        // Update enemies
        if (this.enemies && this.enemies.children) {
            this.enemies.children.entries.forEach(enemy => {
                if (enemy && enemy.update) {
                    enemy.update();
                }
            });
        }
        
        // Update crows
        if (this.crows) {
            this.crows.forEach((crow, index) => {
                if (crow && crow.active) {
                    crow.update(this.game.loop.delta);
                } else if (crow && !crow.active) {
                    this.crows.splice(index, 1);
                }
            });
        }
        
        // Spawn new crows periodically
        if (!this.lastCrowSpawn) this.lastCrowSpawn = 0;
        if (this.time.now - this.lastCrowSpawn > 8000) {
            this.spawnCrow();
            this.lastCrowSpawn = this.time.now;
        }
    }
    
    hitEnemy(player, enemy) {
        if (!this.isRespawning) {
            this.handleDeath();
        }
    }
    
    handleDeath() {
        if (this.isRespawning) return;
        
        this.isRespawning = true;
        
        // Lose a life
        this.lives--;
        this.updateLivesUI();
        
        // Disable player controls
        this.player.isDead = true;
        this.player.body.setVelocity(0, 0);
        this.player.body.setAcceleration(0, 0);
        
        // Flash effect
        this.cameras.main.flash(300, 255, 0, 0);
        
        // Check if game over
        if (this.lives <= 0) {
            // Game over - show game over screen
            this.time.delayedCall(1000, () => {
                this.scene.start('GameOverScene');
            });
            return;
        }
        
        // Play death animation based on form
        if (this.player.currentForm === 'marshmallow') {
            this.marshmallowExpire();
        } else if (this.player.currentForm === 'jelly') {
            this.jellyDeath();
        } else {
            this.candyBreak();
        }
        
        // Show respawn scene with cheering chibi after death animation
        this.time.delayedCall(1000, () => {
            const livesLost = 4 - this.lives;
            this.scene.pause('GameScene');
            this.scene.launch('RespawnScene', {
                livesLost: livesLost,
                livesRemaining: this.lives
            });
        });
    }
    
    candyBreak() {
        // Hide the player sprite and shine
        this.player.setVisible(false);
        this.player.shine.setVisible(false);
        
        // Create spooky death marker
        this.createDeathMarker(this.player.x, this.player.y);
        
        // Create candy explosion particles
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2 / 12);
            const particle = this.add.circle(
                this.player.x,
                this.player.y,
                Phaser.Math.Between(4, 8),
                i % 2 === 0 ? 0xff7700 : 0xffaa00,
                1
            );
            
            particle.setDepth(10);
            
            const speed = Phaser.Math.Between(100, 200);
            this.tweens.add({
                targets: particle,
                x: particle.x + Math.cos(angle) * speed,
                y: particle.y + Math.sin(angle) * speed,
                alpha: 0,
                scale: 0,
                duration: 600,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
        
        // Death animation complete - RespawnScene will handle the rest
    }
    
    jellyDeath() {
        // Hide the player sprite and shine
        this.player.setVisible(false);
        this.player.shine.setVisible(false);
        
        // Create spooky death marker
        this.createDeathMarker(this.player.x, this.player.y);
        
        // Jelly splats and dissolves
        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(
                this.player.x + Phaser.Math.Between(-30, 30),
                this.player.y + Phaser.Math.Between(-30, 30),
                Phaser.Math.Between(5, 12),
                0x44ff44,
                0.7
            );
            
            particle.setDepth(10);
            
            this.tweens.add({
                targets: particle,
                y: particle.y + Phaser.Math.Between(50, 100),
                alpha: 0,
                scale: 0.3,
                duration: Phaser.Math.Between(700, 1000),
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
        
        // Death animation complete - RespawnScene will handle the rest
    }
    
    marshmallowExpire() {
        // Marshmallow burns/chars and crumbles
        this.player.shine.setVisible(false);
        
        // Create spooky death marker
        this.createDeathMarker(this.player.x, this.player.y);
        
        // Stage 1: Burn effect - turn dark
        this.tweens.add({
            targets: this.player,
            tint: 0x2a1a0f, // Dark brown/burnt color
            duration: 300,
            ease: 'Sine.easeIn',
            onComplete: () => {
                // Stage 2: Crumble into ash
                this.player.setVisible(false);
                
                // Create burnt crumbs falling
                for (let i = 0; i < 15; i++) {
                    const crumb = this.add.circle(
                        this.player.x + Phaser.Math.Between(-25, 25),
                        this.player.y + Phaser.Math.Between(-25, 25),
                        Phaser.Math.Between(3, 8),
                        Phaser.Math.Between(0, 1) > 0.5 ? 0x3d2817 : 0x1a0f08, // Dark brown/black
                        1
                    );
                    
                    crumb.setDepth(10);
                    
                    // Fall down and fade
                    this.tweens.add({
                        targets: crumb,
                        y: crumb.y + Phaser.Math.Between(80, 150),
                        x: crumb.x + Phaser.Math.Between(-30, 30),
                        alpha: 0,
                        scale: 0.3,
                        duration: Phaser.Math.Between(800, 1200),
                        ease: 'Cubic.easeOut',
                        onComplete: () => crumb.destroy()
                    });
                }
                
                // Smoke puff effect
                for (let i = 0; i < 8; i++) {
                    const smoke = this.add.circle(
                        this.player.x + Phaser.Math.Between(-20, 20),
                        this.player.y,
                        Phaser.Math.Between(8, 15),
                        0x666666,
                        0.4
                    );
                    
                    smoke.setDepth(11);
                    
                    this.tweens.add({
                        targets: smoke,
                        y: smoke.y - Phaser.Math.Between(60, 120),
                        x: smoke.x + Phaser.Math.Between(-40, 40),
                        scale: 2,
                        alpha: 0,
                        duration: 1000,
                        ease: 'Sine.easeOut',
                        onComplete: () => smoke.destroy()
                    });
                }
            }
        });
        
        // Death animation complete - RespawnScene will handle the rest
    }
    

    
    createDeathMarker(x, y) {
        // Create spooky ghost marker
        const markerSize = 60;
        const graphics = this.make.graphics({ x: 0, y: 0 });
        
        // Ghost body - white wispy shape
        graphics.fillStyle(0xffffff, 0.8);
        graphics.beginPath();
        graphics.moveTo(markerSize / 2, 10);
        graphics.lineTo(markerSize / 2 - 20, 15);
        graphics.lineTo(markerSize / 2 - 25, 30);
        graphics.lineTo(markerSize / 2 - 20, 45);
        // Wavy bottom
        graphics.lineTo(markerSize / 2 - 15, 50);
        graphics.lineTo(markerSize / 2 - 10, 45);
        graphics.lineTo(markerSize / 2 - 5, 50);
        graphics.lineTo(markerSize / 2, 45);
        graphics.lineTo(markerSize / 2 + 5, 50);
        graphics.lineTo(markerSize / 2 + 10, 45);
        graphics.lineTo(markerSize / 2 + 15, 50);
        graphics.lineTo(markerSize / 2 + 20, 45);
        graphics.lineTo(markerSize / 2 + 25, 30);
        graphics.lineTo(markerSize / 2 + 20, 15);
        graphics.closePath();
        graphics.fillPath();
        
        // Ghost eyes - dark circles
        graphics.fillStyle(0x000000, 1);
        graphics.fillCircle(markerSize / 2 - 8, 25, 4);
        graphics.fillCircle(markerSize / 2 + 8, 25, 4);
        
        // Ghost mouth - O shape
        graphics.fillCircle(markerSize / 2, 35, 3);
        
        // Glow effect
        graphics.fillStyle(0x9966ff, 0.3);
        graphics.fillCircle(markerSize / 2, 30, 30);
        
        graphics.generateTexture('death-marker', markerSize, markerSize);
        graphics.destroy();
        
        // Create the marker sprite
        const marker = this.add.sprite(x, y - 40, 'death-marker');
        marker.setDepth(1000);
        marker.setAlpha(0);
        
        // Fade in and float up
        this.tweens.add({
            targets: marker,
            alpha: 1,
            y: y - 80,
            duration: 400,
            ease: 'Sine.easeOut',
            onComplete: () => {
                // Fade out after brief display
                this.tweens.add({
                    targets: marker,
                    alpha: 0,
                    y: y - 100,
                    duration: 600,
                    delay: 200,
                    ease: 'Sine.easeIn',
                    onComplete: () => marker.destroy()
                });
            }
        });
        
        // Floating animation
        this.tweens.add({
            targets: marker,
            y: marker.y - 10,
            duration: 800,
            yoyo: true,
            repeat: 1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createLivesUI() {
        this.livesIcons = [];
        
        // Create heart texture once
        if (!this.textures.exists('heart')) {
            const heart = this.add.graphics();
            heart.fillStyle(0xff0000, 1);
            heart.fillCircle(10, 5, 8);
            heart.fillCircle(20, 5, 8);
            heart.fillTriangle(2, 8, 28, 8, 15, 25);
            heart.generateTexture('heart', 30, 30);
            heart.destroy();
        }
        
        // Create container for hearts that stays fixed
        this.livesContainer = this.add.container(0, 0);
        this.livesContainer.setScrollFactor(0);
        this.livesContainer.setDepth(1000);
        
        for (let i = 0; i < 4; i++) {
            const icon = this.add.image(70 + (i * 45), 50, 'heart').setScale(0.9);
            this.livesContainer.add(icon);
            this.livesIcons.push(icon);
        }
    }
    
    updateLivesUI() {
        if (!this.livesIcons) return;
        
        for (let i = 0; i < this.livesIcons.length; i++) {
            this.livesIcons[i].setAlpha(i < this.lives ? 1 : 0.3);
        }
    }
    
    respawnPlayer() {
        // Reset player to last checkpoint (or start position if no checkpoint reached)
        this.player.setPosition(this.currentCheckpoint.x, this.currentCheckpoint.y);
        this.player.setVelocity(0, 0);
        this.player.setAcceleration(0, 0);
        this.player.setVisible(true);
        this.player.setAlpha(1);
        this.player.setScale(1, 1);
        this.player.clearTint(); // Clear any tint from death animation
        this.player.isDead = false;
        
        // Reset to candy form
        if (this.player.currentForm !== 'candy') {
            this.player.transformTo('candy');
        }
        
        this.player.shine.setVisible(true);
        
        // Resume camera following
        this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
        
        this.isRespawning = false;
    }
    
    loseLife() {
        // Deprecated - keeping for compatibility
        this.handleDeath();
    }
    
    showResurrectionScreen() {
        // Get current viewport dimensions
        const centerX = this.cameras.main.width / 2;
        const centerY = this.cameras.main.height / 2;
        
        // Create dark overlay that fills viewport
        const overlay = this.add.rectangle(
            centerX,
            centerY,
            this.cameras.main.width * 2,
            this.cameras.main.height * 2,
            0x000000,
            0.8
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(2000);
        
        // Resurrecting text
        const text = this.add.text(
            centerX,
            centerY - 40,
            'RESURRECTING...',
            {
                fontSize: '64px',
                fill: '#ff6600',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 6
            }
        );
        text.setOrigin(0.5);
        text.setScrollFactor(0);
        text.setDepth(2001);
        
        // Warning message about bats
        const warning = this.add.text(
            centerX,
            centerY + 60,
            '⚠️ BEWARE THE CURSED BATS! ⚠️\nTheir touch is deadly...',
            {
                fontSize: '32px',
                fill: '#ff3333',
                fontStyle: 'italic',
                align: 'center',
                stroke: '#000000',
                strokeThickness: 4
            }
        );
        warning.setOrigin(0.5);
        warning.setScrollFactor(0);
        warning.setDepth(2001);
        
        // Flicker effect on warning
        this.tweens.add({
            targets: warning,
            alpha: 0.5,
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Pulsing animation
        this.tweens.add({
            targets: text,
            alpha: 0.3,
            scale: 1.1,
            duration: 400,
            yoyo: true,
            repeat: 2,
            ease: 'Sine.easeInOut'
        });
        
        // Spooky ghost particles
        for (let i = 0; i < 8; i++) {
            const ghost = this.add.circle(
                centerX + Phaser.Math.Between(-100, 100),
                centerY + Phaser.Math.Between(-50, 50),
                Phaser.Math.Between(10, 20),
                0x9966ff,
                0.6
            );
            ghost.setScrollFactor(0);
            ghost.setDepth(2001);
            
            this.tweens.add({
                targets: ghost,
                y: ghost.y - 100,
                alpha: 0,
                duration: 1500,
                ease: 'Sine.easeOut',
                onComplete: () => ghost.destroy()
            });
        }
        
        // Respawn after animation
        this.time.delayedCall(1800, () => {
            overlay.destroy();
            text.destroy();
            warning.destroy();
            this.player.setPosition(this.currentCheckpoint.x, this.currentCheckpoint.y);
            this.player.setVelocity(0, 0);
            this.isRespawning = false;
        });
    }
    
    reachCheckpoint(player, checkpoint) {
        if (!checkpoint.activated) {
            checkpoint.activate();
            this.currentCheckpoint = { x: checkpoint.x, y: checkpoint.y - 50 };
            
            // Determine which checkpoint this is
            const checkpointIndex = LevelData.checkpoints.findIndex(
                cp => Math.abs(cp.x - checkpoint.x) < 10
            );
            const sectionNumber = checkpointIndex + 2; // Section 2 or 3
            
            // Show checkpoint saved message
            const message = this.add.text(
                this.cameras.main.width / 2,
                100,
                'CHECKPOINT SAVED!',
                {
                    fontSize: '48px',
                    fill: '#00ff00',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 4
                }
            );
            message.setOrigin(0.5);
            message.setScrollFactor(0);
            message.setDepth(1500);
            
            // Show section info
            const sectionText = this.add.text(
                this.cameras.main.width / 2,
                160,
                `Section ${sectionNumber} of 3`,
                {
                    fontSize: '32px',
                    fill: '#ffaa00',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 3
                }
            );
            sectionText.setOrigin(0.5);
            sectionText.setScrollFactor(0);
            sectionText.setDepth(1500);
            
            this.tweens.add({
                targets: [message, sectionText],
                y: '-=20',
                alpha: 0,
                duration: 2000,
                ease: 'Sine.easeOut',
                onComplete: () => {
                    message.destroy();
                    sectionText.destroy();
                }
            });
        }
    }
    
    reachGoal() {
        if (this.goalReached) return;
        this.goalReached = true;
        
        const completionTime = Math.floor((this.time.now - this.startTime) / 1000);
        
        // Disable player controls
        this.player.body.setVelocity(0, 0);
        this.player.body.setAllowGravity(false);
        
        // Animate ball going into bag
        this.tweens.add({
            targets: this.player,
            x: this.goal.x,
            y: this.goal.y - 80,
            scale: 0.3,
            duration: 800,
            ease: 'Sine.easeIn',
            onComplete: () => {
                // Ball disappears into bag
                this.tweens.add({
                    targets: this.player,
                    y: this.goal.y - 60,
                    scale: 0,
                    alpha: 0,
                    duration: 400,
                    ease: 'Power2.easeIn',
                    onComplete: () => {
                        // Show sparkle effect
                        for (let i = 0; i < 20; i++) {
                            const sparkle = this.add.circle(
                                this.goal.x + Phaser.Math.Between(-30, 30),
                                this.goal.y - 60,
                                Phaser.Math.Between(3, 8),
                                0xffaa00,
                                1
                            );
                            
                            this.tweens.add({
                                targets: sparkle,
                                y: sparkle.y - Phaser.Math.Between(50, 100),
                                x: sparkle.x + Phaser.Math.Between(-40, 40),
                                alpha: 0,
                                scale: 0,
                                duration: 1000,
                                ease: 'Sine.easeOut',
                                onComplete: () => sparkle.destroy()
                            });
                        }
                        
                        // Wait a moment then show victory
                        this.time.delayedCall(800, () => {
                            this.scene.start('VictoryScene', { time: completionTime });
                        });
                    }
                });
            }
        });
    }
    
    gameOver() {
        this.scene.start('GameOverScene');
    }
    
    createHalloweenBackground() {
        const width = LevelData.worldBounds.width;
        const height = Math.max(LevelData.worldBounds.height, this.scale.height);
        
        // Create gradient background - purple Halloween night sky
        const graphics = this.add.graphics();
        
        // Purple gradient sky (darker purple at top, lighter purple at horizon)
        for (let i = 0; i < height; i++) {
            const alpha = i / height;
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                { r: 40, g: 20, b: 50 },   // Dark purple at top
                { r: 80, g: 50, b: 90 },   // Medium purple at horizon
                height,
                i
            );
            graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
            graphics.fillRect(0, i, width, 1);
        }
        
        // Fill any remaining space below with dark ground
        graphics.fillStyle(0x0a0a0a, 1);
        graphics.fillRect(0, height, width, 500);
        
        // No stars - cleaner purple sky
        
        // Create huge yellow moon
        const moonX = width * 0.6;
        const moonY = height * 0.25;
        const moonRadius = 200;
        
        // Large atmospheric glow - fixed to camera
        const outerGlow = this.add.circle(moonX, moonY, moonRadius + 100, 0xffcc66, 0.12);
        outerGlow.setDepth(1);
        outerGlow.setScrollFactor(0);
        
        // Medium glow - fixed to camera
        const moonGlow = this.add.circle(moonX, moonY, moonRadius + 50, 0xffdd77, 0.2);
        moonGlow.setDepth(2);
        moonGlow.setScrollFactor(0);
        
        // Main moon - bright yellow, fixed to camera
        const moon = this.add.circle(moonX, moonY, moonRadius, 0xffee88);
        moon.setDepth(3);
        moon.setScrollFactor(0);
        
        // Add moon texture/craters with orange tones - fixed to camera
        const craterGraphics = this.add.graphics();
        craterGraphics.fillStyle(0xffcc66, 0.3);
        craterGraphics.fillCircle(moonX - 60, moonY - 40, 50);
        craterGraphics.fillCircle(moonX + 50, moonY + 30, 40);
        craterGraphics.fillCircle(moonX - 20, moonY + 60, 35);
        craterGraphics.fillCircle(moonX + 70, moonY - 50, 30);
        craterGraphics.fillCircle(moonX - 80, moonY + 25, 25);
        craterGraphics.fillStyle(0xffaa44, 0.2);
        craterGraphics.fillCircle(moonX + 20, moonY - 70, 45);
        craterGraphics.fillCircle(moonX - 40, moonY + 10, 38);
        craterGraphics.setDepth(4);
        craterGraphics.setScrollFactor(0);
        
        // No clouds - clear view of moon
        
        // Create spooky Halloween landscape
        this.createHalloweenCastle(width, height);
        this.createDistantHills(width, height);
        
        // Add soft, blurry fog at the bottom
        // Create multiple layers of very light fog for a soft, blurred effect
        for (let layer = 0; layer < 3; layer++) {
            const fogLayer = this.add.graphics();
            const fogOpacity = 0.04 + (layer * 0.02); // Very light, increasing slightly per layer
            fogLayer.fillStyle(0xaaaacc, fogOpacity);
            
            // Create wider, softer fog shapes
            for (let i = 0; i < 4; i++) {
                const fogX = (width / 4) * i + Phaser.Math.Between(-100, 100);
                const fogY = height - 80 + (layer * 30);
                const fogWidth = width * 0.4;
                const fogHeight = 120 - (layer * 20);
                
                fogLayer.fillEllipse(fogX, fogY, fogWidth, fogHeight);
            }
            
            // Gentle pulsing animation for soft effect
            this.tweens.add({
                targets: fogLayer,
                alpha: fogOpacity * 0.5,
                duration: 5000 + (layer * 1000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createCastleSilhouette(x, height) {
        const castleGraphics = this.add.graphics();
        // Dark silhouette
        castleGraphics.fillStyle(0x0a0a15, 0.9);
        
        const baseY = height - 150;
        const castleWidth = 500;
        const castleHeight = 450;
        
        // Main castle body
        castleGraphics.fillRect(x, baseY - castleHeight, castleWidth, castleHeight);
        
        // Left tower - tall and sharp
        const leftTowerWidth = 90;
        const leftTowerHeight = 600;
        castleGraphics.fillRect(x - 30, baseY - leftTowerHeight, leftTowerWidth, leftTowerHeight);
        // Sharp pointed roof
        castleGraphics.fillTriangle(
            x - 30, baseY - leftTowerHeight,
            x + leftTowerWidth / 2 - 30, baseY - leftTowerHeight - 100,
            x + leftTowerWidth - 30, baseY - leftTowerHeight
        );
        
        // Right tower - tall and sharp
        const rightTowerWidth = 90;
        const rightTowerHeight = 580;
        castleGraphics.fillRect(x + castleWidth - 60, baseY - rightTowerHeight, rightTowerWidth, rightTowerHeight);
        // Sharp pointed roof
        castleGraphics.fillTriangle(
            x + castleWidth - 60, baseY - rightTowerHeight,
            x + castleWidth - 60 + rightTowerWidth / 2, baseY - rightTowerHeight - 95,
            x + castleWidth - 60 + rightTowerWidth, baseY - rightTowerHeight
        );
        
        // Center tower - tallest with very sharp spire
        const centerTowerHeight = 650;
        const centerTowerWidth = 110;
        castleGraphics.fillRect(x + castleWidth / 2 - centerTowerWidth / 2, baseY - centerTowerHeight, centerTowerWidth, centerTowerHeight);
        // Very sharp spire
        castleGraphics.fillTriangle(
            x + castleWidth / 2 - centerTowerWidth / 2, baseY - centerTowerHeight,
            x + castleWidth / 2, baseY - centerTowerHeight - 120,
            x + castleWidth / 2 + centerTowerWidth / 2, baseY - centerTowerHeight
        );
        
        // Additional smaller towers for more detail
        const smallTowerWidth = 60;
        const smallTowerHeight = 480;
        
        // Left-center tower
        castleGraphics.fillRect(x + 120, baseY - smallTowerHeight, smallTowerWidth, smallTowerHeight);
        castleGraphics.fillTriangle(
            x + 120, baseY - smallTowerHeight,
            x + 120 + smallTowerWidth / 2, baseY - smallTowerHeight - 70,
            x + 120 + smallTowerWidth, baseY - smallTowerHeight
        );
        
        // Right-center tower
        castleGraphics.fillRect(x + castleWidth - 180, baseY - smallTowerHeight, smallTowerWidth, smallTowerHeight);
        castleGraphics.fillTriangle(
            x + castleWidth - 180, baseY - smallTowerHeight,
            x + castleWidth - 180 + smallTowerWidth / 2, baseY - smallTowerHeight - 70,
            x + castleWidth - 180 + smallTowerWidth, baseY - smallTowerHeight
        );
        
        // Add battlements on main body
        for (let i = 0; i < 10; i++) {
            const battlementX = x + (i * 50);
            if (i % 2 === 0) {
                castleGraphics.fillRect(battlementX, baseY - castleHeight, 30, -25);
            }
        }
        
        castleGraphics.setDepth(-5);
        
        // Add warm glowing windows
        const windowGraphics = this.add.graphics();
        
        // Tower windows - warm orange glow
        const towerWindows = [
            // Left tower
            { x: x + 15, y: baseY - 500, w: 20, h: 35 },
            { x: x + 15, y: baseY - 400, w: 20, h: 35 },
            { x: x + 15, y: baseY - 300, w: 20, h: 35 },
            // Right tower
            { x: x + castleWidth - 30, y: baseY - 480, w: 20, h: 35 },
            { x: x + castleWidth - 30, y: baseY - 380, w: 20, h: 35 },
            { x: x + castleWidth - 30, y: baseY - 280, w: 20, h: 35 },
            // Center tower
            { x: x + castleWidth / 2 - 10, y: baseY - 550, w: 20, h: 35 },
            { x: x + castleWidth / 2 - 10, y: baseY - 450, w: 20, h: 35 },
            { x: x + castleWidth / 2 - 10, y: baseY - 350, w: 20, h: 35 }
        ];
        
        towerWindows.forEach(win => {
            // Warm orange glow
            windowGraphics.fillStyle(0xff8800, 0.8);
            windowGraphics.fillRect(win.x, win.y, win.w, win.h);
            
            // Add flickering effect
            const windowLight = this.add.rectangle(win.x + win.w / 2, win.y + win.h / 2, win.w, win.h, 0xff8800, 0.8);
            windowLight.setDepth(-4);
            this.tweens.add({
                targets: windowLight,
                alpha: 0.5,
                duration: Phaser.Math.Between(1000, 2500),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Main castle windows - grid pattern
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const winX = x + 130 + (col * 60);
                const winY = baseY - 380 + (row * 70);
                windowGraphics.fillStyle(0xff8800, 0.7);
                windowGraphics.fillRect(winX, winY, 22, 38);
                
                // Flickering
                if (Math.random() > 0.4) {
                    const window = this.add.rectangle(winX + 11, winY + 19, 22, 38, 0xff8800, 0.7);
                    window.setDepth(-4);
                    this.tweens.add({
                        targets: window,
                        alpha: 0.4,
                        duration: Phaser.Math.Between(800, 2000),
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
            }
        }
        
        windowGraphics.setDepth(-4);
    }
    
    createFlyingWitch(width, height) {
        // Create witch silhouette on broomstick
        const startX = -100;
        const startY = height * 0.25;
        
        const witchGraphics = this.add.graphics();
        witchGraphics.fillStyle(0x000000, 0.9);
        
        // Witch body (simplified silhouette)
        witchGraphics.fillCircle(0, 0, 15); // Head
        witchGraphics.fillTriangle(-8, -15, 0, -30, 8, -15); // Pointed hat
        witchGraphics.fillEllipse(0, 20, 18, 30); // Body
        
        // Broomstick
        witchGraphics.fillRect(-40, 25, 80, 4); // Stick
        witchGraphics.fillTriangle(-60, 23, -40, 27, -40, 23); // Bristles
        
        witchGraphics.x = startX;
        witchGraphics.y = startY;
        witchGraphics.setDepth(5);
        
        // Fly across the screen slowly
        this.tweens.add({
            targets: witchGraphics,
            x: width + 100,
            y: startY + Math.sin(startX / 200) * 50,
            duration: 45000,
            repeat: -1,
            ease: 'Linear',
            onUpdate: () => {
                // Add slight bobbing motion
                witchGraphics.y = startY + Math.sin(witchGraphics.x / 200) * 30;
            }
        });
    }
    
    createGlowingJackOLanterns(width, height) {
        // Bright orange jack-o-lanterns with glowing faces - fewer, well-placed
        const lanternPositions = [
            { x: 1200, y: height - 135 },
            { x: 3600, y: height - 138 },
            { x: 6000, y: height - 140 }
        ];
        
        lanternPositions.forEach(pos => {
            const size = Phaser.Math.Between(45, 65);
            
            // Bright orange pumpkin body
            const pumpkin = this.add.circle(pos.x, pos.y, size, 0xff8800);
            pumpkin.setDepth(2);
            
            // Glowing aura
            const glow = this.add.circle(pos.x, pos.y, size + 15, 0xff6600, 0.3);
            glow.setDepth(1);
            this.tweens.add({
                targets: glow,
                scale: 1.2,
                alpha: 0.1,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Bright yellow glowing eyes and mouth
            const faceGraphics = this.add.graphics();
            faceGraphics.fillStyle(0xffff00, 1);
            
            // Triangle eyes
            const eyeSize = size * 0.2;
            faceGraphics.fillTriangle(
                pos.x - size * 0.3, pos.y - size * 0.2,
                pos.x - size * 0.15, pos.y - size * 0.4,
                pos.x - size * 0.0, pos.y - size * 0.2
            );
            faceGraphics.fillTriangle(
                pos.x + size * 0.0, pos.y - size * 0.2,
                pos.x + size * 0.15, pos.y - size * 0.4,
                pos.x + size * 0.3, pos.y - size * 0.2
            );
            
            // Jagged smile
            for (let i = 0; i < 5; i++) {
                const toothX = pos.x - size * 0.3 + (i * size * 0.15);
                faceGraphics.fillTriangle(
                    toothX, pos.y + size * 0.1,
                    toothX + size * 0.07, pos.y + size * 0.3,
                    toothX + size * 0.15, pos.y + size * 0.1
                );
            }
            
            faceGraphics.setDepth(-1);
            
            faceGraphics.setDepth(3);
            
            // Flickering glow effect
            this.tweens.add({
                targets: faceGraphics,
                alpha: 0.7,
                duration: Phaser.Math.Between(300, 800),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
    
    createColorfulGhosts(width, height) {
        // Bright, colorful ghosts that contrast with dark background - reduced count
        const ghostColors = [0x00ffff, 0xff00ff, 0x00ff88];
        
        // Fewer ghosts, strategically placed
        for (let i = 0; i < 5; i++) {
            const x = (width / 5) * i + Phaser.Math.Between(-100, 100);
            const y = Phaser.Math.Between(400, 650);
            const color = Phaser.Utils.Array.GetRandom(ghostColors);
            
            // Ghost body
            const ghost = this.add.ellipse(x, y, 50, 60, color, 0.6);
            ghost.setDepth(2);
            
            // Glowing aura
            const aura = this.add.ellipse(x, y, 70, 80, color, 0.2);
            aura.setDepth(1);
            
            // Wavy bottom
            const waveGraphics = this.add.graphics();
            waveGraphics.fillStyle(color, 0.6);
            waveGraphics.beginPath();
            waveGraphics.moveTo(x - 25, y + 30);
            for (let w = 0; w < 5; w++) {
                waveGraphics.lineTo(x - 25 + w * 12.5, y + 30 + (w % 2 === 0 ? 10 : 0));
            }
            waveGraphics.lineTo(x + 25, y + 20);
            waveGraphics.lineTo(x - 25, y + 20);
            waveGraphics.closePath();
            waveGraphics.fillPath();
            waveGraphics.setDepth(2);
            
            // Bright white eyes
            const eye1 = this.add.circle(x - 12, y - 5, 6, 0xffffff);
            const eye2 = this.add.circle(x + 12, y - 5, 6, 0xffffff);
            eye1.setDepth(3);
            eye2.setDepth(3);
            
            // Floating animation
            this.tweens.add({
                targets: [ghost, aura, waveGraphics, eye1, eye2],
                y: y - 30,
                duration: Phaser.Math.Between(3000, 5000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Pulsing glow
            this.tweens.add({
                targets: aura,
                scale: 1.3,
                alpha: 0.05,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createMagicCauldrons(width, height) {
        // Bright green bubbling cauldrons - fewer for cleaner look
        const cauldronPositions = [
            { x: 2000, y: height - 105 },
            { x: 5000, y: height - 100 }
        ];
        
        cauldronPositions.forEach(pos => {
            // Dark cauldron body
            const cauldron = this.add.ellipse(pos.x, pos.y, 60, 50, 0x222222);
            cauldron.setDepth(2);
            
            // Bright green bubbling liquid
            const liquid = this.add.ellipse(pos.x, pos.y - 15, 50, 20, 0x00ff00, 0.8);
            liquid.setDepth(3);
            
            // Glowing green aura
            const glow = this.add.ellipse(pos.x, pos.y - 15, 70, 40, 0x00ff00, 0.3);
            glow.setDepth(1);
            
            // Bubbles rising
            this.time.addEvent({
                delay: 800,
                callback: () => {
                    const bubble = this.add.circle(
                        pos.x + Phaser.Math.Between(-20, 20),
                        pos.y - 10,
                        Phaser.Math.Between(3, 8),
                        0x88ff88,
                        0.8
                    );
                    bubble.setDepth(3);
                    
                    this.tweens.add({
                        targets: bubble,
                        y: pos.y - 80,
                        alpha: 0,
                        duration: 2000,
                        ease: 'Sine.easeOut',
                        onComplete: () => bubble.destroy()
                    });
                },
                loop: true
            });
            
            // Pulsing glow
            this.tweens.add({
                targets: [liquid, glow],
                alpha: liquid.alpha * 0.5,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }
    
    createHangingLanterns(width, height) {
        // Colorful hanging lanterns at various heights - reduced for cleaner look
        const lanternColors = [0xff3366, 0xffaa00, 0xff00ff];
        
        // Fewer lanterns, well-spaced
        for (let i = 0; i < 6; i++) {
            const x = (width / 6) * i + Phaser.Math.Between(-50, 50);
            const y = Phaser.Math.Between(250, 450);
            const color = Phaser.Utils.Array.GetRandom(lanternColors);
            
            // Hanging rope
            const rope = this.add.line(0, 0, x, y - 80, x, y - 30, 0x666666, 0.5);
            rope.setOrigin(0, 0);
            rope.setDepth(2);
            
            // Bright lantern
            const lantern = this.add.rectangle(x, y, 30, 40, color, 0.9);
            lantern.setDepth(3);
            
            // Glowing aura
            const glow = this.add.rectangle(x, y, 50, 60, color, 0.3);
            glow.setDepth(1);
            
            // Swaying animation
            this.tweens.add({
                targets: [rope, lantern, glow],
                x: x + Phaser.Math.Between(-15, 15),
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Pulsing glow
            this.tweens.add({
                targets: glow,
                scale: 1.4,
                alpha: 0.1,
                duration: 1800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createSpookyEyes(width, height) {
        // Glowing eyes peering from dark areas - fewer for subtlety
        const eyeColors = [0xff0000, 0xffff00];
        
        // Fewer eyes, more mysterious
        for (let i = 0; i < 8; i++) {
            const x = (width / 8) * i + Phaser.Math.Between(-100, 100);
            const y = Phaser.Math.Between(550, 750);
            const color = Phaser.Utils.Array.GetRandom(eyeColors);
            const eyeSize = Phaser.Math.Between(8, 12);
            
            // Left eye
            const eye1 = this.add.circle(x - 15, y, eyeSize, color, 0.9);
            eye1.setDepth(3);
            
            // Right eye
            const eye2 = this.add.circle(x + 15, y, eyeSize, color, 0.9);
            eye2.setDepth(3);
            
            // Glowing effect
            const glow1 = this.add.circle(x - 15, y, eyeSize + 5, color, 0.3);
            const glow2 = this.add.circle(x + 15, y, eyeSize + 5, color, 0.3);
            glow1.setDepth(1);
            glow2.setDepth(1);
            
            // Blinking animation
            this.time.addEvent({
                delay: Phaser.Math.Between(3000, 8000),
                callback: () => {
                    this.tweens.add({
                        targets: [eye1, eye2],
                        scaleY: 0.1,
                        duration: 100,
                        yoyo: true,
                        ease: 'Linear'
                    });
                },
                loop: true
            });
            
            // Pulsing glow
            this.tweens.add({
                targets: [glow1, glow2],
                scale: 1.5,
                alpha: 0.1,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createBackgroundPumpkins(width, height) {
        const pumpkinGraphics = this.add.graphics();
        
        // Create a few pumpkins scattered in the background - minimal
        const pumpkinPositions = [
            { x: width * 0.2, y: height - 120, size: 55 },
            { x: width * 0.5, y: height - 110, size: 50 },
            { x: width * 0.8, y: height - 115, size: 52 }
        ];
        
        pumpkinPositions.forEach(pos => {
            // Pumpkin body - darker, more muted orange
            pumpkinGraphics.fillStyle(0xcc4400, 0.25);
            pumpkinGraphics.fillEllipse(pos.x, pos.y, pos.size, pos.size * 0.9);
            
            // Pumpkin ridges - very subtle
            pumpkinGraphics.lineStyle(2, 0x993300, 0.2);
            for (let i = -1; i <= 1; i++) {
                pumpkinGraphics.beginPath();
                pumpkinGraphics.moveTo(pos.x + (i * pos.size / 4), pos.y - pos.size / 2);
                pumpkinGraphics.lineTo(pos.x + (i * pos.size / 4), pos.y + pos.size / 2);
                pumpkinGraphics.strokePath();
            }
            
            // Glowing jack-o-lantern face - softer glow
            const faceGraphics = this.add.graphics();
            faceGraphics.fillStyle(0xff8800, 0.4);
            
            // Eyes (triangles)
            faceGraphics.fillTriangle(
                pos.x - pos.size / 4, pos.y - pos.size / 6,
                pos.x - pos.size / 6, pos.y - pos.size / 4,
                pos.x - pos.size / 8, pos.y - pos.size / 6
            );
            faceGraphics.fillTriangle(
                pos.x + pos.size / 8, pos.y - pos.size / 6,
                pos.x + pos.size / 6, pos.y - pos.size / 4,
                pos.x + pos.size / 4, pos.y - pos.size / 6
            );
            
            // Nose (small triangle)
            faceGraphics.fillTriangle(
                pos.x - 5, pos.y,
                pos.x, pos.y - 10,
                pos.x + 5, pos.y
            );
            
            // Mouth (jagged smile)
            faceGraphics.lineStyle(2, 0xff8800, 0.4);
            faceGraphics.beginPath();
            faceGraphics.moveTo(pos.x - pos.size / 3, pos.y + pos.size / 6);
            for (let i = 0; i < 6; i++) {
                const mx = pos.x - pos.size / 3 + (i * pos.size / 9);
                const my = pos.y + pos.size / 6 + (i % 2 === 0 ? 8 : 0);
                faceGraphics.lineTo(mx, my);
            }
            faceGraphics.strokePath();
            faceGraphics.setDepth(-1);
            
            // Add subtle glow effect
            const glow = this.add.circle(pos.x, pos.y, pos.size * 0.6, 0xff6600, 0.08);
            glow.setDepth(-1);
            this.tweens.add({
                targets: glow,
                alpha: 0.03,
                duration: Phaser.Math.Between(1500, 2500),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Pumpkin stem - very dark
            pumpkinGraphics.fillStyle(0x1a0f08, 0.3);
            pumpkinGraphics.fillRect(pos.x - 8, pos.y - pos.size / 2 - 15, 16, 20);
        });
        pumpkinGraphics.setDepth(-1);
    }
    
    createSpookyTrees(width, height) {
        // Create a few prominent spooky trees with faces - minimal placement
        const treePositions = [
            { x: width * 0.15, scale: 1.1, depth: 0.85 },
            { x: width * 0.5, scale: 0.95, depth: 0.75 },
            { x: width * 0.85, scale: 1.05, depth: 0.8 }
        ];
        
        treePositions.forEach(pos => {
            this.createSingleSpookyTree(pos.x, height, pos.scale, pos.depth);
        });
    }
    
    createSingleSpookyTree(x, groundY, scale = 1, depthAlpha = 0.85) {
        const treeGraphics = this.add.graphics();
        // Use dark brown/gray for visible tree silhouette
        treeGraphics.fillStyle(0x2a2a2a, 1.0);
        
        // Tree dimensions
        const trunkWidth = 80 * scale;
        const trunkHeight = 400 * scale;
        const baseY = groundY - 50;
        
        // Draw main trunk (wider at base, narrower at top)
        const trunkPoints = [
            x - trunkWidth / 2, baseY,
            x - trunkWidth / 3, baseY - trunkHeight,
            x + trunkWidth / 3, baseY - trunkHeight,
            x + trunkWidth / 2, baseY
        ];
        treeGraphics.fillPoints(trunkPoints, true);
        
        // Draw gnarled, twisted branches
        const branches = [
            // Left side branches
            { startY: 0.3, angle: -45, length: 150, curve: 20 },
            { startY: 0.5, angle: -60, length: 120, curve: -15 },
            { startY: 0.7, angle: -30, length: 100, curve: 25 },
            // Right side branches
            { startY: 0.35, angle: 45, length: 140, curve: -20 },
            { startY: 0.55, angle: 50, length: 110, curve: 15 },
            { startY: 0.75, angle: 35, length: 90, curve: -25 },
            // Top branches
            { startY: 0.15, angle: -70, length: 80, curve: 10 },
            { startY: 0.2, angle: 70, length: 85, curve: -10 }
        ];
        
        branches.forEach(branch => {
            const startY = baseY - (trunkHeight * branch.startY);
            const startX = x;
            const rad = Phaser.Math.DegToRad(branch.angle);
            const length = branch.length * scale;
            
            // Draw twisted branch with multiple segments
            const segments = 5;
            let currentX = startX;
            let currentY = startY;
            let currentAngle = branch.angle;
            
            for (let i = 0; i < segments; i++) {
                const segmentLength = length / segments;
                const segmentWidth = (15 - i * 2) * scale;
                
                // Add curve to make it twisted
                currentAngle += branch.curve / segments;
                const segRad = Phaser.Math.DegToRad(currentAngle);
                
                const endX = currentX + Math.cos(segRad) * segmentLength;
                const endY = currentY + Math.sin(segRad) * segmentLength;
                
                // Draw branch segment
                const perpAngle = segRad + Math.PI / 2;
                const halfWidth = segmentWidth / 2;
                
                treeGraphics.fillPoints([
                    currentX + Math.cos(perpAngle) * halfWidth, currentY + Math.sin(perpAngle) * halfWidth,
                    currentX - Math.cos(perpAngle) * halfWidth, currentY - Math.sin(perpAngle) * halfWidth,
                    endX - Math.cos(perpAngle) * (halfWidth * 0.7), endY - Math.sin(perpAngle) * (halfWidth * 0.7),
                    endX + Math.cos(perpAngle) * (halfWidth * 0.7), endY + Math.sin(perpAngle) * (halfWidth * 0.7)
                ], true);
                
                currentX = endX;
                currentY = endY;
                
                // Add small twigs at the end
                if (i === segments - 1) {
                    for (let t = 0; t < 3; t++) {
                        const twigAngle = currentAngle + Phaser.Math.Between(-40, 40);
                        const twigRad = Phaser.Math.DegToRad(twigAngle);
                        const twigLength = Phaser.Math.Between(15, 30) * scale;
                        const twigEndX = currentX + Math.cos(twigRad) * twigLength;
                        const twigEndY = currentY + Math.sin(twigRad) * twigLength;
                        
                        treeGraphics.lineStyle(3 * scale, 0x2a2a2a, 1.0);
                        treeGraphics.beginPath();
                        treeGraphics.moveTo(currentX, currentY);
                        treeGraphics.lineTo(twigEndX, twigEndY);
                        treeGraphics.strokePath();
                    }
                }
            }
        });
        
        // Create spooky glowing face on the trunk
        const faceY = baseY - trunkHeight * 0.5;
        const faceGraphics = this.add.graphics();
        
        // Glowing eyes (triangular and menacing) - more subtle
        const eyeColor = 0xff9900;
        const eyeAlpha = 0.5;
        faceGraphics.fillStyle(eyeColor, eyeAlpha);
        
        // Left eye
        const leftEyeX = x - 25 * scale;
        faceGraphics.fillTriangle(
            leftEyeX - 15 * scale, faceY - 5 * scale,
            leftEyeX, faceY - 25 * scale,
            leftEyeX + 15 * scale, faceY - 5 * scale
        );
        
        // Right eye
        const rightEyeX = x + 25 * scale;
        faceGraphics.fillTriangle(
            rightEyeX - 15 * scale, faceY - 5 * scale,
            rightEyeX, faceY - 25 * scale,
            rightEyeX + 15 * scale, faceY - 5 * scale
        );
        
        // Jagged, evil grin
        faceGraphics.lineStyle(4 * scale, eyeColor, eyeAlpha);
        faceGraphics.beginPath();
        faceGraphics.moveTo(x - 35 * scale, faceY + 30 * scale);
        
        // Create zigzag mouth
        const mouthPoints = 8;
        for (let i = 0; i <= mouthPoints; i++) {
            const mx = x - 35 * scale + (i * 70 * scale / mouthPoints);
            const my = faceY + 30 * scale + (i % 2 === 0 ? 0 : 12 * scale);
            faceGraphics.lineTo(mx, my);
        }
        faceGraphics.strokePath();
        
        // Add subtle glowing effect around the face
        const glowLeft = this.add.circle(leftEyeX, faceY - 10 * scale, 20 * scale, eyeColor, 0.12);
        const glowRight = this.add.circle(rightEyeX, faceY - 10 * scale, 20 * scale, eyeColor, 0.12);
        const glowMouth = this.add.ellipse(x, faceY + 35 * scale, 80 * scale, 30 * scale, eyeColor, 0.08);
        
        // Subtle pulsing glow animation
        this.tweens.add({
            targets: [glowLeft, glowRight, glowMouth],
            alpha: 0.03,
            duration: Phaser.Math.Between(2000, 3500),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Occasionally flicker the eyes for extra spookiness
        this.time.addEvent({
            delay: Phaser.Math.Between(5000, 10000),
            callback: () => {
                this.tweens.add({
                    targets: faceGraphics,
                    alpha: 0,
                    duration: 100,
                    yoyo: true,
                    repeat: 1
                });
            },
            loop: true
        });
    }
    
    createGraveyard(width, height) {
        // Create graveyard sections at different positions - minimal and subtle
        const graveyardPositions = [
            { x: width * 0.15, tombstones: 3 },
            { x: width * 0.45, tombstones: 2 },
            { x: width * 0.75, tombstones: 3 }
        ];
        
        graveyardPositions.forEach(graveyard => {
            for (let i = 0; i < graveyard.tombstones; i++) {
                const tombX = graveyard.x + Phaser.Math.Between(-150, 150);
                const tombY = height - Phaser.Math.Between(80, 120);
                this.createTombstone(tombX, tombY);
            }
        });
    }
    
    createTombstone(x, y) {
        const graphics = this.add.graphics();
        // Dark bluish-gray stone color, very subtle
        graphics.fillStyle(0x1a1a2e, 0.4);
        
        // Tombstone body
        const width = Phaser.Math.Between(30, 50);
        const height = Phaser.Math.Between(60, 90);
        graphics.fillRect(x - width / 2, y - height, width, height);
        
        // Rounded top
        graphics.fillCircle(x, y - height, width / 2);
        
        // Cross or RIP marking - very dark and subtle
        graphics.fillStyle(0x0a0a15, 0.5);
        if (Math.random() > 0.5) {
            // Cross
            graphics.fillRect(x - 3, y - height + 15, 6, 25);
            graphics.fillRect(x - 10, y - height + 22, 20, 6);
        } else {
            // RIP text (simple rectangles)
            graphics.fillRect(x - 12, y - height + 20, 8, 15);
            graphics.fillRect(x - 2, y - height + 20, 4, 15);
            graphics.fillRect(x + 6, y - height + 20, 8, 15);
        }
        
        // Slight tilt for variety
        graphics.rotation = Phaser.Math.FloatBetween(-0.1, 0.1);
        graphics.setDepth(-2);
    }
    
    createHauntedFence(width, height) {
        // Create fence sections throughout the level
        const fenceY = height - 60;
        
        for (let x = 0; x < width; x += 200) {
            // Skip some sections for variety
            if (Math.random() > 0.3) {
                this.createFenceSection(x, fenceY);
            }
        }
    }
    
    createFenceSection(x, y) {
        const graphics = this.add.graphics();
        // Very dark brown, almost black, subtle
        graphics.fillStyle(0x1a0f08, 0.35);
        
        // Fence posts
        for (let i = 0; i < 4; i++) {
            const postX = x + (i * 50);
            const postHeight = Phaser.Math.Between(40, 50);
            
            // Post
            graphics.fillRect(postX, y - postHeight, 8, postHeight);
            
            // Pointed top
            graphics.fillTriangle(
                postX, y - postHeight - 10,
                postX + 4, y - postHeight,
                postX + 8, y - postHeight - 10
            );
            
            // Horizontal rail
            if (i < 3) {
                graphics.fillRect(postX + 8, y - postHeight + 15, 42, 6);
            }
        }
        graphics.setDepth(-2);
    }
    
    createBackgroundBats(width, height) {
        // Create a few bats flying in the background - minimal
        for (let i = 0; i < 4; i++) {
            const batX = Phaser.Math.Between(0, width);
            const batY = Phaser.Math.Between(100, height * 0.5);
            this.createFlyingBat(batX, batY);
        }
    }
    
    createFlyingBat(startX, startY) {
        const bat = this.add.graphics();
        // Very dark, almost silhouette, subtle presence
        bat.fillStyle(0x0a0a15, 0.3);
        
        // Simple bat silhouette
        bat.fillTriangle(-8, 0, -15, -5, -10, 5);  // Left wing
        bat.fillTriangle(8, 0, 15, -5, 10, 5);     // Right wing
        bat.fillCircle(0, 0, 4);                    // Body
        
        bat.x = startX;
        bat.y = startY;
        bat.setDepth(-5);
        
        // Flying animation - move across screen
        const direction = Math.random() > 0.5 ? 1 : -1;
        const endX = direction > 0 ? startX + 2000 : startX - 2000;
        
        this.tweens.add({
            targets: bat,
            x: endX,
            duration: Phaser.Math.Between(15000, 25000),
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
        
        // Bobbing motion
        this.tweens.add({
            targets: bat,
            y: startY + 30,
            duration: Phaser.Math.Between(2000, 3000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Wing flap (scale)
        this.tweens.add({
            targets: bat,
            scaleX: 1.2,
            duration: 300,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createFloatingGhosts(width, height) {
        // Create a few floating ghosts - very minimal
        for (let i = 0; i < 3; i++) {
            const ghostX = Phaser.Math.Between(0, width);
            const ghostY = Phaser.Math.Between(200, height * 0.6);
            this.createGhost(ghostX, ghostY);
        }
    }
    
    createGhost(startX, startY) {
        const ghost = this.add.graphics();
        // Soft bluish-white, very ethereal and subtle
        ghost.fillStyle(0xccccff, 0.08);
        
        // Ghost body
        ghost.fillCircle(0, -15, 20);
        ghost.fillRect(-20, -15, 40, 30);
        
        // Wavy bottom
        ghost.beginPath();
        ghost.moveTo(-20, 15);
        for (let i = 0; i <= 4; i++) {
            const x = -20 + (i * 10);
            const y = 15 + (i % 2 === 0 ? 5 : 0);
            ghost.lineTo(x, y);
        }
        ghost.lineTo(-20, 15);
        ghost.closePath();
        ghost.fillPath();
        
        // Eyes - barely visible
        ghost.fillStyle(0x000000, 0.15);
        ghost.fillCircle(-8, -15, 3);
        ghost.fillCircle(8, -15, 3);
        
        ghost.x = startX;
        ghost.y = startY;
        ghost.setDepth(-3);
        
        // Floating animation
        this.tweens.add({
            targets: ghost,
            y: startY - 50,
            duration: Phaser.Math.Between(4000, 6000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Horizontal drift
        this.tweens.add({
            targets: ghost,
            x: startX + Phaser.Math.Between(-100, 100),
            duration: Phaser.Math.Between(8000, 12000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Fade in and out
        this.tweens.add({
            targets: ghost,
            alpha: 0.05,
            duration: Phaser.Math.Between(3000, 5000),
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    createHalloweenCastle(width, height) {
        // Large spooky castle in the background - fixed to camera with parallax
        const castleX = 200;
        const castleY = 300;
        
        const castleGraphics = this.add.graphics();
        castleGraphics.fillStyle(0x0a0a15, 0.9);
        
        const baseY = castleY + 200;
        const castleWidth = 400;
        const castleHeight = 350;
        
        // Main castle body
        castleGraphics.fillRect(castleX, baseY - castleHeight, castleWidth, castleHeight);
        
        // Left tower - tall with sharp spire
        const leftTowerWidth = 80;
        const leftTowerHeight = 450;
        castleGraphics.fillRect(castleX - 20, baseY - leftTowerHeight, leftTowerWidth, leftTowerHeight);
        castleGraphics.fillTriangle(
            castleX - 20, baseY - leftTowerHeight,
            castleX + leftTowerWidth / 2 - 20, baseY - leftTowerHeight - 80,
            castleX + leftTowerWidth - 20, baseY - leftTowerHeight
        );
        
        // Right tower - tall with sharp spire
        const rightTowerWidth = 80;
        const rightTowerHeight = 430;
        castleGraphics.fillRect(castleX + castleWidth - 60, baseY - rightTowerHeight, rightTowerWidth, rightTowerHeight);
        castleGraphics.fillTriangle(
            castleX + castleWidth - 60, baseY - rightTowerHeight,
            castleX + castleWidth - 60 + rightTowerWidth / 2, baseY - rightTowerHeight - 75,
            castleX + castleWidth - 60 + rightTowerWidth, baseY - rightTowerHeight
        );
        
        // Center tower - tallest
        const centerTowerHeight = 500;
        const centerTowerWidth = 100;
        castleGraphics.fillRect(castleX + castleWidth / 2 - centerTowerWidth / 2, baseY - centerTowerHeight, centerTowerWidth, centerTowerHeight);
        castleGraphics.fillTriangle(
            castleX + castleWidth / 2 - centerTowerWidth / 2, baseY - centerTowerHeight,
            castleX + castleWidth / 2, baseY - centerTowerHeight - 100,
            castleX + castleWidth / 2 + centerTowerWidth / 2, baseY - centerTowerHeight
        );
        
        // Battlements
        for (let i = 0; i < 8; i++) {
            const battlementX = castleX + (i * 50);
            if (i % 2 === 0) {
                castleGraphics.fillRect(battlementX, baseY - castleHeight, 30, -20);
            }
        }
        
        castleGraphics.setDepth(1);
        castleGraphics.setScrollFactor(0.2); // Parallax effect - moves slowly with camera
        
        // Add warm glowing windows
        const windows = [
            // Left tower
            { x: castleX + 20, y: baseY - 380, w: 18, h: 30 },
            { x: castleX + 20, y: baseY - 300, w: 18, h: 30 },
            { x: castleX + 20, y: baseY - 220, w: 18, h: 30 },
            // Right tower
            { x: castleX + castleWidth - 30, y: baseY - 360, w: 18, h: 30 },
            { x: castleX + castleWidth - 30, y: baseY - 280, w: 18, h: 30 },
            { x: castleX + castleWidth - 30, y: baseY - 200, w: 18, h: 30 },
            // Center tower
            { x: castleX + castleWidth / 2 - 9, y: baseY - 420, w: 18, h: 30 },
            { x: castleX + castleWidth / 2 - 9, y: baseY - 340, w: 18, h: 30 },
            { x: castleX + castleWidth / 2 - 9, y: baseY - 260, w: 18, h: 30 }
        ];
        
        windows.forEach(win => {
            const light = this.add.rectangle(win.x, win.y, win.w, win.h, 0xff8800, 0.8);
            light.setDepth(2);
            light.setScrollFactor(0.2);
            this.tweens.add({
                targets: light,
                alpha: 0.5,
                duration: Phaser.Math.Between(1500, 2500),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Main castle windows
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const winX = castleX + 120 + (col * 60);
                const winY = baseY - 280 + (row * 70);
                const window = this.add.rectangle(winX, winY, 20, 35, 0xff8800, 0.7);
                window.setDepth(2);
                window.setScrollFactor(0.2);
                
                if (Math.random() > 0.5) {
                    this.tweens.add({
                        targets: window,
                        alpha: 0.4,
                        duration: Phaser.Math.Between(1200, 2200),
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
            }
        }
    }
    
    createDistantHills(width, height) {
        // Create rolling purple hills in layers
        const hillLayers = [
            { color: 0x3d2645, alpha: 0.6, yOffset: 350, count: 3 },
            { color: 0x4a2f52, alpha: 0.7, yOffset: 280, count: 4 },
            { color: 0x5a3a62, alpha: 0.8, yOffset: 220, count: 5 }
        ];
        
        hillLayers.forEach((layer, index) => {
            for (let i = 0; i < layer.count; i++) {
                const hillX = (width / layer.count) * i + (width / layer.count / 2);
                const hillY = height - layer.yOffset + Math.sin(i * Math.PI / 2) * 40;
                const hillWidth = width / layer.count * 1.8;
                const hillHeight = 200 + Math.random() * 80;
                
                const hill = this.add.ellipse(hillX, hillY, hillWidth, hillHeight, layer.color, layer.alpha);
                hill.setDepth(-10 + index);
            }
        });
    }
    
    createGroundMist(width, height) {
        // Create low-lying mist that hugs the ground
        const mistY = height - 40;
        
        for (let i = 0; i < width; i += 300) {
            const mist = this.add.graphics();
            mist.fillStyle(0x9999cc, 0.03);
            
            // Create wispy mist patches
            const mistWidth = Phaser.Math.Between(200, 400);
            const mistHeight = Phaser.Math.Between(30, 60);
            
            mist.fillEllipse(i + Phaser.Math.Between(-50, 50), mistY, mistWidth, mistHeight);
            mist.setDepth(-1);
            
            // Slow drifting animation
            this.tweens.add({
                targets: mist,
                x: mist.x + Phaser.Math.Between(20, 50),
                alpha: 0.01,
                duration: Phaser.Math.Between(8000, 12000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }
    
    createWaterAreas() {
        this.waterBodies = [];
        
        LevelData.waterAreas.forEach(waterData => {
            // Create main water body with gradient effect
            const waterGraphics = this.add.graphics();
            
            // Draw water with gradient (darker at bottom, lighter at top)
            const left = waterData.x - waterData.width / 2;
            const top = waterData.y - waterData.height / 2;
            
            // Bottom layer - darker blue
            waterGraphics.fillStyle(0x1a4d7a, 0.7);
            waterGraphics.fillRect(left, top + 20, waterData.width, waterData.height - 20);
            
            // Middle layer - medium blue
            waterGraphics.fillStyle(0x2266aa, 0.6);
            waterGraphics.fillRect(left, top + 10, waterData.width, waterData.height - 30);
            
            // Top layer - lighter blue
            waterGraphics.fillStyle(0x3388cc, 0.5);
            waterGraphics.fillRect(left, top, waterData.width, 20);
            
            waterGraphics.setDepth(1);
            
            // Add animated wave overlay
            const wave1 = this.add.rectangle(
                waterData.x,
                waterData.y - waterData.height / 2 + 8,
                waterData.width,
                16,
                0x5599dd,
                0.4
            );
            wave1.setDepth(2);
            
            this.tweens.add({
                targets: wave1,
                alpha: 0.2,
                scaleY: 1.2,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Add surface shimmer/reflection
            const shimmer = this.add.rectangle(
                waterData.x,
                waterData.y - waterData.height / 2 + 3,
                waterData.width,
                6,
                0x88ccff,
                0.5
            );
            shimmer.setDepth(2);
            
            this.tweens.add({
                targets: shimmer,
                alpha: 0.3,
                scaleX: 1.03,
                duration: 1800,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Add subtle ripple effect
            const ripple = this.add.ellipse(
                waterData.x,
                waterData.y - waterData.height / 2 + 10,
                waterData.width * 0.8,
                12,
                0x6699ff,
                0.3
            );
            ripple.setDepth(1);
            
            this.tweens.add({
                targets: ripple,
                scaleX: 1.05,
                alpha: 0.15,
                duration: 2200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Store water bounds for physics
            this.waterBodies.push({
                left: waterData.x - waterData.width / 2,
                right: waterData.x + waterData.width / 2,
                top: waterData.y - waterData.height / 2,
                bottom: waterData.y + waterData.height / 2,
                surfaceY: waterData.y - waterData.height / 2
            });
        });
    }
    
    checkWaterPhysics() {
        if (this.player.currentForm !== 'marshmallow') {
            this.player.inWater = false;
            this.player.justEnteredWater = false;
            return;
        }
        
        // Check if marshmallow is in water
        let inWater = false;
        let waterSurface = 0;
        let nearEdge = false;
        let waterLeft = 0;
        let waterRight = 0;
        
        this.waterBodies.forEach(water => {
            if (this.player.x >= water.left && 
                this.player.x <= water.right &&
                this.player.y >= water.top - 50 &&
                this.player.y <= water.bottom) {
                inWater = true;
                waterSurface = water.surfaceY;
                waterLeft = water.left;
                waterRight = water.right;
                
                // Check if near edge
                const distToLeftEdge = this.player.x - water.left;
                const distToRightEdge = water.right - this.player.x;
                nearEdge = distToLeftEdge < 120 || distToRightEdge < 120;
            }
        });
        
        // Detect water entry
        if (inWater && !this.player.inWater) {
            this.player.justEnteredWater = true;
            this.player.waterEntryVelocity = this.player.body.velocity.y;
            
            // Create splash effect based on entry velocity
            const splashIntensity = Math.min(Math.abs(this.player.waterEntryVelocity) / 500, 1);
            this.createWaterSplash(this.player.x, waterSurface, splashIntensity);
            
            // Initial dip based on entry velocity
            this.player.waterDipAmount = Math.min(Math.abs(this.player.waterEntryVelocity) / 30, 25);
            this.player.waterDipRecovery = 0;
        }
        
        this.player.inWater = inWater;
        
        if (inWater) {
            // Update gentle bobbing phase
            this.player.waterBobPhase += this.player.waterBobSpeed;
            
            // Smooth sinusoidal bobbing - gentle and natural
            const bobOffset = Math.sin(this.player.waterBobPhase) * 6;
            
            // Handle landing dip recovery
            if (this.player.waterDipAmount > 0) {
                this.player.waterDipRecovery += 0.04;
                const recoveryEase = 1 - Math.pow(1 - this.player.waterDipRecovery, 3); // Cubic ease-out
                this.player.waterDipAmount *= (1 - recoveryEase * 0.15);
                
                if (this.player.waterDipRecovery >= 1) {
                    this.player.waterDipAmount = 0;
                    this.player.waterDipRecovery = 0;
                }
            }
            
            // Movement affects bobbing - creates natural water interaction
            const horizontalSpeed = Math.abs(this.player.body.velocity.x);
            if (horizontalSpeed > 50) {
                // Faster movement creates more turbulence
                this.player.waterBobSpeed = 0.02 + (horizontalSpeed / 10000);
            } else {
                // Calm water when still
                this.player.waterBobSpeed = 0.02;
            }
            
            // Water resistance - more realistic drag
            const waterDrag = 180 + (horizontalSpeed * 0.5); // Increases with speed
            this.player.body.setDrag(waterDrag, 0);
            
            // Smooth rotation in water - marshmallow tilts slightly with movement
            const targetRotation = (this.player.body.velocity.x / 300) * 0.15;
            this.player.rotation += (targetRotation - this.player.rotation) * 0.1;
            
            // Check if trying to climb out at edges - this takes priority
            let isClimbing = false;
            if (nearEdge) {
                const movingLeft = this.player.body.velocity.x < -20;
                const movingRight = this.player.body.velocity.x > 20;
                const atLeftEdge = this.player.x - waterLeft < 120;
                const atRightEdge = waterRight - this.player.x < 120;
                
                if ((movingLeft && atLeftEdge) || (movingRight && atRightEdge)) {
                    isClimbing = true;
                    
                    // Strong upward boost for climbing out
                    const edgeDistance = Math.min(
                        atLeftEdge ? this.player.x - waterLeft : waterRight - this.player.x,
                        120
                    );
                    const climbStrength = 1 - (edgeDistance / 120);
                    const climbBoost = climbStrength * -600; // Stronger boost
                    this.player.body.setVelocityY(climbBoost);
                    
                    // Position adjustment for smooth climb
                    this.player.y -= 5;
                    
                    // Strong horizontal boost
                    const horizontalBoost = climbStrength * 280;
                    if (movingRight) {
                        this.player.body.setVelocityX(Math.max(this.player.body.velocity.x, horizontalBoost));
                    } else if (movingLeft) {
                        this.player.body.setVelocityX(Math.min(this.player.body.velocity.x, -horizontalBoost));
                    }
                }
            }
            
            // Only apply floating physics if not climbing
            if (!isClimbing) {
                // Calculate target position with bob and dip
                const targetY = waterSurface + 15 + bobOffset + this.player.waterDipAmount;
                
                // Enhanced spring physics for smooth, realistic floating
                const distToTarget = targetY - this.player.y;
                
                // Adaptive spring constant - stronger when far from target
                const distanceFactor = Math.min(Math.abs(distToTarget) / 20, 1);
                const springConstant = 6 + (distanceFactor * 4); // 6-10 range
                const springForce = distToTarget * springConstant;
                
                // Velocity-based dampening for smooth motion
                const dampeningFactor = 0.6;
                const dampening = this.player.body.velocity.y * -dampeningFactor;
                
                // Apply buoyancy force
                const buoyancy = springForce + dampening;
                this.player.body.setVelocityY(buoyancy);
                
                // Add slight vertical oscillation when moving
                if (horizontalSpeed > 50) {
                    const movementWave = Math.sin(this.player.waterBobPhase * 2) * 2;
                    this.player.body.setVelocityY(this.player.body.velocity.y + movementWave);
                }
            }
            
            this.player.justEnteredWater = false;
        } else {
            // Not in water - reset drag and water state
            this.player.body.setDrag(50, 0);
            this.player.waterDipAmount = 0;
            this.player.waterDipRecovery = 0;
            this.player.waterBobSpeed = 0.02;
        }
    }
    
    createWaterSplash(x, y, intensity) {
        // Create splash particles based on intensity
        const particleCount = Math.floor(8 + intensity * 12);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI / 3) + (Math.random() - 0.5) * (Math.PI / 2); // Upward spray
            const speed = 100 + Math.random() * 150 * intensity;
            const size = 3 + Math.random() * 4 * intensity;
            
            const particle = this.add.circle(
                x + (Math.random() - 0.5) * 40,
                y,
                size,
                0x5599dd,
                0.8
            );
            particle.setDepth(10);
            
            const velocityX = Math.cos(angle - Math.PI / 2) * speed * (Math.random() > 0.5 ? 1 : -1);
            const velocityY = Math.sin(angle - Math.PI / 2) * speed * -1;
            
            this.tweens.add({
                targets: particle,
                x: particle.x + velocityX * 0.3,
                y: particle.y + velocityY * 0.3,
                alpha: 0,
                scale: 0.3,
                duration: 400 + Math.random() * 200,
                ease: 'Cubic.easeOut',
                onComplete: () => particle.destroy()
            });
        }
        
        // Add ripple effect at entry point
        const ripple = this.add.circle(x, y, 10, 0x88ccff, 0.6);
        ripple.setDepth(9);
        
        this.tweens.add({
            targets: ripple,
            scale: 4 + intensity * 2,
            alpha: 0,
            duration: 600,
            ease: 'Sine.easeOut',
            onComplete: () => ripple.destroy()
        });
    }
    
    createCrows() {
        // Create initial crows flying across the top
        const crowCount = 3;
        for (let i = 0; i < crowCount; i++) {
            const direction = Math.random() > 0.5 ? 1 : -1;
            const startX = direction === 1 ? -100 : LevelData.worldBounds.width + 100;
            const y = Phaser.Math.Between(100, 300);
            
            const crow = new Crow(this, startX, y, direction);
            this.crows.push(crow);
        }
    }
    
    spawnCrow() {
        // Spawn a new crow from random side
        const direction = Math.random() > 0.5 ? 1 : -1;
        const startX = direction === 1 ? -100 : LevelData.worldBounds.width + 100;
        const y = Phaser.Math.Between(100, 300);
        
        const crow = new Crow(this, startX, y, direction);
        this.crows.push(crow);
    }
    
    createParallaxBackground() {
        const worldWidth = LevelData.worldBounds.width;
        const worldHeight = LevelData.worldBounds.height;
        const viewportWidth = this.cameras.main.width;
        const viewportHeight = this.cameras.main.height;
        
        // Layer 1 - Sky background (fixed to camera, fills viewport)
        const layer1 = this.add.image(viewportWidth / 2, viewportHeight / 2, 'bg-layer1');
        layer1.setDisplaySize(viewportWidth, viewportHeight);
        layer1.setScrollFactor(0); // Fixed to camera
        layer1.setDepth(-100);
        
        // Layer 2 - Middle layer (single image, moves slowly with slight parallax)
        const layer2Texture = this.textures.get('bg-layer2');
        const layer2Width = layer2Texture.source[0].width;
        const layer2Height = layer2Texture.source[0].height;
        
        // Scale to fit viewport height while maintaining aspect ratio
        const layer2Scale = viewportHeight / layer2Height;
        const scaledLayer2Width = layer2Width * layer2Scale;
        
        // Position on right side of viewport
        const layer2 = this.add.image(viewportWidth, viewportHeight / 2, 'bg-layer2');
        layer2.setOrigin(1, 0.5); // Right-center origin
        layer2.setDisplaySize(scaledLayer2Width, viewportHeight);
        layer2.setScrollFactor(0.1); // Very slow parallax - barely moves
        layer2.setDepth(-90);
        
        // Improve rendering quality
        layer2.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
        layer2.setAntiAlias(true);
        
        // Layer 3 - Ground/foreground layer (bottom, repeating horizontally)
        const layer3Texture = this.textures.get('bg-layer3');
        const layer3Width = layer3Texture.source[0].width;
        const layer3Height = layer3Texture.source[0].height;
        
        // Scale to 60% of viewport width while maintaining aspect ratio
        const targetLayer3Width = viewportWidth * 0.6;
        const layer3Scale = targetLayer3Width / layer3Width;
        const scaledLayer3Height = layer3Height * layer3Scale;
        
        // Create repeating layer 3 across the world at bottom
        const layer3Count = Math.ceil(worldWidth / targetLayer3Width) + 2;
        for (let i = 0; i < layer3Count; i++) {
            const layer3 = this.add.image(i * targetLayer3Width, worldHeight, 'bg-layer3');
            layer3.setOrigin(0, 1); // Bottom-left origin
            layer3.setDisplaySize(targetLayer3Width, scaledLayer3Height);
            layer3.setScrollFactor(0.6); // Faster parallax
            layer3.setDepth(-80);
            
            // Improve rendering quality
            layer3.texture.setFilter(Phaser.Textures.FilterMode.LINEAR);
            layer3.setAntiAlias(true);
        }
    }
}
