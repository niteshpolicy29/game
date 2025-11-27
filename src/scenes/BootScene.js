import Phaser from 'phaser';

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
        
        // Load ground and water textures (with cache busting for development)
        this.load.image('ground-texture', `/assets/ground-spooky.png.png?v=${Date.now()}`);
        this.load.image('water-texture', `/assets/water area.png?v=${Date.now()}`);
    }
    
    create() {
        // Transition to menu
        this.scene.start('MenuScene');
    }
}
