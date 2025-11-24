import Phaser from 'phaser';
import { LevelData } from '../data/levelData.js';
import { PlatformManager } from '../entities/PlatformManager.js';
import { Player } from '../entities/Player.js';
import { Goal } from '../entities/Goal.js';
import { Enemy } from '../entities/Enemy.js';
import { Checkpoint } from '../entities/Checkpoint.js';

export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    create() {
        console.log('GameScene create started');
        
        // Set world bounds
        this.physics.world.setBounds(0, 0, LevelData.worldBounds.width, LevelData.worldBounds.height);
        
        // Create spooky Halloween night background
        try {
            this.createHalloweenBackground();
            console.log('Background created');
        } catch (error) {
            console.error('Error creating background:', error);
        }
        
        // Initialize lives system
        this.lives = 3;
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
            E: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
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
            // Disable player controls
            this.player.body.setAccelerationX(0);
            this.player.body.setVelocityX(0);
            
            // Trigger death after a short delay
            this.time.delayedCall(500, () => {
                this.isFalling = false;
                this.loseLife();
            });
        }
        
        // Update player (only if not falling)
        if (!this.isRespawning && !this.isFalling) {
            this.player.update(this.cursors, this.keys);
        }
        
        // Update enemies
        if (this.enemies && this.enemies.children) {
            this.enemies.children.entries.forEach(enemy => {
                if (enemy && enemy.update) {
                    enemy.update();
                }
            });
        }
    }
    
    hitEnemy(player, enemy) {
        if (!this.isRespawning) {
            this.loseLife();
        }
    }
    
    loseLife() {
        if (this.isRespawning) return;
        
        this.isRespawning = true;
        this.lives--;
        this.updateLivesUI();
        
        // Flash effect
        this.cameras.main.flash(300, 255, 0, 0);
        
        if (this.lives > 0) {
            // Show resurrection screen
            this.showResurrectionScreen();
        } else {
            // Game over
            this.time.delayedCall(1000, () => {
                this.gameOver();
            });
        }
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
            
            this.tweens.add({
                targets: message,
                y: 80,
                alpha: 0,
                duration: 2000,
                ease: 'Sine.easeOut',
                onComplete: () => message.destroy()
            });
        }
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
        
        for (let i = 0; i < 3; i++) {
            const icon = this.add.image(70 + (i * 45), 50, 'heart').setScale(0.9);
            this.livesContainer.add(icon);
            this.livesIcons.push(icon);
        }
    }
    
    updateLivesUI() {
        for (let i = 0; i < this.livesIcons.length; i++) {
            this.livesIcons[i].setAlpha(i < this.lives ? 1 : 0.3);
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
        
        // Create gradient background - dark night sky (extended to cover viewport)
        const graphics = this.add.graphics();
        
        // Dark purple to black gradient for night sky
        for (let i = 0; i < height; i++) {
            const alpha = i / height;
            const color = Phaser.Display.Color.Interpolate.ColorWithColor(
                { r: 20, g: 10, b: 40 },  // Dark purple at top
                { r: 5, g: 5, b: 10 },     // Near black at bottom
                height,
                i
            );
            graphics.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b), 1);
            graphics.fillRect(0, i, width, 1);
        }
        
        // Fill any remaining space below with solid dark color
        graphics.fillStyle(0x050505, 1);
        graphics.fillRect(0, height, width, 500);
        
        // Add some stars
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(0, height * 0.6);
            const size = Phaser.Math.Between(1, 3);
            const brightness = Phaser.Math.FloatBetween(0.3, 1);
            
            graphics.fillStyle(0xffffff, brightness);
            graphics.fillCircle(x, y, size);
            
            // Add twinkling effect to some stars
            if (Math.random() > 0.7) {
                const star = this.add.circle(x, y, size, 0xffffff, brightness);
                this.tweens.add({
                    targets: star,
                    alpha: 0.2,
                    duration: Phaser.Math.Between(1000, 3000),
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }
        
        // Create large spooky moon
        const moonX = width * 0.75;
        const moonY = height * 0.2;
        const moonRadius = 120;
        
        // Moon glow
        const moonGlow = this.add.circle(moonX, moonY, moonRadius + 30, 0xffff99, 0.1);
        this.tweens.add({
            targets: moonGlow,
            alpha: 0.05,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Main moon
        const moon = this.add.circle(moonX, moonY, moonRadius, 0xffffcc);
        
        // Add moon craters for detail
        const craterGraphics = this.add.graphics();
        craterGraphics.fillStyle(0xccccaa, 0.3);
        craterGraphics.fillCircle(moonX - 30, moonY - 20, 25);
        craterGraphics.fillCircle(moonX + 20, moonY + 15, 18);
        craterGraphics.fillCircle(moonX - 10, moonY + 30, 15);
        craterGraphics.fillCircle(moonX + 35, moonY - 25, 12);
        
        // Add some wispy clouds passing in front of moon
        for (let i = 0; i < 3; i++) {
            const cloud = this.add.ellipse(
                Phaser.Math.Between(moonX - 150, moonX + 150),
                Phaser.Math.Between(moonY - 80, moonY + 80),
                Phaser.Math.Between(100, 200),
                Phaser.Math.Between(40, 80),
                0x1a1a2e,
                0.4
            );
            
            // Slow drifting clouds
            this.tweens.add({
                targets: cloud,
                x: cloud.x + Phaser.Math.Between(50, 150),
                duration: Phaser.Math.Between(20000, 40000),
                repeat: -1,
                ease: 'Linear'
            });
        }
        
        // Add distant haunted castle silhouette
        this.createCastleSilhouette(width * 0.2, height);
        
        // Add spooky pumpkins in the background
        this.createBackgroundPumpkins(width, height);
        
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
        castleGraphics.fillStyle(0x000000, 0.5);
        
        const baseY = height - 200;
        const castleWidth = 400;
        const castleHeight = 350;
        
        // Main castle body
        castleGraphics.fillRect(x, baseY - castleHeight, castleWidth, castleHeight);
        
        // Castle towers
        const towerWidth = 80;
        const towerHeight = 450;
        
        // Left tower
        castleGraphics.fillRect(x - 20, baseY - towerHeight, towerWidth, towerHeight);
        // Left tower top
        castleGraphics.fillTriangle(
            x - 20, baseY - towerHeight,
            x + towerWidth / 2 - 20, baseY - towerHeight - 60,
            x + towerWidth - 20, baseY - towerHeight
        );
        
        // Right tower
        castleGraphics.fillRect(x + castleWidth - 60, baseY - towerHeight, towerWidth, towerHeight);
        // Right tower top
        castleGraphics.fillTriangle(
            x + castleWidth - 60, baseY - towerHeight,
            x + castleWidth - 60 + towerWidth / 2, baseY - towerHeight - 60,
            x + castleWidth - 60 + towerWidth, baseY - towerHeight
        );
        
        // Center tower (tallest)
        const centerTowerHeight = 500;
        castleGraphics.fillRect(x + castleWidth / 2 - 50, baseY - centerTowerHeight, 100, centerTowerHeight);
        // Center tower top
        castleGraphics.fillTriangle(
            x + castleWidth / 2 - 50, baseY - centerTowerHeight,
            x + castleWidth / 2, baseY - centerTowerHeight - 80,
            x + castleWidth / 2 + 50, baseY - centerTowerHeight
        );
        
        // Add battlements
        for (let i = 0; i < 8; i++) {
            const battlementX = x + (i * 50);
            if (i % 2 === 0) {
                castleGraphics.fillRect(battlementX, baseY - castleHeight, 30, -20);
            }
        }
        
        // Add glowing windows
        const windowGraphics = this.add.graphics();
        windowGraphics.fillStyle(0xff8800, 0.6);
        
        // Main castle windows
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const winX = x + 100 + (col * 70);
                const winY = baseY - 280 + (row * 80);
                windowGraphics.fillRect(winX, winY, 25, 40);
                
                // Add flickering effect to some windows
                if (Math.random() > 0.5) {
                    const window = this.add.rectangle(winX + 12, winY + 20, 25, 40, 0xff8800, 0.6);
                    this.tweens.add({
                        targets: window,
                        alpha: 0.2,
                        duration: Phaser.Math.Between(800, 2000),
                        yoyo: true,
                        repeat: -1,
                        ease: 'Sine.easeInOut'
                    });
                }
            }
        }
    }
    
    createBackgroundPumpkins(width, height) {
        const pumpkinGraphics = this.add.graphics();
        
        // Create several pumpkins scattered in the background
        const pumpkinPositions = [
            { x: width * 0.15, y: height - 120, size: 60 },
            { x: width * 0.35, y: height - 100, size: 50 },
            { x: width * 0.55, y: height - 110, size: 55 },
            { x: width * 0.85, y: height - 105, size: 52 }
        ];
        
        pumpkinPositions.forEach(pos => {
            // Pumpkin body
            pumpkinGraphics.fillStyle(0xff6600, 0.4);
            pumpkinGraphics.fillEllipse(pos.x, pos.y, pos.size, pos.size * 0.9);
            
            // Pumpkin ridges
            pumpkinGraphics.lineStyle(2, 0xcc4400, 0.4);
            for (let i = -1; i <= 1; i++) {
                pumpkinGraphics.beginPath();
                pumpkinGraphics.moveTo(pos.x + (i * pos.size / 4), pos.y - pos.size / 2);
                pumpkinGraphics.lineTo(pos.x + (i * pos.size / 4), pos.y + pos.size / 2);
                pumpkinGraphics.strokePath();
            }
            
            // Glowing jack-o-lantern face
            const faceGraphics = this.add.graphics();
            faceGraphics.fillStyle(0xffaa00, 0.7);
            
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
            faceGraphics.beginPath();
            faceGraphics.moveTo(pos.x - pos.size / 3, pos.y + pos.size / 6);
            for (let i = 0; i < 6; i++) {
                const mx = pos.x - pos.size / 3 + (i * pos.size / 9);
                const my = pos.y + pos.size / 6 + (i % 2 === 0 ? 8 : 0);
                faceGraphics.lineTo(mx, my);
            }
            faceGraphics.strokePath();
            
            // Add glow effect
            const glow = this.add.circle(pos.x, pos.y, pos.size * 0.6, 0xff8800, 0.15);
            this.tweens.add({
                targets: glow,
                alpha: 0.05,
                duration: Phaser.Math.Between(1500, 2500),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Pumpkin stem
            pumpkinGraphics.fillStyle(0x2d1b00, 0.5);
            pumpkinGraphics.fillRect(pos.x - 8, pos.y - pos.size / 2 - 15, 16, 20);
        });
    }
    
    createSpookyTrees(width, height) {
        // Create a few prominent spooky trees with faces
        const treePositions = [
            { x: width * 0.12, scale: 1.2, depth: 0.85 },
            { x: width * 0.38, scale: 0.9, depth: 0.75 },
            { x: width * 0.65, scale: 1.1, depth: 0.8 },
            { x: width * 0.88, scale: 1.0, depth: 0.78 }
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
}
