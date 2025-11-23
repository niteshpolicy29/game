import Phaser from 'phaser';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, patrolStart, patrolEnd) {
        // Create texture first if it doesn't exist
        if (!scene.textures.exists('enemy-bat')) {
            Enemy.createBatTexture(scene);
        }
        
        super(scene, x, y, 'enemy-bat');
        
        this.patrolStart = patrolStart;
        this.patrolEnd = patrolEnd;
        this.speed = 150;
        this.direction = 1;
        this.baseY = y;
        this.bobPhase = Math.random() * Math.PI * 2; // Random start phase
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body.setSize(50, 35);
        this.body.setOffset(5, 12);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
    }
    
    static createBatTexture(scene) {
        const size = 100;
        const centerX = size / 2;
        const centerY = size / 2;
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        
        // Large bat wings - dark purple with membrane look
        graphics.fillStyle(0x3d1a4d, 1);
        
        // Left wing - larger and more spread
        graphics.beginPath();
        graphics.moveTo(centerX - 12, centerY);
        graphics.lineTo(centerX - 45, centerY - 15);
        graphics.lineTo(centerX - 40, centerY + 10);
        graphics.lineTo(centerX - 12, centerY + 5);
        graphics.closePath();
        graphics.fillPath();
        
        // Left wing detail
        graphics.fillTriangle(
            centerX - 12, centerY,
            centerX - 30, centerY - 8,
            centerX - 25, centerY + 5
        );
        
        // Right wing - larger and more spread
        graphics.beginPath();
        graphics.moveTo(centerX + 12, centerY);
        graphics.lineTo(centerX + 45, centerY - 15);
        graphics.lineTo(centerX + 40, centerY + 10);
        graphics.lineTo(centerX + 12, centerY + 5);
        graphics.closePath();
        graphics.fillPath();
        
        // Right wing detail
        graphics.fillTriangle(
            centerX + 12, centerY,
            centerX + 30, centerY - 8,
            centerX + 25, centerY + 5
        );
        
        // Bat body - round and chubby
        graphics.fillStyle(0x1a0a28, 1);
        graphics.fillEllipse(centerX, centerY + 2, 24, 28);
        
        // Bat head - larger
        graphics.fillCircle(centerX, centerY - 10, 16);
        
        // Bat ears - bigger and pointier
        graphics.fillTriangle(
            centerX - 12, centerY - 18,
            centerX - 16, centerY - 30,
            centerX - 8, centerY - 20
        );
        graphics.fillTriangle(
            centerX + 12, centerY - 18,
            centerX + 16, centerY - 30,
            centerX + 8, centerY - 20
        );
        
        // Glowing red eyes - bigger
        graphics.fillStyle(0xff0000, 1);
        graphics.fillCircle(centerX - 6, centerY - 10, 4);
        graphics.fillCircle(centerX + 6, centerY - 10, 4);
        
        // Eye glow effect
        graphics.fillStyle(0xff4444, 0.5);
        graphics.fillCircle(centerX - 6, centerY - 10, 8);
        graphics.fillCircle(centerX + 6, centerY - 10, 8);
        
        // Fangs - more visible
        graphics.fillStyle(0xffffff, 1);
        graphics.fillTriangle(
            centerX - 4, centerY - 2,
            centerX - 2, centerY + 4,
            centerX - 1, centerY - 2
        );
        graphics.fillTriangle(
            centerX + 4, centerY - 2,
            centerX + 2, centerY + 4,
            centerX + 1, centerY - 2
        );
        
        graphics.generateTexture('enemy-bat', size, size);
        graphics.destroy();
        console.log('Bat texture created');
    }

    update(time, delta) {
        // Patrol movement
        this.body.setVelocityX(this.speed * this.direction);
        
        if (this.direction === 1 && this.x >= this.patrolEnd) {
            this.direction = -1;
            this.setFlipX(true);
        } else if (this.direction === -1 && this.x <= this.patrolStart) {
            this.direction = 1;
            this.setFlipX(false);
        }
        
        // Smooth floating/bobbing animation using velocity
        const bobSpeed = 0.003;
        this.bobPhase += bobSpeed * (delta || 16);
        const targetY = this.baseY + Math.sin(this.bobPhase) * 15;
        const bobVelocity = (targetY - this.y) * 3;
        this.body.setVelocityY(bobVelocity);
    }
}
