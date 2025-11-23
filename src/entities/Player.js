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
        this.body.setCollideWorldBounds(true);
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
    
    update(cursors, keys) {
        // Horizontal movement with acceleration
        if (cursors.left.isDown || keys.A.isDown) {
            this.moveLeft();
        } else if (cursors.right.isDown || keys.D.isDown) {
            this.moveRight();
        } else {
            // Apply friction when no keys pressed for smooth deceleration
            this.applyFriction();
        }
        
        // Jump
        if (Phaser.Input.Keyboard.JustDown(cursors.up) || 
            Phaser.Input.Keyboard.JustDown(cursors.space) ||
            Phaser.Input.Keyboard.JustDown(keys.W)) {
            this.jump();
        }
        
        // Update grounded state
        this.checkGrounded();
        
        // Roll the ball based on horizontal velocity
        this.updateRoll();
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
    
    updateRoll() {
        // Calculate rotation based on horizontal velocity
        // The ball should roll in the direction of movement
        const velocityX = this.body.velocity.x;
        
        // Only rotate if moving significantly
        if (Math.abs(velocityX) > 10) {
            // Rotation speed proportional to velocity
            // Positive because moving right should rotate clockwise
            const rotationSpeed = velocityX / (this.radius * 2);
            this.rotation += rotationSpeed * 0.016; // Assuming 60fps
        }
        
        // Update shine position to always point toward moon
        this.updateShinePosition();
    }
    
    updateShinePosition() {
        if (!this.shine) return;
        
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
