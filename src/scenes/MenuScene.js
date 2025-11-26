import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        // Spooky Title
        const title = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            'HAUNTED PUMPKIN',
            { fontFamily: 'October Crow, cursive', fontSize: '96px', fill: '#ff6600' }
        );
        title.setOrigin(0.5);
        title.setShadow(5, 5, '#000000', 10);
        
        // Subtitle
        const subtitle = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'ESCAPE THE DARKNESS',
            { fontSize: '48px', fill: '#8b00ff', fontStyle: 'italic' }
        );
        subtitle.setOrigin(0.5);
        
        // Instructions
        const instructions = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'Press SPACE to Start',
            { fontSize: '36px', fill: '#00ff00' }
        );
        instructions.setOrigin(0.5);
        
        // Eerie blinking effect
        this.tweens.add({
            targets: instructions,
            alpha: 0.2,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('TutorialScene');
        });
    }
}
