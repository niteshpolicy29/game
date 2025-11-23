import Phaser from 'phaser';

export class Checkpoint extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, null);
        
        this.createVisuals();
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body.setSize(60, 80);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        
        this.activated = false;
    }
    
    createVisuals() {
        if (!this.scene.textures.exists('checkpoint')) {
            const width = 80;
            const height = 100;
            const graphics = this.scene.make.graphics({ x: 0, y: 0 });
            
            // Glowing lantern post
            graphics.fillStyle(0x4a4a4a, 1);
            graphics.fillRect(width / 2 - 5, height - 40, 10, 40);
            
            // Lantern
            graphics.fillStyle(0x666666, 1);
            graphics.fillRect(width / 2 - 15, height - 80, 30, 40);
            
            // Glowing flame (inactive)
            graphics.fillStyle(0x888888, 0.5);
            graphics.fillCircle(width / 2, height - 60, 12);
            
            graphics.generateTexture('checkpoint', width, height);
            graphics.destroy();
        }
        
        if (!this.scene.textures.exists('checkpoint-active')) {
            const width = 80;
            const height = 100;
            const graphics = this.scene.make.graphics({ x: 0, y: 0 });
            
            // Glowing lantern post
            graphics.fillStyle(0x4a4a4a, 1);
            graphics.fillRect(width / 2 - 5, height - 40, 10, 40);
            
            // Lantern
            graphics.fillStyle(0x666666, 1);
            graphics.fillRect(width / 2 - 15, height - 80, 30, 40);
            
            // Bright glowing flame (active)
            graphics.fillStyle(0xff6600, 1);
            graphics.fillCircle(width / 2, height - 60, 12);
            
            // Glow effect
            graphics.fillStyle(0xff8800, 0.4);
            graphics.fillCircle(width / 2, height - 60, 20);
            
            graphics.generateTexture('checkpoint-active', width, height);
            graphics.destroy();
        }
        
        this.setTexture('checkpoint');
    }
    
    activate() {
        if (this.activated) return;
        
        this.activated = true;
        this.setTexture('checkpoint-active');
        
        // Activation effect
        const glow = this.scene.add.circle(this.x, this.y - 30, 40, 0xff6600, 0.6);
        this.scene.tweens.add({
            targets: glow,
            scale: 2,
            alpha: 0,
            duration: 500,
            onComplete: () => glow.destroy()
        });
        
        // Particles
        for (let i = 0; i < 10; i++) {
            const particle = this.scene.add.circle(
                this.x + Phaser.Math.Between(-20, 20),
                this.y - 30,
                Phaser.Math.Between(3, 6),
                0xff8800,
                0.8
            );
            
            this.scene.tweens.add({
                targets: particle,
                y: particle.y - Phaser.Math.Between(50, 100),
                alpha: 0,
                duration: 1000,
                ease: 'Sine.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }
}
