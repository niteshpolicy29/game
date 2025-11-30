import Phaser from 'phaser';
import { AudioConfig } from '../audioConfig.js';

export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        // Create loading text
        const loadingText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Loading...',
            { fontSize: '24px', fill: '#fff' }
        );
        loadingText.setOrigin(0.5);
        
        // Preload custom fonts using CSS @font-face
        this.loadCustomFonts();
        
        // Load parallax background layers (only 5 layers available)
        this.load.image('bg-layer-1', '/game area background/1.png');
        this.load.image('bg-layer-2', '/game area background/2.png');
        this.load.image('bg-layer-3', '/game area background/3.png');
        this.load.image('bg-layer-4', '/game area background/4.png');
        this.load.image('bg-layer-5', '/game area background/5.png');
        
        // Load audio files
        this.load.audio('jump-sound', '/audio/jump-sound.mp3');
        this.load.audio('game-over-sound', '/audio/game-over.mp3');
        this.load.audio('bgm', '/audio/bgm.mp3');
        this.load.audio('victory-sound', '/audio/victory.mp3');
        this.load.audio('death-sound', '/audio/losses one live.mp3');
    }
    
    loadCustomFonts() {
        // Create @font-face rules for custom fonts
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'October Crow';
                src: url('/font/October Crow.ttf') format('truetype');
                font-weight: normal;
                font-style: normal;
            }
            
            @font-face {
                font-family: 'Griffy';
                src: url('/font/Griffy-Regular.ttf') format('truetype');
                font-weight: normal;
                font-style: normal;
            }
        `;
        document.head.appendChild(style);
        
        // Force font loading by creating hidden text elements
        const testText1 = document.createElement('div');
        testText1.style.fontFamily = 'October Crow';
        testText1.style.position = 'absolute';
        testText1.style.left = '-9999px';
        testText1.textContent = 'Loading';
        document.body.appendChild(testText1);
        
        const testText2 = document.createElement('div');
        testText2.style.fontFamily = 'Griffy';
        testText2.style.position = 'absolute';
        testText2.style.left = '-9999px';
        testText2.textContent = 'Loading';
        document.body.appendChild(testText2);
    }
    
    create() {
        // Start background music (looping) with saved volume
        if (!this.sound.get('bgm')) {
            const musicVolume = AudioConfig.getMusicVolume();
            const bgm = this.sound.add('bgm', { loop: true, volume: musicVolume });
            bgm.play();
        }
        
        // Wait for fonts to load before transitioning
        document.fonts.ready.then(() => {
            this.scene.start('MenuScene');
        }).catch(() => {
            // If font loading fails, proceed anyway after short delay
            this.time.delayedCall(500, () => {
                this.scene.start('MenuScene');
            });
        });
    }
}
