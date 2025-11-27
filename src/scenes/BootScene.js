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
        
        // Load parallax background layers
        this.load.image('bg-layer1', '/game area background/layer1.png');
        this.load.image('bg-layer2', '/game area background/layer2.png');
        this.load.image('bg-layer3', '/game area background/layer3.png');
    }
    
    create() {
        // Transition to menu
        this.scene.start('MenuScene');
    }
}
