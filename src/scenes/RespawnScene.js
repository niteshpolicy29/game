import Phaser from 'phaser';

export class RespawnScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RespawnScene' });
    }
    
    preload() {
        // Load cheering chibi images
        this.load.image('cheer-1', '/cheer-chibi/cheering_chibi-removebg-preview.png');
        this.load.image('cheer-2', '/cheer-chibi/cheering_level_2_chibi-removebg-preview.png');
        this.load.image('cheer-3', '/cheer-chibi/cheering_level_3_chibi-removebg-preview.png');
    }
    
    create(data) {
        const livesLost = data.livesLost || 1;
        const livesRemaining = data.livesRemaining || 2;
        
        // Dark background
        this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x0a0a0f,
            0.95
        );
        
        // Determine which chibi and message to show based on lives lost
        let chibiKey, message;
        if (livesLost === 1) {
            chibiKey = 'cheer-1';
            message = 'Fight on, you can do it!';
        } else if (livesLost === 2) {
            chibiKey = 'cheer-2';
            message = "Don't give up, Player!";
        } else {
            chibiKey = 'cheer-3';
            message = 'I want candies, so fight Player!';
        }
        
        // Show cheering chibi
        const chibi = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY - 50,
            chibiKey
        );
        chibi.setScale(0.5);
        
        // Add bouncing animation to chibi
        this.tweens.add({
            targets: chibi,
            y: chibi.y - 20,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Encouraging message
        const messageText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 150,
            message,
            { 
                fontFamily: 'October Crow, cursive',
                fontSize: '42px', 
                fill: '#ffaa00',
                align: 'center'
            }
        );
        messageText.setOrigin(0.5);
        
        // Lives remaining
        const livesText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 220,
            `Lives Remaining: ${livesRemaining}`,
            { fontSize: '32px', fill: '#ff6600' }
        );
        livesText.setOrigin(0.5);
        
        // Respawning message
        const respawnText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.height - 80,
            'Respawning...',
            { fontSize: '28px', fill: '#888888' }
        );
        respawnText.setOrigin(0.5);
        
        // Blinking effect
        this.tweens.add({
            targets: respawnText,
            alpha: 0.3,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Return to game after 2.5 seconds
        this.time.delayedCall(2500, () => {
            // Get GameScene and respawn player
            const gameScene = this.scene.get('GameScene');
            if (gameScene && gameScene.respawnPlayer) {
                gameScene.respawnPlayer();
            }
            
            this.scene.stop('RespawnScene');
            this.scene.resume('GameScene');
        });
    }
}
