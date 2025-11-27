export class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.sounds = {};
        this.musicVolume = 0.5;
        this.sfxVolume = 0.5;
        this.isMuted = false;
    }
    
    // Load all sound effects
    preload() {
        // Jump sounds
        // this.scene.load.audio('jump', '/sounds/jump.mp3');
        // this.scene.load.audio('land', '/sounds/land.mp3');
        
        // Transform sounds
        // this.scene.load.audio('transform', '/sounds/transform.mp3');
        
        // Death and victory
        // this.scene.load.audio('death', '/sounds/death.mp3');
        // this.scene.load.audio('victory', '/sounds/victory.mp3');
        
        // Background music
        // this.scene.load.audio('bgm', '/sounds/background-music.mp3');
        
        // UI sounds
        // this.scene.load.audio('button-click', '/sounds/button-click.mp3');
        // this.scene.load.audio('button-hover', '/sounds/button-hover.mp3');
    }
    
    // Initialize sounds after loading
    create() {
        // Create sound objects (commented out until audio files are added)
        // this.sounds.jump = this.scene.sound.add('jump', { volume: this.sfxVolume });
        // this.sounds.land = this.scene.sound.add('land', { volume: this.sfxVolume });
        // this.sounds.transform = this.scene.sound.add('transform', { volume: this.sfxVolume });
        // this.sounds.death = this.scene.sound.add('death', { volume: this.sfxVolume });
        // this.sounds.victory = this.scene.sound.add('victory', { volume: this.sfxVolume });
        // this.sounds.buttonClick = this.scene.sound.add('button-click', { volume: this.sfxVolume });
        // this.sounds.buttonHover = this.scene.sound.add('button-hover', { volume: this.sfxVolume * 0.5 });
        
        // Background music (looping)
        // this.sounds.bgm = this.scene.sound.add('bgm', { 
        //     volume: this.musicVolume, 
        //     loop: true 
        // });
    }
    
    // Play jump sound
    playJump() {
        if (this.sounds.jump && !this.isMuted) {
            this.sounds.jump.play();
        }
    }
    
    // Play landing/bounce sound
    playLand(velocity) {
        if (this.sounds.land && !this.isMuted) {
            // Adjust volume based on impact velocity
            const impactVolume = Math.min(Math.abs(velocity) / 1000, 1) * this.sfxVolume;
            this.sounds.land.play({ volume: impactVolume });
        }
    }
    
    // Play transform sound
    playTransform() {
        if (this.sounds.transform && !this.isMuted) {
            this.sounds.transform.play();
        }
    }
    
    // Play death sound
    playDeath() {
        if (this.sounds.death && !this.isMuted) {
            this.sounds.death.play();
        }
    }
    
    // Play victory sound
    playVictory() {
        if (this.sounds.victory && !this.isMuted) {
            this.sounds.victory.play();
        }
    }
    
    // Play button click sound
    playButtonClick() {
        if (this.sounds.buttonClick && !this.isMuted) {
            this.sounds.buttonClick.play();
        }
    }
    
    // Play button hover sound
    playButtonHover() {
        if (this.sounds.buttonHover && !this.isMuted) {
            this.sounds.buttonHover.play();
        }
    }
    
    // Start background music
    playMusic() {
        if (this.sounds.bgm && !this.isMuted && !this.sounds.bgm.isPlaying) {
            this.sounds.bgm.play();
        }
    }
    
    // Stop background music
    stopMusic() {
        if (this.sounds.bgm && this.sounds.bgm.isPlaying) {
            this.sounds.bgm.stop();
        }
    }
    
    // Set music volume
    setMusicVolume(volume) {
        this.musicVolume = volume;
        if (this.sounds.bgm) {
            this.sounds.bgm.setVolume(volume);
        }
    }
    
    // Set SFX volume
    setSFXVolume(volume) {
        this.sfxVolume = volume;
        Object.keys(this.sounds).forEach(key => {
            if (key !== 'bgm' && this.sounds[key]) {
                this.sounds[key].setVolume(volume);
            }
        });
    }
    
    // Mute/unmute all sounds
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.scene.sound.mute = this.isMuted;
        return this.isMuted;
    }
}
