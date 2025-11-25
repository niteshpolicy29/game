import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    create() {
        // Dark background
        this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x0a0a0f,
            0.9
        );
        
        // Spooky Game Over text
        const gameOverText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 200,
            'NO CANDY!',
            { fontSize: '96px', fill: '#cc0000', fontStyle: 'bold' }
        );
        gameOverText.setOrigin(0.5);
        gameOverText.setShadow(5, 5, '#000000', 15);
        
        // Sad message
        const sadText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 120,
            'The kids got no treats...',
            { fontSize: '36px', fill: '#888888', fontStyle: 'italic' }
        );
        sadText.setOrigin(0.5);
        
        // Create crying kids
        this.createCryingKids();
        
        // Restart instructions
        const restartText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 120,
            'Press SPACE to Try Again',
            { fontSize: '36px', fill: '#ff6600', fontStyle: 'bold' }
        );
        restartText.setOrigin(0.5);
        
        // Eerie blinking effect
        this.tweens.add({
            targets: restartText,
            alpha: 0.2,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Menu option - positioned clearly at bottom
        const menuText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 60,
            'Press M for Menu',
            { fontSize: '28px', fill: '#aaaaaa', fontStyle: 'bold' }
        );
        menuText.setOrigin(0.5);
        
        // Input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        
        this.input.keyboard.once('keydown-M', () => {
            this.scene.start('MenuScene');
        });
    }
    
    createCryingKids() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // Create 3 crying kids
        const kidPositions = [
            { x: centerX - 200, y: centerY + 20 },
            { x: centerX, y: centerY + 20 },
            { x: centerX + 200, y: centerY + 20 }
        ];
        
        kidPositions.forEach((pos, index) => {
            this.createCryingKid(pos.x, pos.y, index);
        });
    }
    
    createCryingKid(x, y, index) {
        const graphics = this.add.graphics();
        
        // Different costume colors for variety
        const costumeColors = [0x9933ff, 0xff6600, 0x00cc66];
        const costumeColor = costumeColors[index % 3];
        
        // Body (costume with better proportions)
        graphics.fillStyle(costumeColor, 1);
        graphics.fillRect(x - 25, y + 10, 50, 60);
        
        // Arms
        graphics.fillRect(x - 40, y + 15, 15, 40);
        graphics.fillRect(x + 25, y + 15, 15, 40);
        
        // Legs
        graphics.fillStyle(0x2a2a2a, 1);
        graphics.fillRect(x - 20, y + 70, 15, 35);
        graphics.fillRect(x + 5, y + 70, 15, 35);
        
        // Shoes
        graphics.fillStyle(0x1a1a1a, 1);
        graphics.fillRect(x - 22, y + 105, 19, 8);
        graphics.fillRect(x + 3, y + 105, 19, 8);
        
        // Head (realistic skin tone)
        graphics.fillStyle(0xffcc99, 1);
        graphics.fillCircle(x, y - 10, 28);
        
        // Hair
        graphics.fillStyle(0x4a2a1a, 1);
        graphics.fillCircle(x - 15, y - 25, 18);
        graphics.fillCircle(x, y - 30, 20);
        graphics.fillCircle(x + 15, y - 25, 18);
        
        // Sad closed eyes (crying hard)
        graphics.lineStyle(3, 0x000000, 1);
        graphics.beginPath();
        graphics.arc(x - 10, y - 15, 6, 0.2, Math.PI - 0.2, false);
        graphics.strokePath();
        graphics.beginPath();
        graphics.arc(x + 10, y - 15, 6, 0.2, Math.PI - 0.2, false);
        graphics.strokePath();
        
        // Tears streaming down
        graphics.fillStyle(0x6699ff, 0.8);
        graphics.fillCircle(x - 10, y - 8, 3);
        graphics.fillCircle(x + 10, y - 8, 3);
        graphics.fillCircle(x - 10, y, 3);
        graphics.fillCircle(x + 10, y, 3);
        graphics.fillCircle(x - 10, y + 8, 2);
        graphics.fillCircle(x + 10, y + 8, 2);
        
        // Wide open crying mouth
        graphics.fillStyle(0x000000, 1);
        graphics.fillEllipse(x, y + 5, 12, 16);
        
        // Red cheeks from crying
        graphics.fillStyle(0xff6666, 0.5);
        graphics.fillCircle(x - 20, y - 5, 8);
        graphics.fillCircle(x + 20, y - 5, 8);
        
        // Empty candy bag on ground
        graphics.fillStyle(0xff6600, 1);
        graphics.beginPath();
        graphics.moveTo(x + 30, y + 90);
        graphics.lineTo(x + 25, y + 110);
        graphics.lineTo(x + 45, y + 110);
        graphics.lineTo(x + 40, y + 90);
        graphics.closePath();
        graphics.fillPath();
        
        // Jack-o-lantern face on bag
        graphics.fillStyle(0x000000, 1);
        graphics.fillTriangle(x + 30, y + 95, x + 32, y + 98, x + 28, y + 98);
        graphics.fillTriangle(x + 38, y + 95, x + 40, y + 98, x + 36, y + 98);
        
        // No body animation - kids stay still while crying
        
        // Continuous tears falling
        this.time.addEvent({
            delay: 400 + index * 200,
            callback: () => {
                const tearX = x + (Math.random() > 0.5 ? -10 : 10);
                const tear = this.add.circle(tearX, y - 8, 3, 0x6699ff, 0.9);
                this.tweens.add({
                    targets: tear,
                    y: tear.y + 60,
                    alpha: 0,
                    scaleY: 1.5,
                    duration: 1200,
                    ease: 'Quad.easeIn',
                    onComplete: () => tear.destroy()
                });
            },
            loop: true
        });
    }
}
