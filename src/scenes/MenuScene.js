import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    preload() {
        // Load menu background image
        this.load.image('menu-bg', '/start png/starting game page.png');
    }
    
    create() {
        const centerX = this.cameras.main.centerX;
        const centerY = this.cameras.main.centerY;
        
        // Add background image
        const bg = this.add.image(centerX, centerY, 'menu-bg');
        bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);
        
        // Add dark overlay to reduce brightness and improve text readability
        const overlay = this.add.rectangle(
            centerX,
            centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.5
        );
        
        // Spooky Title
        const title = this.add.text(
            centerX,
            centerY - 200,
            'NIGHTMELLOW',
            { fontFamily: 'October Crow, cursive', fontSize: '96px', fill: '#ff6600' }
        );
        title.setOrigin(0.5);
        title.setShadow(5, 5, '#000000', 10);
        
        // Tagline
        const tagline = this.add.text(
            centerX,
            centerY - 100,
            'Run, roll, survive… the kids are counting on you.',
            { fontFamily: 'Griffy, cursive', fontSize: '40px', fill: '#7CFF1A', fontStyle: 'italic' }
        );
        tagline.setOrigin(0.5);
        tagline.setShadow(3, 3, '#000000', 10);
        
        // Create menu buttons
        this.createButton(centerX, centerY + 20, 'START GAME', () => {
            this.scene.start('IntroScene');
        });
        
        this.createButton(centerX, centerY + 100, 'HOW TO PLAY', () => {
            this.scene.start('TutorialScene');
        });
        
        this.createButton(centerX, centerY + 180, 'OPTIONS', () => {
            this.scene.start('OptionsScene');
        });
        
        // Version or credit text
        const credits = this.add.text(
            centerX,
            this.cameras.main.height - 40,
            'Built with Phaser 3',
            { fontFamily: 'Griffy, cursive', fontSize: '20px', fill: '#666666' }
        );
        credits.setOrigin(0.5);
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
