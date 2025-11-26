import Phaser from 'phaser';

export class Crow extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, direction) {
        // Create crow textures if they don't exist
        if (!scene.textures.exists('crow-1')) {
            Crow.createCrowTextures(scene);
        }
        
        super(scene, x, y, 'crow-1');
        
        this.direction = direction; // 1 for right, -1 for left
        this.speed = Phaser.Math.Between(100, 200);
        this.wingFrame = 0;
        this.wingAnimTime = 0;
        
        scene.add.existing(this);
        this.setDepth(-50); // Behind everything except background
        
        // Flip if going left
        if (this.direction === -1) {
            this.setFlipX(true);
        }
    }
    
    static createCrowTextures(scene) {
        // Create 2 frames for wing flapping
        Crow.createCrowFrame(scene, 'crow-1', 0);    // Wings up
        Crow.createCrowFrame(scene, 'crow-2', 1);    // Wings down
    }
    
    static createCrowFrame(scene, textureName, wingPosition) {
        const size = 60;
        const centerX = size / 2;
        const centerY = size / 2;
        const graphics = scene.make.graphics({ x: 0, y: 0 });
        
        // Wing angle based on position
        const wingAngle = wingPosition * 40; // 0 or 40 degrees
        
        // Crow body - black silhouette
        graphics.fillStyle(0x000000, 0.8);
        
        // Body
        graphics.fillEllipse(centerX, centerY, 16, 20);
        
        // Head
        graphics.fillCircle(centerX, centerY - 8, 8);
        
        // Beak
        graphics.fillTriangle(
            centerX + 6, centerY - 8,
            centerX + 12, centerY - 9,
            centerX + 6, centerY - 6
        );
        
        // Wings - animated
        if (wingPosition === 0) {
            // Wings up
            graphics.beginPath();
            graphics.moveTo(centerX - 8, centerY);
            graphics.lineTo(centerX - 25, centerY - 15);
            graphics.lineTo(centerX - 20, centerY - 5);
            graphics.closePath();
            graphics.fillPath();
            
            graphics.beginPath();
            graphics.moveTo(centerX + 8, centerY);
            graphics.lineTo(centerX + 25, centerY - 15);
            graphics.lineTo(centerX + 20, centerY - 5);
            graphics.closePath();
            graphics.fillPath();
        } else {
            // Wings down
            graphics.beginPath();
            graphics.moveTo(centerX - 8, centerY);
            graphics.lineTo(centerX - 25, centerY + 10);
            graphics.lineTo(centerX - 20, centerY + 5);
            graphics.closePath();
            graphics.fillPath();
            
            graphics.beginPath();
            graphics.moveTo(centerX + 8, centerY);
            graphics.lineTo(centerX + 25, centerY + 10);
            graphics.lineTo(centerX + 20, centerY + 5);
            graphics.closePath();
            graphics.fillPath();
        }
        
        // Tail
        graphics.fillTriangle(
            centerX - 6, centerY + 8,
            centerX - 10, centerY + 15,
            centerX + 6, centerY + 8
        );
        
        graphics.generateTexture(textureName, size, size);
        graphics.destroy();
    }
    
    update(delta) {
        // Move horizontally
        this.x += this.speed * this.direction * (delta / 1000);
        
        // Wing flapping animation
        this.wingAnimTime += delta || 16;
        if (this.wingAnimTime >= 200) { // Change frame every 200ms
            this.wingAnimTime = 0;
            this.wingFrame = (this.wingFrame + 1) % 2;
            this.setTexture(`crow-${this.wingFrame + 1}`);
        }
        
        // Remove if off screen
        if (this.direction === 1 && this.x > 9000) {
            this.destroy();
        } else if (this.direction === -1 && this.x < -500) {
            this.destroy();
        }
    }
}
