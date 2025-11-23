import Phaser from 'phaser';

export class Goal extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, null);
        
        this.createPortalVisuals();
        
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.body.setSize(120, 180);
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        
        this.createAnimations(scene);
    }
    
    createPortalVisuals() {
        if (!this.scene.textures.exists('portal')) {
            const width = 180;
            const height = 200;
            const graphics = this.scene.make.graphics({ x: 0, y: 0 });
            
            // Trick-or-treat bag body (orange)
            graphics.fillStyle(0xff6600, 1);
            graphics.beginPath();
            graphics.moveTo(width / 2 - 60, 40);
            graphics.lineTo(width / 2 - 70, height - 20);
            graphics.lineTo(width / 2 + 70, height - 20);
            graphics.lineTo(width / 2 + 60, 40);
            graphics.closePath();
            graphics.fillPath();
            
            // Bag opening (dark inside)
            graphics.fillStyle(0x1a1a1a, 1);
            graphics.fillEllipse(width / 2, 40, 60, 20);
            
            // Bag rim
            graphics.fillStyle(0xcc5500, 1);
            graphics.fillEllipse(width / 2, 35, 65, 15);
            
            // Jack-o-lantern face on bag
            graphics.fillStyle(0x000000, 1);
            
            // Eyes (triangles)
            graphics.fillTriangle(
                width / 2 - 30, 80,
                width / 2 - 20, 60,
                width / 2 - 10, 80
            );
            graphics.fillTriangle(
                width / 2 + 10, 80,
                width / 2 + 20, 60,
                width / 2 + 30, 80
            );
            
            // Nose (triangle)
            graphics.fillTriangle(
                width / 2 - 8, 100,
                width / 2 + 8, 100,
                width / 2, 115
            );
            
            // Mouth (jagged smile)
            graphics.beginPath();
            graphics.moveTo(width / 2 - 40, 130);
            for (let i = 0; i <= 8; i++) {
                const x = width / 2 - 40 + (i * 10);
                const y = 130 + (i % 2 === 0 ? 0 : 12);
                graphics.lineTo(x, y);
            }
            graphics.lineTo(width / 2 - 40, 142);
            graphics.closePath();
            graphics.fillPath();
            
            // Bag handles
            graphics.lineStyle(8, 0xcc5500, 1);
            graphics.beginPath();
            graphics.arc(width / 2 - 40, 25, 20, Math.PI, 0, false);
            graphics.strokePath();
            graphics.beginPath();
            graphics.arc(width / 2 + 40, 25, 20, Math.PI, 0, false);
            graphics.strokePath();
            
            // Glowing effect around opening
            graphics.fillStyle(0xffaa00, 0.3);
            graphics.fillEllipse(width / 2, 40, 70, 25);
            
            graphics.generateTexture('portal', width, height);
            graphics.destroy();
        }
        
        this.setTexture('portal');
    }
    
    createAnimations(scene) {
        // Pulsing glow effect
        const glow1 = scene.add.circle(this.x, this.y, 80, 0x9933ff, 0.2);
        const glow2 = scene.add.circle(this.x, this.y, 60, 0x00ff88, 0.3);
        
        glow1.setDepth(this.depth - 1);
        glow2.setDepth(this.depth - 1);
        
        scene.tweens.add({
            targets: glow1,
            scale: 1.3,
            alpha: 0.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        scene.tweens.add({
            targets: glow2,
            scale: 1.2,
            alpha: 0.15,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Swirling particles
        scene.time.addEvent({
            delay: 200,
            callback: () => {
                const particle = scene.add.circle(
                    this.x + Phaser.Math.Between(-40, 40),
                    this.y + Phaser.Math.Between(-70, 70),
                    Phaser.Math.Between(2, 5),
                    Phaser.Math.Between(0, 1) > 0.5 ? 0x9933ff : 0x00ff88,
                    0.8
                );
                
                scene.tweens.add({
                    targets: particle,
                    x: this.x,
                    y: this.y,
                    alpha: 0,
                    duration: 1000,
                    ease: 'Sine.easeIn',
                    onComplete: () => particle.destroy()
                });
            },
            loop: true
        });
        
        // Portal wobble
        scene.tweens.add({
            targets: this,
            scaleX: 1.05,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
}
