import Phaser from 'phaser';
import { AudioConfig } from '../audioConfig.js';

export class OptionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'OptionsScene' });
    }
    
    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // Get current volumes
        this.musicVolume = AudioConfig.getMusicVolume();
        this.sfxVolume = AudioConfig.getSFXVolume();
        
        // Track dragging state
        this.isDragging = false;
        this.activeBar = null;
        
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
        
        // Music Volume
        this.musicControl = this.createVolumeControl(centerX, centerY - 20, 'Music Volume', 'music', this.musicVolume);
        
        // SFX Volume
        this.sfxControl = this.createVolumeControl(centerX, centerY + 60, 'SFX Volume', 'sfx', this.sfxVolume);
        
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
    
    createVolumeControl(x, y, label, type, volumeLevel) {
        // Label
        const labelText = this.add.text(x - 350, y, label + ':', {
            fontFamily: 'Griffy, cursive',
            fontSize: '28px',
            fill: '#ffffff'
        });
        labelText.setOrigin(0, 0.5);
        
        // Volume bar background
        const barWidth = 300;
        const barHeight = 20;
        const barBg = this.add.rectangle(x + 50, y, barWidth, barHeight, 0x333333);
        barBg.setStrokeStyle(2, 0xff6600);
        barBg.setInteractive({ useHandCursor: true });
        
        // Volume bar fill
        const fillWidth = barWidth * volumeLevel;
        const barFill = this.add.rectangle(
            x + 50 - (barWidth / 2) + (fillWidth / 2),
            y,
            fillWidth,
            barHeight,
            0xff6600
        );
        
        // Percentage text
        const percentText = this.add.text(x + 220, y, Math.round(volumeLevel * 100) + '%', {
            fontFamily: 'Griffy, cursive',
            fontSize: '24px',
            fill: '#ffaa00'
        });
        percentText.setOrigin(0, 0.5);
        
        // Make bar interactive with drag support
        barBg.setInteractive();
        
        barBg.on('pointerdown', (pointer) => {
            this.isDragging = true;
            this.activeBar = { barBg, barFill, percentText, type, barCenterX: x + 50, barWidth };
            this.updateVolume(pointer, barBg, barFill, percentText, type, x + 50, barWidth);
        });
        
        barBg.on('pointermove', (pointer) => {
            if (this.isDragging && this.activeBar && this.activeBar.barBg === barBg) {
                this.updateVolume(pointer, barBg, barFill, percentText, type, x + 50, barWidth);
            }
        });
        
        barBg.on('pointerup', () => {
            this.isDragging = false;
            this.activeBar = null;
        });
        
        barBg.on('pointerout', (pointer) => {
            // Continue updating even when pointer leaves the bar during drag
            if (this.isDragging && this.activeBar && this.activeBar.barBg === barBg && pointer.isDown) {
                this.updateVolume(pointer, barBg, barFill, percentText, type, x + 50, barWidth);
            }
        });
        
        return { label: labelText, barBg, barFill, percentText, type };
    }
    
    updateVolume(pointer, barBg, barFill, percentText, type, barCenterX, barWidth) {
        // Calculate volume based on click position
        // Use pointer position in camera coordinates
        const barLeft = barCenterX - barWidth / 2;
        const barRight = barCenterX + barWidth / 2;
        const clickX = pointer.x + this.cameras.main.scrollX;
        
        // Clamp to bar bounds
        const clampedX = Phaser.Math.Clamp(clickX, barLeft, barRight);
        const volume = Phaser.Math.Clamp((clampedX - barLeft) / barWidth, 0, 1);
        
        // Update fill bar - ensure it stays within bounds
        const fillWidth = Phaser.Math.Clamp(barWidth * volume, 0, barWidth);
        barFill.width = fillWidth;
        // Position fill bar from the left edge of the background bar
        barFill.x = barLeft + (fillWidth / 2);
        
        // Update percentage text
        percentText.setText(Math.round(volume * 100) + '%');
        
        // Save and apply volume
        if (type === 'music') {
            this.musicVolume = volume;
            AudioConfig.setMusicVolume(volume);
            // Update BGM volume
            const bgm = this.sound.get('bgm');
            if (bgm) {
                bgm.setVolume(volume);
            }
        } else if (type === 'sfx') {
            this.sfxVolume = volume;
            AudioConfig.setSFXVolume(volume);
        }
    }
    
    createButton(x, y, text, callback) {
        // Button background
        const buttonWidth = 400;
        const buttonHeight = 60;
        
        const bg = this.add.rectangle(x, y, buttonWidth, buttonHeight, 0x000000, 0.7);
        bg.setStrokeStyle(3, 0xff6600);
        
        // Button text
        const buttonText = this.add.text(x, y, text, {
            fontFamily: 'Griffy, cursive',
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
