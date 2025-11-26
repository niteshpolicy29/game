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
        
        // Load background image
        this.load.image('background', '/bg.png');
    }
    
    create() {
        // Transition to menu
        this.scene.start('MenuScene');
    }
}
