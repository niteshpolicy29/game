import Phaser from 'phaser';

export class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PauseScene' });
    }
    
    create(data) {
        const currentLevel = data.level || 1;
        const currentLives = data.lives || 4;
        
        // Semi-transparent dark overlay
        const overlay = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.7
        );
        overlay.setScrollFactor(0);
        
        // Pause title
        const pauseText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 150,
            'PAUSED',
            { fontFamily: 'October Crow, cursive', fontSize: '84px', fill: '#ffaa00' }
        );
        pauseText.setOrigin(0.5);
        pauseText.setShadow(5, 5, '#000000', 15);
        
        // Resume button
        const resumeButton = this.createButton(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 20,
            'Resume (ESC)',
            () => {
                this.scene.resume('GameScene');
                this.scene.stop('PauseScene');
            }
        );
        
        // Restart button
        const restartButton = this.createButton(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 60,
            'Restart Level',
            () => {
                // Stop PauseScene first
                this.scene.stop();
                // Stop and restart from level 1 with full lives
                this.scene.stop('GameScene');
                this.scene.start('GameScene', { level: 1, lives: 4 });
            }
        );
        
        // Main menu button
        const menuButton = this.createButton(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 140,
            'Main Menu',
            () => {
                // Stop PauseScene first
                this.scene.stop();
                // Stop GameScene and start MenuScene
                this.scene.stop('GameScene');
                this.scene.start('MenuScene');
            }
        );
        
        // ESC key to resume
        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.resume('GameScene');
            this.scene.stop('PauseScene');
        });
    }
    
    createButton(x, y, text, callback) {
        const buttonText = this.add.text(x, y, text, {
            fontFamily: 'Griffy, cursive',
            fontSize: '36px',
            fill: '#ffffff',
            fontStyle: 'bold',
            backgroundColor: '#333333',
            padding: { x: 30, y: 15 }
        });
        buttonText.setOrigin(0.5);
        buttonText.setInteractive({ useHandCursor: true });
        
        // Hover effects
        buttonText.on('pointerover', () => {
            buttonText.setStyle({ fill: '#ffaa00' });
            buttonText.setScale(1.05);
        });
        
        buttonText.on('pointerout', () => {
            buttonText.setStyle({ fill: '#ffffff' });
            buttonText.setScale(1);
        });
        
        buttonText.on('pointerdown', callback);
        
        return buttonText;
    }
}
