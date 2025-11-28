import Phaser from 'phaser';
import { PhysicsConfig } from '../config.js';
import { AudioConfig } from '../audioConfig.js';

export class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, moonX, moonY) {
        super(scene, x, y, null);
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Visual setup
        this.radius = 48;
        this.glowWidth = 10;
        this.baseScale = 0.25;
        this.moonX = moonX || 2880; // Default moon position
        this.moonY = moonY || 216;
        this.createVisuals();
        this.createShine();
        
        // Physics properties - set after visuals are created
        // Use square body for better collision stability
        const bodySize = this.radius * 2 - 8;
        const offset = (this.width - bodySize) / 2;
        this.body.setSize(bodySize, bodySize);
        this.body.setOffset(offset, offset);
        this.body.setCollideWorldBounds(false); // Allow falling through gaps
        this.body.setMaxVelocity(PhysicsConfig.maxSpeed, 2400);
        this.body.setBounce(0); // No bounce to prevent sinking
        this.body.setDrag(50, 0); // Light drag for control
        
        // Movement properties
        this.maxSpeed = PhysicsConfig.maxSpeed;
        this.acceleration = PhysicsConfig.acceleration;
        this.jumpVelocity = PhysicsConfig.jumpVelocity;
        this.friction = 720; // Lower friction for longer slide distance
        
        // Jump state
        this.isGrounded = false;
        this.wasAirborne = false; // Track if ball was in air
        this.landingTween = null; // Track active landing animation
        this.jumpBufferTime = 0; // Time when jump was pressed in air
        this.jumpBufferWindow = 150; // 150ms window for buffered jump
        
        // Form transformation state
        this.currentForm = 'candy'; // 'candy', 'marshmallow', 'jelly'
        this.isMarshmallow = false; // Keep for backward compatibility
        this.isJelly = false;
        
        // Form-specific properties
        this.marshmallowMaxSpeed = 240;
        this.marshmallowAcceleration = 720;
        this.jellyMaxSpeed = 280; // Much slower horizontal movement for floaty feel
        this.jellyAcceleration = 840; // Slower acceleration
        this.jellyJumpVelocity = -1500; // Much higher jump for bouncy feel
        this.jellyIdleHopVelocity = -500; // Small automatic hops
        this.jellyBounce = 0.5; // Very bouncy!
        this.jellyHopTimer = 0; // Timer for automatic hops
        this.jellyHopInterval = 800; // Hop every 800ms when idle
        this.jellyFastFalling = false; // Track if fast-falling to ground
        
        // Water physics state
        this.waterBobPhase = 0; // For bobbing animation
        this.waterBobSpeed = 0.02; // Slower, more gentle bobbing
        this.waterVerticalVelocity = 0; // Track water-specific velocity for smooth transitions
        this.waterDipAmount = 0; // Current dip depth from landing
        this.waterDipRecovery = 0; // Recovery animation progress
        this.inWater = false;
        this.justEnteredWater = false;
        this.waterEntryVelocity = 0; // Track entry speed for splash intensity
        
        this.createMarshmallowTexture();
        this.createJellyTexture();
        
