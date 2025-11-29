import Phaser from 'phaser';
import { AudioConfig } from '../audioConfig.js';

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
            { fontFamily: 'Griffy, cursive', fontSize: '42px', fill: '#ffaa00', fontStyle: 'bold' }
        );
        audioTitle.setOrigin(0.5);
        
        // Get current volumes
        const musicVolume = AudioConfig.getMusicVolume();
        const sfxVolume = AudioConfig.getSFXVolume();
        
        // Music Volume
        this.createVolumeSlider(centerX, centerY - 20, 'Music Volume', 'music', musicVolume);
        
        // SFX Volume
        this.createVolumeSlider(centerX, centerY + 60, 'SFX Volume', 'sfx', sfxVolume);
        
        // Back button
        this.createButton(centerX, this.cameras.main.height - 100, 'BACK TO MENU', () => {
            this.scene.start('MenuScene');
        });
        
        // ESC hint
        const escHint = this.add.text(
            centerX,
            this.cameras.main.height - 40,
            'Press ESC to return to menu',
            { fontFamily: 'Griffy, cursive', fontSize: '20px', fill: '#888888' }
        );
        escHint.setOrigin(0.5);
        
        // Keyboard shortcut
        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }
    
    createVolumeSlider(x, y, label, type, initialVolume) {
        // Label
        const labelText = this.add.text(x - 350, y, label + ':', {
            fontFamily: 'Griffy, cursive',
            fontSize: '28px',
            fill: '#ffffff'
        });
        labelText.setOrigin(0, 0.5);
        
        const barWidth = 300;
        const barHeight = 20;
        const barX = x + 50;
        
        // Background bar
        const barBg = this.add.rectangle(barX, y, barWidth, barHeight, 0x333333);
        barBg.setStrokeStyle(2, 0xff6600);
        
        // Fill bar - starts from left edge of background bar
        const barLeft = barX - barWidth / 2;
        const fillWidth = barWidth * initialVolume;
        const barFill = this.add.rectangle(
            barLeft,
            y,
            fillWidth,
            barHeight,
            0xff6600
        );
        barFill.setOrigin(0, 0.5); // Set origin to left edge
        
        // Percentage text
        const percentText = this.add.text(x + 220, y, Math.round(initialVolume * 100) + '%', {
            fontFamily: 'Griffy, cursive',
            fontSize: '24px',
            fill: '#ffaa00'
        });
        percentText.setOrigin(0, 0.5);
        
        // Create invisible interactive zone over the entire bar area
        const hitZone = this.add.rectangle(barX, y, barWidth, barHeight * 3, 0x000000, 0);
        hitZone.setInteractive({ draggable: false, useHandCursor: true });
        
        // Handle all pointer events on the hit zone
        let isDragging = false;
        
        hitZone.on('pointerdown', (pointer) => {
            isDragging = true;
            this.updateSlider(pointer, barX, barWidth, barFill, percentText, type);
        });
        
        hitZone.on('pointermove', (pointer) => {
            if (isDragging) {
                this.updateSlider(pointer, barX, barWidth, barFill, percentText, type);
            }
        });
        
        hitZone.on('pointerup', () => {
            isDragging = false;
        });
        
        hitZone.on('pointerout', () => {
            isDragging = false;
        });
    }
    
    updateSlider(pointer, barX, barWidth, barFill, percentText, type) {
        // Get pointer position relative to bar
        const barLeft = barX - barWidth / 2;
        const barRight = barX + barWidth / 2;
        
        // Use pointer.x with camera scroll
        const pointerX = pointer.x + this.cameras.main.scrollX;
        
        // Calculate volume (0 to 1)
        const clampedX = Phaser.Math.Clamp(pointerX, barLeft, barRight);
        const volume = Phaser.Math.Clamp((clampedX - barLeft) / barWidth, 0, 1);
        
        // Update fill bar (origin is at left edge)
        const newFillWidth = barWidth * volume;
        barFill.width = newFillWidth;
        barFill.x = barLeft;
        
        // Update percentage text
        percentText.setText(Math.round(volume * 100) + '%');
        
        // Save and apply volume
        if (type === 'music') {
            AudioConfig.setMusicVolume(volume);
            const bgm = this.sound.get('bgm');
            if (bgm) {
                bgm.setVolume(volume);
            }
        } else if (type === 'sfx') {
            AudioConfig.setSFXVolume(volume);
        }
    }
    
    createButton(x, y, text, callback) {
        const buttonWidth = 400;
        const buttonHeight = 60;
        
        const bg = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x000000, 0.7);
        bg.setStrokeStyle(3, 0xff6600);
        
        const buttonText = this.add.text(x, y, text, {
            fontFamily: 'Griffy, cursive',
            fontSize: '32px',
            fill: '#ff6600',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5);
        
        bg.setInteractive({ useHandCursor: true });
        
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
