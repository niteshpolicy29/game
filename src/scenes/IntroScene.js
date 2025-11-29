import Phaser from 'phaser';

export class IntroScene extends Phaser.Scene {
    constructor() {
        super({ key: 'IntroScene' });
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
            1
        );
        
        // Story lines
        this.storyLines = [
            "On Halloween night, when monsters roam freely…",
            "…one brave candy rolls into the darkness.",
            "Its mission is simple — deliver treats to the kids before it's too late.",
            "But bats, gaps, ghosts, and cursed waters stand in the way.",
            "Transform, survive, and complete the night of destiny."
        ];
        
        this.currentLine = 0;
        this.canSkip = false;
        
        // Create text object
        this.storyText = this.add.text(
            centerX,
            centerY,
            '',
            { 
                fontFamily: 'Griffy, cursive',
                fontSize: '36px', 
                fill: '#ffaa00',
                align: 'center',
                wordWrap: { width: 1400 }
            }
        );
        this.storyText.setOrigin(0.5);
        this.storyText.setAlpha(0);
        
        // Skip hint
        this.skipText = this.add.text(
            centerX,
            this.cameras.main.height - 80,
            'Press SPACE to skip',
            { 
                fontFamily: 'Griffy, cursive',
                fontSize: '24px', 
                fill: '#888888'
            }
        );
        this.skipText.setOrigin(0.5);
        
        // Blinking animation for skip text
        this.tweens.add({
            targets: this.skipText,
            alpha: 0.3,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Start showing story
        this.showNextLine();
        
        // Setup skip input
        this.input.keyboard.on('keydown-SPACE', () => {
            if (this.canSkip) {
                this.skipIntro();
            }
        });
    }
    
    showNextLine() {
        if (this.currentLine >= this.storyLines.length) {
            // Story complete, start game
            this.time.delayedCall(1500, () => {
                this.scene.start('GameScene', { level: 1, lives: 4 });
            });
            return;
        }
        
        // Allow skipping after first line starts
        this.canSkip = true;
        
        // Fade out current text
        this.tweens.add({
            targets: this.storyText,
            alpha: 0,
            duration: 300,
            onComplete: () => {
                // Update text
                this.storyText.setText(this.storyLines[this.currentLine]);
                
                // Fade in new text
                this.tweens.add({
                    targets: this.storyText,
                    alpha: 1,
                    duration: 800,
                    ease: 'Sine.easeIn',
                    onComplete: () => {
                        // Wait before showing next line
                        this.time.delayedCall(2500, () => {
                            this.currentLine++;
                            this.showNextLine();
                        });
                    }
                });
            }
        });
    }
    
    skipIntro() {
        // Clear all tweens and timers
        this.tweens.killAll();
        this.time.removeAllEvents();
        
        // Start game immediately
        this.scene.start('GameScene', { level: 1, lives: 4 });
    }
}
