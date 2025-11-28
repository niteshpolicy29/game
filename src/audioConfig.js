// Audio configuration and volume management
export class AudioConfig {
    static MUSIC_VOLUME_KEY = 'musicVolume';
    static SFX_VOLUME_KEY = 'sfxVolume';
    
    static getMusicVolume() {
        const stored = localStorage.getItem(this.MUSIC_VOLUME_KEY);
        return stored !== null ? parseFloat(stored) : 0.3;
    }
    
    static getSFXVolume() {
        const stored = localStorage.getItem(this.SFX_VOLUME_KEY);
        return stored !== null ? parseFloat(stored) : 0.5;
    }
    
    static setMusicVolume(volume) {
        localStorage.setItem(this.MUSIC_VOLUME_KEY, volume.toString());
    }
    
    static setSFXVolume(volume) {
        localStorage.setItem(this.SFX_VOLUME_KEY, volume.toString());
    }
}
