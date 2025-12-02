import Phaser from 'phaser';
import { AudioConfig } from '../audioConfig.js';

export class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }
    
    preload() {
        // Load three happy chibi kids
        this.load.image('happy-kid-1', '/happy-chibi/chibi_one_happy-removebg-preview.png');
        this.load.image('happy-kid-2', '/happy-chibi/chibi_two_happy-removebg-preview.png');
        this.load.image('happy-kid-3', '/happy-chibi/chibi_three_happy-removebg-preview.png');
    }
    
    create(data) {
        const completionTime = data.time || 0;
        const currentLevel = data.level || 1;
        const currentLives = data.lives !== undefined ? data.lives : 4;
        const nextLevel = currentLevel + 1;
        const hasNextLevel = true; // Infinite looping - always has next level
        
        // Update highest level in localStorage
        const savedHighestLevel = localStorage.getItem('highestLevel');
        let highestLevel = savedHighestLevel ? parseInt(savedHighestLevel) : 0;
        
        if (currentLevel > highestLevel) {
            highestLevel = currentLevel;
            localStorage.setItem('highestLevel', highestLevel.toString());
        }
        
        // Pause BGM
        const bgm = this.sound.get('bgm');
        if (bgm && bgm.isPlaying) {
            bgm.pause();
        }
        
        // Play victory sound
        const victorySound = this.sound.add('victory-sound', { volume: AudioConfig.getSFXVolume() });
        victorySound.play();
        
        // Resume BGM after victory sound ends
        victorySound.once('complete', () => {
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
        
        // Victory text
        const victoryText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 250,
            'LEVEL ' + currentLevel + ' COMPLETE!',
            { fontFamily: 'October Crow, cursive', fontSize: '84px', fill: '#00ff00' }
        );
        victoryText.setOrigin(0.5);
        victoryText.setShadow(5, 5, '#000000', 15);
        
        // Thank you message from kids
        const thankYouText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 150,
            'Th-thank you sooo much for the candy!!',
            { fontFamily: 'Griffy, cursive', fontSize: '38px', fill: '#ffaa00', fontStyle: 'italic', align: 'center' }
        );
        thankYouText.setOrigin(0.5);
        
        // Add pulsing effect to thank you text
        this.tweens.add({
            targets: thankYouText,
            scale: 1.05,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Create happy kids
        this.createHappyKids();
        
        // Next level instruction (infinite looping)
        const nextLevelText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 120,
            'Press SPACE for Next Level',
            { fontFamily: 'Griffy, cursive', fontSize: '36px', fill: '#00ff00', fontStyle: 'bold' }
        );
        nextLevelText.setOrigin(0.5);
        
        this.tweens.add({
            targets: nextLevelText,
            alpha: 0.2,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Input for next level (infinite progression with persistent lives)
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene', { level: nextLevel, lives: currentLives });
        });
        
        // Menu option
        const menuText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 60,
            'Press M for Menu',
            { fontFamily: 'Griffy, cursive', fontSize: '28px', fill: '#aaaaaa', fontStyle: 'bold' }
        );
        menuText.setOrigin(0.5);
        
        // Save completion
        this.saveCompletion(completionTime, currentLevel);
        
        this.input.keyboard.once('keydown-M', () => {
            this.scene.start('MenuScene');
        });
    }
    
    createHappyKids() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        const kidPositions = [
            { x: centerX - 250, y: centerY + 50 },
            { x: centerX, y: centerY + 50 },
            { x: centerX + 250, y: centerY + 50 }
        ];
        
        kidPositions.forEach((pos, index) => {
            const happyKey = `happy-kid-${index + 1}`;
            const kid = this.add.image(pos.x, pos.y, happyKey);
            kid.setScale(0.4);
            
            // Add sparkles animation
            this.createSparkles(pos.x, pos.y - 80, index);
        });
    }
    
    createSparkles(x, y, index) {
        this.time.addEvent({
            delay: 300 + index * 150,
            callback: () => {
                const sparkleX = x + (Math.random() - 0.5) * 60;
                const sparkleY = y + (Math.random() - 0.5) * 60;
                const sparkle = this.add.circle(sparkleX, sparkleY, 5, 0xffff00, 0.9);
                this.tweens.add({
                    targets: sparkle,
                    alpha: 0,
                    scale: 0,
                    duration: 800,
                    ease: 'Sine.easeOut',
                    onComplete: () => sparkle.destroy()
                });
            },
            loop: true
        });
    }
    
    saveCompletion(time, level) {
        const bestTimeKey = `bestTime_level${level}`;
        const bestTime = localStorage.getItem(bestTimeKey);
        if (!bestTime || time < parseInt(bestTime)) {
            localStorage.setItem(bestTimeKey, time.toString());
        }
    }
}