        // Death state
        this.isDead = false;
    }
    
    createVisuals() {
        // Add padding for glow effect
        const padding = this.glowWidth * 2;
        const size = this.radius * 2 + padding;
        const center = this.radius + this.glowWidth;
        
        const graphics = this.scene.make.graphics({ x: 0, y: 0 });
        
        // Clean candy ball - smooth orange base
        graphics.fillStyle(0xff7700, 1);
        graphics.fillCircle(center, center, this.radius);
        
        // Spiral stripes that follow the sphere (like wrapped candy)
        graphics.fillStyle(0xffaa00, 1);
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2 / 5);
            graphics.beginPath();
            graphics.arc(center, center, this.radius, angle - 0.2, angle + 0.2, false);
            graphics.arc(center, center, this.radius * 0.6, angle + 0.2, angle - 0.2, true);
            graphics.closePath();
            graphics.fillPath();
        }
        
        // Darker bottom for sphere depth
        graphics.fillStyle(0xcc5500, 0.3);
        graphics.fillCircle(center, center + this.radius / 3, this.radius * 0.7);
        
        // Lighter top for sphere highlight
        graphics.fillStyle(0xffbb44, 0.3);
        graphics.fillCircle(center, center - this.radius / 3, this.radius * 0.7);
        
        // No shine in the texture - it will be a separate sprite
        
        // Subtle glow outline
        graphics.lineStyle(this.glowWidth, 0xffaa44, 0.5);
        graphics.strokeCircle(center, center, this.radius);
        
        // Generate texture with padding for glow
        graphics.generateTexture('player-ball', size, size);
        graphics.destroy();
        
        this.setTexture('player-ball');
        
        // No scaling needed - 1:1 match between texture and physics
        this.setScale(1);
    }
    
    createMarshmallowTexture() {
        if (this.scene.textures.exists('player-marshmallow')) return;
        
        const padding = this.glowWidth * 2;
        const size = this.radius * 2 + padding;
        const center = this.radius + this.glowWidth;
        
        const graphics = this.scene.make.graphics({ x: 0, y: 0 });
        
        // Marshmallow base - soft white with slight cream tint
        graphics.fillStyle(0xfff8f0, 1);
        graphics.fillCircle(center, center, this.radius);
        
        // Create pillowy, cylindrical marshmallow shape
        // Top rounded edge
        graphics.fillStyle(0xffffff, 1);
        graphics.fillEllipse(center, center - this.radius * 0.3, this.radius * 0.85, this.radius * 0.4);
        
        // Middle section (main body)
        graphics.fillStyle(0xfff5ee, 1);
        graphics.fillRect(center - this.radius * 0.85, center - this.radius * 0.3, this.radius * 1.7, this.radius * 0.6);
        
        // Bottom rounded edge
        graphics.fillStyle(0xf5e6d3, 1);
        graphics.fillEllipse(center, center + this.radius * 0.3, this.radius * 0.85, this.radius * 0.4);
        
        // Add subtle vertical ridges for texture
        graphics.lineStyle(2, 0xf0e6dc, 0.3);
        for (let i = -2; i <= 2; i++) {
            const x = center + (i * this.radius * 0.35);
            graphics.beginPath();
            graphics.moveTo(x, center - this.radius * 0.5);
            graphics.lineTo(x, center + this.radius * 0.5);
            graphics.strokePath();
        }
        
        // Soft shadow on bottom
        graphics.fillStyle(0xe8d5c0, 0.5);
        graphics.fillEllipse(center, center + this.radius * 0.4, this.radius * 0.7, this.radius * 0.25);
        
        // Bright highlight on top for that glossy marshmallow look
        graphics.fillStyle(0xffffff, 0.7);
        graphics.fillEllipse(center - this.radius * 0.2, center - this.radius * 0.35, this.radius * 0.4, this.radius * 0.2);
        
        // Subtle outer glow
        graphics.lineStyle(this.glowWidth, 0xfff8f0, 0.3);
        graphics.strokeCircle(center, center, this.radius);
        
        graphics.generateTexture('player-marshmallow', size, size);
        graphics.destroy();
    }
    
    createJellyTexture() {
        if (this.scene.textures.exists('player-jelly')) return;
        
        const padding = this.glowWidth * 2;
        const size = this.radius * 2 + padding;
        const center = this.radius + this.glowWidth;
        
        const graphics = this.scene.make.graphics({ x: 0, y: 0 });
        
        // Jelly base - translucent green/lime color
        graphics.fillStyle(0x44ff44, 0.85);
        graphics.fillCircle(center, center, this.radius);
        
        // Inner lighter core for translucent effect
        graphics.fillStyle(0x88ff88, 0.6);
        graphics.fillCircle(center, center, this.radius * 0.7);
        
        // Glossy highlights for jelly shine
        graphics.fillStyle(0xccffcc, 0.8);
        graphics.fillCircle(center - this.radius * 0.3, center - this.radius * 0.3, this.radius * 0.3);
        
        graphics.fillStyle(0xffffff, 0.6);
        graphics.fillCircle(center - this.radius * 0.35, center - this.radius * 0.35, this.radius * 0.15);
        
        // Secondary shine
        graphics.fillStyle(0xccffcc, 0.5);
        graphics.fillCircle(center + this.radius * 0.4, center + this.radius * 0.2, this.radius * 0.2);
        
        // Darker bottom for depth
        graphics.fillStyle(0x22aa22, 0.4);
        graphics.fillEllipse(center, center + this.radius * 0.4, this.radius * 0.8, this.radius * 0.3);
        
        // Glowing outline
        graphics.lineStyle(this.glowWidth, 0x44ff44, 0.5);
        graphics.strokeCircle(center, center, this.radius);
        
        graphics.generateTexture('player-jelly', size, size);
        graphics.destroy();
    }
    
    update(cursors, keys) {
        // Don't process input if dead
        if (this.isDead) {
            return;
        }
        
        // Safety check: ensure scale is reset (but allow brief animation periods)
        // Check every 100ms to avoid constant checks
        if (!this._lastScaleCheck || Date.now() - this._lastScaleCheck > 100) {
            this._lastScaleCheck = Date.now();
            const activeTweens = this.scene.tweens.getTweensOf(this);
            if (activeTweens.length === 0 && (this.scaleX !== 1 || this.scaleY !== 1)) {
                this.setScale(1, 1);
            }
        }
        
        // Toggle jelly form with Q key
        if (Phaser.Input.Keyboard.JustDown(keys.Q)) {
            this.toggleJelly();
        }
        
        // Toggle marshmallow form with E key
        if (Phaser.Input.Keyboard.JustDown(keys.E)) {
            this.toggleMarshmallow();
        }
        
        // Horizontal movement with acceleration
        if (cursors.left.isDown || keys.A.isDown) {
            this.moveLeft();
        } else if (cursors.right.isDown || keys.D.isDown) {
            this.moveRight();
        } else {
            // Apply friction when no keys pressed for smooth deceleration
            this.applyFriction();
        }
        
        // Jump (only if not in marshmallow form)
        if (this.currentForm !== 'marshmallow') {
            if (Phaser.Input.Keyboard.JustDown(cursors.up) || 
                Phaser.Input.Keyboard.JustDown(cursors.space) ||
                Phaser.Input.Keyboard.JustDown(keys.W)) {
                this.jump();
            }
        }
        
        // Update grounded state
        this.checkGrounded();
        
        // Roll the ball based on horizontal velocity
        this.updateRoll();
        
        // Apply form-specific physics
        if (this.currentForm === 'marshmallow') {
            this.applyBuoyancy();
        } else if (this.currentForm === 'jelly') {
            // Clear fast-fall state when grounded
            if (this.isGrounded) {
                this.jellyFastFalling = false;
                // Automatic idle hopping when grounded
                this.updateJellyIdleHop();
            }
            
            // Only apply special physics when in air
            if (!this.isGrounded) {
                if (this.jellyFastFalling) {
                    this.applyJellyFastFall();
                } else {
                    this.applyJellyFloat();
                }
            }
        }
    }
    
    moveLeft() {
        const accel = this.getCurrentAcceleration();
        this.body.setAccelerationX(-accel);
    }
    
    moveRight() {
        const accel = this.getCurrentAcceleration();
        this.body.setAccelerationX(accel);
    }
    
    getCurrentAcceleration() {
        if (this.currentForm === 'marshmallow') return this.marshmallowAcceleration;
        if (this.currentForm === 'jelly') return this.jellyAcceleration;
        return this.acceleration;
    }
    
    getCurrentMaxSpeed() {
        if (this.currentForm === 'marshmallow') return this.marshmallowMaxSpeed;
        if (this.currentForm === 'jelly') return this.jellyMaxSpeed;
        return this.maxSpeed;
    }
    
    applyFriction() {
        const currentVelocity = this.body.velocity.x;
        
        // Apply friction in opposite direction of movement
        if (Math.abs(currentVelocity) > 3) {
            const frictionForce = currentVelocity > 0 ? -this.friction : this.friction;
            this.body.setAccelerationX(frictionForce);
        } else {
            // Stop completely when velocity is very low
            this.body.setVelocityX(0);
            this.body.setAccelerationX(0);
        }
    }
    
    jump() {
        // For jelly form, handle fast-fall and jump
        if (this.currentForm === 'jelly') {
            const isActuallyGrounded = this.body.touching.down || this.body.blocked.down;
            const isVeryCloseToGround = this.body.velocity.y > -100 && this.body.velocity.y < 50;
            
            if (isActuallyGrounded || (isVeryCloseToGround && this.isGrounded)) {
                // Manual jump - much higher
                this.body.setVelocityY(this.jellyJumpVelocity);
                this.isGrounded = false;
                this.wasAirborne = true;
                this.jumpBufferTime = 0;
                this.jellyHopTimer = Date.now(); // Reset hop timer
                this.jellyFastFalling = false; // Clear fast-fall state
                
                // Play jump sound
                this.scene.sound.play('jump-sound', { volume: AudioConfig.getSFXVolume() });
                
                // Kill existing tweens and reset scale
                this.scene.tweens.killTweensOf(this);
                this.setScale(1, 1);
                
                // No squish animation to prevent scale issues
            } else if (!isActuallyGrounded) {
                // In the air - trigger fast-fall and buffer jump
                this.jellyFastFalling = true;
                this.jumpBufferTime = Date.now();
                
                // Cancel upward velocity and start falling fast
                if (this.body.velocity.y < 0) {
                    this.body.setVelocityY(0);
                }
            }
        } else {
            // Normal jump for other forms
            if (this.body.touching.down || this.body.blocked.down) {
                this.body.setVelocityY(this.jumpVelocity);
                this.isGrounded = false;
                this.wasAirborne = true;
                this.jumpBufferTime = 0;
                
                // Play jump sound
                this.scene.sound.play('jump-sound', { volume: AudioConfig.getSFXVolume() });
            } else {
                // Buffer the jump input if in air
                this.jumpBufferTime = Date.now();
            }
        }
    }
    
    checkGrounded() {
        const wasGrounded = this.isGrounded;
        const previousVelocityY = this.body.velocity.y;
        
        // Check grounded state - allow jump as soon as touching ground
        this.isGrounded = this.body.touching.down || this.body.blocked.down;
        
        // Check for buffered jump - if jump was pressed recently and now grounded
        if (this.isGrounded && this.jumpBufferTime > 0) {
            const timeSinceJumpPress = Date.now() - this.jumpBufferTime;
            if (timeSinceJumpPress < this.jumpBufferWindow) {
                // Execute buffered jump immediately
                const jumpVel = this.currentForm === 'jelly' ? this.jellyJumpVelocity : this.jumpVelocity;
                this.body.setVelocityY(jumpVel);
                this.jumpBufferTime = 0;
                this.wasAirborne = true;
                
                // Play jump sound
                this.scene.sound.play('jump-sound', { volume: AudioConfig.getSFXVolume() });
                
                // Reset hop timer for jelly
                if (this.currentForm === 'jelly') {
                    this.jellyHopTimer = Date.now();
                }
                return; // Skip landing animation
            } else {
                this.jumpBufferTime = 0; // Clear expired buffer
            }
        }
        
        // Detect landing (transition from airborne to grounded)
        if (this.isGrounded && !wasGrounded && this.wasAirborne) {
            this.onLanding(previousVelocityY);
        }
        
        if (!this.isGrounded) {
            this.wasAirborne = true;
        } else {
            this.wasAirborne = false;
        }
    }
    
    onLanding(impactVelocity) {
        // Kill any existing scale tweens to prevent conflicts
        this.scene.tweens.killTweensOf(this);
        
        // Reset scale immediately - no animations to prevent stretching bugs
        this.setScale(1, 1);
    }
    
    createShine() {
        // Create shine as a separate sprite that won't rotate
        const shineGraphics = this.scene.make.graphics({ x: 0, y: 0 });
        
        // Outer shine glow
        shineGraphics.fillStyle(0xffffff, 0.6);
        shineGraphics.fillCircle(50, 50, 15);
        
        // Bright center
        shineGraphics.fillStyle(0xffffff, 0.9);
        shineGraphics.fillCircle(50, 50, 7);
        
        shineGraphics.generateTexture('ball-shine', 100, 100);
        shineGraphics.destroy();
        
        // Create shine sprite
        this.shine = this.scene.add.sprite(this.x, this.y, 'ball-shine');
        this.shine.setDepth(this.depth + 1);
        this.shine.setScale(0.8);
    }
    
    transformTo(form) {
        const oldForm = this.currentForm;
        this.currentForm = form;
        
        // Kill all existing tweens and reset scale immediately
        this.scene.tweens.killTweensOf(this);
        this.setScale(1, 1);
        
        // Update backward compatibility flags
        this.isMarshmallow = (form === 'marshmallow');
        this.isJelly = (form === 'jelly');
        
        // Set texture and physics
        if (form === 'candy') {
            this.setTexture('player-ball');
            this.body.setMaxVelocity(this.maxSpeed, 2400);
            this.body.setBounce(0);
        } else if (form === 'marshmallow') {
            this.setTexture('player-marshmallow');
            this.body.setMaxVelocity(this.marshmallowMaxSpeed, 2400);
            this.body.setBounce(0);
        } else if (form === 'jelly') {
            this.setTexture('player-jelly');
            this.body.setMaxVelocity(this.jellyMaxSpeed, 2400);
            this.body.setBounce(this.jellyBounce);
            // Reset hop timer when transforming to jelly
            this.jellyHopTimer = Date.now();
        }
        
        // No transformation animation to prevent physics issues
        
        // Particles based on new form
        const particleColor = form === 'candy' ? 0xffaa00 : 
                             form === 'marshmallow' ? 0xffffff : 
                             0x44ff44;
        
        for (let i = 0; i < 10; i++) {
            const angle = (i * Math.PI * 2 / 10);
            const particle = this.scene.add.circle(
                this.x + Math.cos(angle) * 30,
                this.y + Math.sin(angle) * 30,
                Phaser.Math.Between(4, 8),
                particleColor,
                0.8
            );
            
            this.scene.tweens.add({
                targets: particle,
                x: particle.x + Math.cos(angle) * 40,
                y: particle.y + Math.sin(angle) * 40,
                alpha: 0,
                scale: 0,
                duration: 500,
                ease: 'Sine.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }
    
    toggleMarshmallow() {
        // E key: Toggle marshmallow form
        // If marshmallow, go back to candy
        // If candy or jelly, transform to marshmallow
        if (this.currentForm === 'marshmallow') {
            this.transformTo('candy');
        } else {
            this.transformTo('marshmallow');
        }
    }
    
    toggleJelly() {
        // Q key: Toggle jelly form
        // If jelly, go back to candy
        // If candy or marshmallow, transform to jelly
        if (this.currentForm === 'jelly') {
            this.transformTo('candy');
        } else {
            this.transformTo('jelly');
        }
    }
    
    applyBuoyancy() {
        // Marshmallow floats - reduce gravity effect when falling
        if (this.body.velocity.y > 0) {
            // Apply upward force to simulate buoyancy
            const buoyancyForce = -400;
            this.body.setAccelerationY(buoyancyForce);
        } else {
            this.body.setAccelerationY(0);
        }
    }
    
    applyJellyFloat() {
        // Jelly has reduced gravity for floaty feel
        // Only apply if falling (don't interfere with jumping up)
        if (this.body.velocity.y > 0) {
            const floatForce = -400; // Reduces effective gravity
            this.body.setAccelerationY(floatForce);
        } else {
            // Reset acceleration when moving up
            this.body.setAccelerationY(0);
        }
    }
    
    applyJellyFastFall() {
        // Fast-fall to ground when jump pressed in air
        const fastFallForce = 1200;
        this.body.setAccelerationY(fastFallForce);
        
        // Ensure falling velocity
        if (this.body.velocity.y < 200) {
            this.body.setVelocityY(200);
        }
    }
    
    updateJellyIdleHop() {
        // Automatic small hops when in jelly form and grounded
        const currentTime = Date.now();
        
        if (currentTime - this.jellyHopTimer > this.jellyHopInterval) {
            // Perform small idle hop
            this.body.setVelocityY(this.jellyIdleHopVelocity);
            this.jellyHopTimer = currentTime;
            
            // No squish animation to prevent scale issues
        }
    }
    
    updateRoll() {
        // Calculate rotation based on horizontal velocity
        const velocityX = this.body.velocity.x;
        
        // Rotation multiplier based on form
        let rotationMultiplier = 1.0;
        if (this.currentForm === 'marshmallow') rotationMultiplier = 0.5;
        if (this.currentForm === 'jelly') rotationMultiplier = 0.7;
        
        if (Math.abs(velocityX) > 10) {
            const rotationSpeed = (velocityX / (this.radius * 2)) * rotationMultiplier;
            this.rotation += rotationSpeed * 0.016;
        }
        
        // Update shine position
        this.updateShinePosition();
    }
    
    updateShinePosition() {
        if (!this.shine) return;
        
        // Show shine only for candy and jelly (both are shiny)
        if (this.currentForm === 'marshmallow') {
            this.shine.setAlpha(0);
            return;
        } else {
            this.shine.setAlpha(1);
        }
        
        // Calculate direction from ball to moon
        const dx = this.moonX - this.x;
        const dy = this.moonY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Normalize and position shine on the side facing the moon
        const normalizedX = dx / distance;
        const normalizedY = dy / distance;
        
        // Place shine on the surface of the ball facing the moon
        const shineDistance = this.radius * 0.4;
        this.shine.x = this.x + normalizedX * shineDistance;
        this.shine.y = this.y + normalizedY * shineDistance;
    }
}
