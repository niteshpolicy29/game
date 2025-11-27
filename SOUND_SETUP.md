# Sound Setup Guide

## Overview
The game has a sound system ready to use. You just need to add audio files to enable sounds.

## Required Audio Files

Create a `public/sounds/` folder and add these audio files:

### Sound Effects (SFX)
1. **jump.mp3** - Played when the ball jumps
2. **land.mp3** - Played when the ball lands (volume varies with impact)
3. **transform.mp3** - Played when switching forms (E or Q key)
4. **death.mp3** - Played when the player dies
5. **victory.mp3** - Played when reaching the goal
6. **button-click.mp3** - Played when clicking menu buttons
7. **button-hover.mp3** - Played when hovering over buttons

### Music
8. **background-music.mp3** - Looping background music during gameplay

## File Format
- **Format**: MP3 or OGG (MP3 recommended for better browser compatibility)
- **Sample Rate**: 44.1kHz recommended
- **Bit Rate**: 128-192 kbps for good quality/size balance

## Folder Structure
```
public/
  sounds/
    jump.mp3
    land.mp3
    transform.mp3
    death.mp3
    victory.mp3
    button-click.mp3
    button-hover.mp3
    background-music.mp3
```

## Enabling Sounds

Once you've added the audio files:

1. Open `src/utils/SoundManager.js`
2. Uncomment all the lines in the `preload()` and `create()` methods
3. The sounds will automatically work!

## Where Sounds Are Played

- **Jump**: When pressing space/W/up arrow (Player.js)
- **Land**: When the ball touches the ground (Player.js - onLanding method)
- **Transform**: When pressing E or Q to change forms (Player.js)
- **Death**: When hitting an enemy or falling off (GameScene.js - handleDeath)
- **Victory**: When reaching the goal (GameScene.js - reachGoal)
- **Button sounds**: Menu buttons (MenuScene.js, OptionsScene.js)
- **Background music**: Starts in GameScene, stops in menu

## Volume Controls

The Options menu already has volume sliders ready:
- Music Volume: Controls background music
- SFX Volume: Controls all sound effects

## Finding Free Sound Effects

Good sources for free game sounds:
- **Freesound.org** - Large library of free sounds
- **OpenGameArt.org** - Game-specific sounds
- **Zapsplat.com** - Free sound effects
- **Incompetech.com** - Free music (Kevin MacLeod)

## Tips

1. Keep sound files small (under 500KB each for SFX)
2. Use short sounds for jump/land (0.1-0.3 seconds)
3. Background music can be 1-2 minutes and loop seamlessly
4. Test volume levels - SFX shouldn't overpower music
5. Consider Halloween/spooky themed sounds to match the game aesthetic
