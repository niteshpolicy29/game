import Phaser from 'phaser';
import { PhysicsConfig } from '../config.js';

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
        
        // Marshmallow transformation state
        this.isMarshmallow = false;
        this.marshmallowMaxSpeed = 240; // Slower in marshmallow form
        this.marshmallowAcceleration = 720; // Less responsive
        this.createMarshmallowTexture();
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
    
    update(cursors, keys) {
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
        if (!this.isMarshmallow) {
            if (Phaser.Input.Keyboard.JustDown(cursors.up) || 
                Phaser.Input.Keyboard.JustDown(cursors.space) ||
                Phaser.Input.Keyboard.JustDown(keys.W)) {
                this.jump();
            }
        }
        
        // Update grounded state
        this.checkGrounded();
        
        // Roll the ball based on horizontal velocity (less rotation in marshmallow form)
        this.updateRoll();
        
        // Apply buoyancy if in marshmallow form
        if (this.isMarshmallow) {
            this.applyBuoyancy();
        }
    }
    
    moveLeft() {
        this.body.setAccelerationX(-this.acceleration);
    }
    
    moveRight() {
        this.body.setAccelerationX(this.acceleration);
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
        // Allow jump immediately when touching ground
        if (this.body.touching.down || this.body.blocked.down) {
            this.body.setVelocityY(this.jumpVelocity);
            this.isGrounded = false;
            this.wasAirborne = true;
            this.jumpBufferTime = 0; // Clear buffer
        } else {
            // Buffer the jump input if in air
            this.jumpBufferTime = Date.now();
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
                // Execute buffered jump
                this.body.setVelocityY(this.jumpVelocity);
                this.jumpBufferTime = 0;
                this.wasAirborne = true;
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
        // Disable landing animation to prevent physics issues
        // Just ensure scale is reset
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
    
    toggleMarshmallow() {
        this.isMarshmallow = !this.isMarshmallow;
        
        if (this.isMarshmallow) {
            // Transform to marshmallow
            this.setTexture('player-marshmallow');
            this.body.setMaxVelocity(this.marshmallowMaxSpeed, 2400);
            
            // Transformation effect
            this.scene.tweens.add({
                targets: this,
                scaleX: 1.2,
                scaleY: 0.8,
                duration: 150,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
            
            // Puff particles
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2 / 8);
                const particle = this.scene.add.circle(
                    this.x + Math.cos(angle) * 30,
                    this.y + Math.sin(angle) * 30,
                    Phaser.Math.Between(4, 8),
                    0xffffff,
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
        } else {
            // Transform back to candy
            this.setTexture('player-ball');
            this.body.setMaxVelocity(this.maxSpeed, 2400);
            
            // Transformation effect
            this.scene.tweens.add({
                targets: this,
                scaleX: 0.8,
                scaleY: 1.2,
                duration: 150,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
            
            // Sparkle particles
            for (let i = 0; i < 8; i++) {
                const angle = (i * Math.PI * 2 / 8);
                const particle = this.scene.add.circle(
                    this.x + Math.cos(angle) * 30,
                    this.y + Math.sin(angle) * 30,
                    Phaser.Math.Between(3, 6),
                    0xffaa00,
                    0.9
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
    
    updateRoll() {
        // Calculate rotation based on horizontal velocity
        // The ball should roll in the direction of movement
        const velocityX = this.body.velocity.x;
        
        // Only rotate if moving significantly
        // Marshmallow rotates slower (softer, squishier)
        const rotationMultiplier = this.isMarshmallow ? 0.5 : 1.0;
        if (Math.abs(velocityX) > 10) {
            // Rotation speed proportional to velocity
            // Positive because moving right should rotate clockwise
            const rotationSpeed = (velocityX / (this.radius * 2)) * rotationMultiplier;
            this.rotation += rotationSpeed * 0.016; // Assuming 60fps
        }
        
        // Update shine position to always point toward moon
        this.updateShinePosition();
    }
    
    updateShinePosition() {
        if (!this.shine) return;
        
        // Hide shine in marshmallow form (marshmallow is matte, not shiny)
        if (this.isMarshmallow) {
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
