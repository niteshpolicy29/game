import Phaser from 'phaser';

export class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TutorialScene' });
    }
    
    preload() {
        // Load background image for use in GameScene
        this.load.image('background', '/bg.png');
    }
    
    create() {
        const centerX = this.cameras.main.centerX;
        
        // Dark background
        this.add.rectangle(centerX, 540, this.cameras.main.width, this.cameras.main.height, 0x0a0a0f);
        
        // Title
        const title = this.add.text(centerX, 60, 'HOW TO PLAY', {
            fontFamily: 'October Crow, cursive',
            fontSize: '64px',
            fill: '#ff6600',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);
        
        // Subtitle
        const subtitle = this.add.text(centerX, 120, 'Master the Three Forms', {
            fontFamily: 'Griffy, cursive',
            fontSize: '28px',
            fill: '#ffaa00',
            fontStyle: 'italic'
        });
        subtitle.setOrigin(0.5);
        
        // Create three columns for forms
        const leftX = centerX - 500;
        const middleX = centerX;
        const rightX = centerX + 500;
        const formY = 200;
        
        // Candy Ball
        this.createFormTip(leftX, formY, 'CANDY BALL', '#ff7700', 
            'Press E to toggle\n\nFast movement\nNormal jump\nBest for speed');
        
        // Marshmallow
        this.createFormTip(middleX, formY, 'MARSHMALLOW', '#fff8f0',
            'Press E to toggle\n\nSlow movement\nCannot jump\nFloats on water');
        
        // Jelly
        this.createFormTip(rightX, formY, 'JELLY', '#44ff44',
            'Press Q to toggle\n\nAuto-hops always\nW = BIG jump\nW in air = fast-fall');
        
        // Controls section
        const controlsY = 550;
        const controlsTitle = this.add.text(centerX, controlsY, 'CONTROLS', {
            fontFamily: 'Griffy, cursive',
            fontSize: '32px',
            fill: '#ffffff',
            fontStyle: 'bold'
        });
        controlsTitle.setOrigin(0.5);
        
        const controls = this.add.text(centerX, controlsY + 50, 
            'Move: A/D or ←/→     Jump: W/Space/↑     Forms: E (Candy/Marshmallow)  Q (Jelly)',
            {
                fontFamily: 'Griffy, cursive',
                fontSize: '22px',
                fill: '#aaaaaa'
            }
        );
        controls.setOrigin(0.5);
        
        // Lives info
        const livesInfo = this.add.text(centerX, controlsY + 110,
            'You have 4 lives • No checkpoints - complete in one run!',
            {
                fontFamily: 'Griffy, cursive',
                fontSize: '24px',
                fill: '#00ff00'
            }
        );
        livesInfo.setOrigin(0.5);
        
        // Start prompt
        const startText = this.add.text(centerX, 1000, 'Press SPACE to Start Game', {
            fontFamily: 'Griffy, cursive',
            fontSize: '42px',
            fill: '#ff6600',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        startText.setOrigin(0.5);
        
        // Back to menu hint
        const backText = this.add.text(centerX, 950, 'Press ESC to return to menu', {
            fontFamily: 'Griffy, cursive',
            fontSize: '20px',
            fill: '#888888'
        });
        backText.setOrigin(0.5);
        
        // Blinking animation
        this.tweens.add({
            targets: startText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        
        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }
    
    createFormTip(x, y, formName, color, tipText) {
        // Form name with colored background box
        const nameBox = this.add.rectangle(x, y, 280, 45, Phaser.Display.Color.HexStringToColor(color).color, 0.25);
        nameBox.setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(color).color, 0.8);
        
        const name = this.add.text(x, y, formName, {
            fontFamily: 'Griffy, cursive',
            fontSize: '26px',
            fill: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        name.setOrigin(0.5);
        
        // Tips text - better spacing
        const tips = this.add.text(x, y + 50, tipText, {
            fontFamily: 'Griffy, cursive',
            fontSize: '18px',
            fill: '#dddddd',
            align: 'center',
            lineSpacing: 6
        });
        tips.setOrigin(0.5, 0);
    }
}
