import Phaser from 'phaser';

export class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }
    
    create(data) {
        const completionTime = data.time || 0;
        
        // Spooky Victory text
        const victoryText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 120,
            'YOU ESCAPED!',
            { fontSize: '84px', fill: '#00ff00', fontStyle: 'bold' }
        );
        victoryText.setOrigin(0.5);
        victoryText.setShadow(5, 5, '#000000', 15);
        
        // Subtitle
        const subtitle = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 30,
            'The Pumpkin Lives Another Night',
            { fontSize: '36px', fill: '#ff6600', fontStyle: 'italic' }
        );
        subtitle.setOrigin(0.5);
        
        // Completion time
        const timeText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 40,
            `Escape Time: ${completionTime} seconds`,
            { fontSize: '32px', fill: '#8b00ff' }
        );
        timeText.setOrigin(0.5);
        
        // Restart instructions
        const restartText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 120,
            'Press SPACE to Play Again',
            { fontSize: '28px', fill: '#00ff00' }
        );
        restartText.setOrigin(0.5);
        
        // Eerie blinking effect
        this.tweens.add({
            targets: restartText,
            alpha: 0.2,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Menu option
        const menuText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 180,
            'Press M for Menu',
            { fontSize: '24px', fill: '#666666' }
        );
        menuText.setOrigin(0.5);
        
        // Save completion (localStorage)
        this.saveCompletion(completionTime);
        
        // Input
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
        
        this.input.keyboard.once('keydown-M', () => {
            this.scene.start('MenuScene');
        });
    }
    
    saveCompletion(time) {
        const bestTime = localStorage.getItem('bestTime');
        if (!bestTime || time < parseInt(bestTime)) {
            localStorage.setItem('bestTime', time.toString());
        }
    }
}
