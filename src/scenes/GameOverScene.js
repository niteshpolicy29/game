import Phaser from 'phaser';
import { AudioConfig } from '../audioConfig.js';

export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }
    
    preload() {
        // Load three different chibi crying kids
        this.load.image('chibi-kid-1', '/crying-chibi/chibi_one_crying-removebg-preview.png');
        this.load.image('chibi-kid-2', '/crying-chibi/chibi_two_crying-removebg-preview.png');
        this.load.image('chibi-kid-3', '/crying-chibi/chibi_three_crying-removebg-preview.png');
    }
    
    create() {
        // Pause BGM
        const bgm = this.sound.get('bgm');
        if (bgm && bgm.isPlaying) {
            bgm.pause();
        }
        
        // Play game over sound
        const gameOverSound = this.sound.add('game-over-sound', { volume: AudioConfig.getSFXVolume() });
        gameOverSound.play();
        
        // Resume BGM after game over sound ends
        gameOverSound.once('complete', () => {
            if (bgm) {
                bgm.resume();
            }
        });
        
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
            { fontFamily: 'October Crow, cursive', fontSize: '96px', fill: '#cc0000' }
        );
        gameOverText.setOrigin(0.5);
        gameOverText.setShadow(5, 5, '#000000', 15);
        
        // Sad message
        const sadText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 120,
            'The kids got no treats...',
            { fontFamily: 'Griffy, cursive', fontSize: '36px', fill: '#888888', fontStyle: 'italic' }
        );
        sadText.setOrigin(0.5);
        
        // Create crying kids
        this.createCryingKids();
        
        // Restart instructions
        const restartText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 120,
            'Press SPACE to Try Again',
            { fontFamily: 'Griffy, cursive', fontSize: '36px', fill: '#ff6600', fontStyle: 'bold' }
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
            { fontFamily: 'Griffy, cursive', fontSize: '28px', fill: '#aaaaaa', fontStyle: 'bold' }
        );
        menuText.setOrigin(0.5);
        
        // Input - always restart from level 1 with full lives
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene', { level: 1, lives: 4 });
        });
        
        this.input.keyboard.once('keydown-M', () => {
            this.scene.start('MenuScene');
        });
    }
    
    createCryingKids() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // Create 3 crying kids using the chibi image
        const kidPositions = [
            { x: centerX - 250, y: centerY + 50 },
            { x: centerX, y: centerY + 50 },
            { x: centerX + 250, y: centerY + 50 }
        ];
        
        kidPositions.forEach((pos, index) => {
            // Add different chibi image for each kid
            const chibiKey = `chibi-kid-${index + 1}`;
            const kid = this.add.image(pos.x, pos.y, chibiKey);
            kid.setScale(0.4); // All same size now
        });
    }
    
    // Old procedural kid generation - now using chibi image instead
    /*
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
        
        // Head (anime style - larger and rounder)
        graphics.fillStyle(0xffd4a3, 1);
        graphics.fillCircle(x, y - 15, 35);
        
        // Hair (anime style - spiky/messy)
        const hairColors = [0x4a2a1a, 0xffd700, 0x8b4513];
        graphics.fillStyle(hairColors[index % 3], 1);
        
        // Spiky hair tufts
        for (let i = 0; i < 5; i++) {
            const angle = (i / 5) * Math.PI - Math.PI / 2;
            const hairX = x + Math.cos(angle) * 25;
            const hairY = y - 35 + Math.sin(angle) * 15;
            graphics.fillCircle(hairX, hairY, 15);
        }
        
        // Large anime eyes (crying with X shape)
        graphics.fillStyle(0xffffff, 1);
        graphics.fillCircle(x - 12, y - 18, 10);
        graphics.fillCircle(x + 12, y - 18, 10);
        
        // Crying X eyes
        graphics.lineStyle(4, 0x000000, 1);
        graphics.beginPath();
        graphics.moveTo(x - 16, y - 22);
        graphics.lineTo(x - 8, y - 14);
        graphics.strokePath();
        graphics.beginPath();
        graphics.moveTo(x - 8, y - 22);
        graphics.lineTo(x - 16, y - 14);
        graphics.strokePath();
        
        graphics.beginPath();
        graphics.moveTo(x + 8, y - 22);
        graphics.lineTo(x + 16, y - 14);
        graphics.strokePath();
        graphics.beginPath();
        graphics.moveTo(x + 16, y - 22);
        graphics.lineTo(x + 8, y - 14);
        graphics.strokePath();
        
        // Tears streaming down
        graphics.fillStyle(0x6699ff, 0.8);
        graphics.fillCircle(x - 10, y - 8, 3);
        graphics.fillCircle(x + 10, y - 8, 3);
        graphics.fillCircle(x - 10, y, 3);
        graphics.fillCircle(x + 10, y, 3);
        graphics.fillCircle(x - 10, y + 8, 2);
        graphics.fillCircle(x + 10, y + 8, 2);
        
        // Wide open crying mouth (anime style - larger)
        graphics.fillStyle(0x000000, 1);
        graphics.fillEllipse(x, y, 16, 20);
        
        // Anime blush marks (red cheeks)
        graphics.fillStyle(0xff9999, 0.7);
        graphics.fillEllipse(x - 25, y - 8, 12, 8);
        graphics.fillEllipse(x + 25, y - 8, 12, 8);
        
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
    */
}
