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
    
    create() {
        // Start background music (looping) with saved volume
        if (!this.sound.get('bgm')) {
            const musicVolume = AudioConfig.getMusicVolume();
            const bgm = this.sound.add('bgm', { loop: true, volume: musicVolume });
            bgm.play();
        }
        
        // Transition to menu
        this.scene.start('MenuScene');
    }
}
