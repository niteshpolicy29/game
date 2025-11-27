import Phaser from 'phaser';

export class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
    }
    
    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // Dark background
        this.add.rectangle(
            centerX,
            centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x0a0a0f,
            0.95
        );
        
        // Title
        const title = this.add.text(
            centerX,
            100,
            'OPTIONS',
            { fontFamily: 'October Crow, cursive', fontSize: '72px', fill: '#ff6600' }
        );
        title.setOrigin(0.5);
        title.setShadow(5, 5, '#000000', 10);
        
        // Audio Settings Section
        const audioTitle = this.add.text(
            centerX,
            centerY - 100,
            'AUDIO SETTINGS',
            { fontSize: '42px', fill: '#ffaa00', fontStyle: 'bold' }
        );
        audioTitle.setOrigin(0.5);
        
        // Music Volume (placeholder for future implementation)
        this.createVolumeControl(centerX, centerY - 20, 'Music Volume', 'music');
        
        // SFX Volume (placeholder for future implementation)
        this.createVolumeControl(centerX, centerY + 60, 'SFX Volume', 'sfx');
        
        // Coming Soon message
        const comingSoon = this.add.text(
            centerX,
            centerY + 150,
            'Audio will be added in a future update',
            { fontSize: '24px', fill: '#888888', fontStyle: 'italic' }
        );
        comingSoon.setOrigin(0.5);
        
        // Back button
        this.createButton(centerX, this.cameras.main.height - 100, 'BACK TO MENU', () => {
            this.scene.start('MenuScene');
        });
        
        // ESC hint
        const escHint = this.add.text(
            centerX,
            this.cameras.main.height - 40,
            'Press ESC to return to menu',
            { fontSize: '20px', fill: '#888888' }
        );
        escHint.setOrigin(0.5);
        
        // Keyboard shortcut
        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }
    
    createVolumeControl(x, y, label, type) {
        // Label
        const labelText = this.add.text(x - 200, y, label + ':', {
            fontSize: '28px',
            fill: '#ffffff'
        });
        labelText.setOrigin(0, 0.5);
        
        // Volume bar background
        const barWidth = 300;
        const barHeight = 20;
        const barBg = this.add.rectangle(x + 100, y, barWidth, barHeight, 0x333333);
        barBg.setStrokeStyle(2, 0xff6600);
        
        // Volume bar fill (currently at 50% as placeholder)
        const volumeLevel = 0.5; // Will be configurable later
        const fillWidth = barWidth * volumeLevel;
        const barFill = this.add.rectangle(
            x + 100 - (barWidth / 2) + (fillWidth / 2),
            y,
            fillWidth,
            barHeight,
            0xff6600
        );
        
        // Percentage text
        const percentText = this.add.text(x + 270, y, '50%', {
            fontSize: '24px',
            fill: '#ffaa00'
        });
        percentText.setOrigin(0, 0.5);
        
        return { label: labelText, barBg, barFill, percentText };
    }
    
    createButton(x, y, text, callback) {
        // Button background
        const buttonWidth = 400;
        const buttonHeight = 60;
        
        const bg = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x000000, 0.7);
        bg.setStrokeStyle(3, 0xff6600);
        
        // Button text
        const buttonText = this.add.text(x, y, text, {
            fontSize: '32px',
            fill: '#ff6600',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5);
        
        // Make interactive
        bg.setInteractive({ useHandCursor: true });
        
        // Hover effects
        bg.on('pointerover', () => {
            bg.setFillStyle(0xff6600, 0.3);
            buttonText.setScale(1.1);
        });
        
        bg.on('pointerout', () => {
            bg.setFillStyle(0x000000, 0.7);
            buttonText.setScale(1);
        });
        
        bg.on('pointerdown', () => {
            bg.setFillStyle(0xff6600, 0.5);
            buttonText.setScale(0.95);
        });
        
        bg.on('pointerup', () => {
            bg.setFillStyle(0xff6600, 0.3);
            buttonText.setScale(1.1);
            callback();
        });
        
        return { bg, text: buttonText };
    }
}
