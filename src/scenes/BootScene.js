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
        // Wait for font to load before transitioning
        this.waitForFont();
    }
    
    waitForFont() {
        // Check if font is loaded
        if (document.fonts && document.fonts.check) {
            document.fonts.ready.then(() => {
                // Font is loaded, transition to menu
                this.scene.start('MenuScene');
            }).catch(() => {
                // If font loading fails, still proceed after a short delay
                this.time.delayedCall(500, () => {
                    this.scene.start('MenuScene');
                });
            });
        } else {
            // Fallback for browsers without font loading API
            this.time.delayedCall(500, () => {
                this.scene.start('MenuScene');
            });
        }
    }
}
