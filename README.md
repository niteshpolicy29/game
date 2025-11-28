# Nightmellow - Ball Platformer Game

A Halloween-themed 2D platformer game built with Phaser 3 featuring a unique triple-form transformation system. Control a candy ball character that can transform into marshmallow and jelly forms, each with distinct physics. Navigate through haunted landscapes with water crossings, avoid cursed bats, and collect your candy before the night ends!

**Current Status**: 4 levels complete with infinite looping, full audio system, pause menu, tutorial scene, and options menu.

## Features

- **Triple Form System**: Switch between three unique forms with distinct physics
  - **Candy Ball**: Normal movement, can jump, standard physics
  - **Marshmallow**: Slow floating descent, cannot jump, water physics
  - **Jelly**: Bouncy with automatic idle hops, fast-fall mechanic, floaty air physics
- **4 Unique Levels**: Each with distinct layouts, infinite looping progression
- **Water Physics**: Marshmallow form floats on water with realistic bobbing and splash effects
- **Enemy Hazards**: Cursed bats patrol platforms with deadly touch
- **Challenging Level Design**: Navigate varied gaps (small, medium, large, huge) across expansive worlds
- **Spooky Halloween Theme**: Purple night sky, haunted castle, glowing moon, parallax backgrounds
- **Lives System**: 4 lives with instant respawn and form-specific death animations
- **Full Audio System**: Background music, sound effects, adjustable volume controls
- **Dynamic Camera**: Smooth following camera with world boundaries
- **Victory & Game Over**: Unique scenes with thematic animations
- **Pause Menu**: ESC to pause, resume or return to menu
- **Tutorial Scene**: Interactive how-to-play guide
- **Options Menu**: Volume controls for music and SFX
- **Completion Time Tracking**: Best time saved to localStorage
- **Jump Buffering**: Responsive jump input with 150ms buffer window
- **Visual Polish**: Rolling animation, dynamic shine effects, particle systems, procedural textures
- **Flying Crows**: Atmospheric background elements with wing animation

## Controls

- **Arrow Keys** or **WASD**: Move left/right
- **Spacebar** or **Up Arrow** or **W**: Jump (not available in marshmallow form)
- **E**: Toggle marshmallow form (floats slowly, cannot jump, water physics)
- **Q**: Toggle jelly form (bouncy, auto-hops, fast-fall with jump in air)
- **ESC**: Pause game (during gameplay)
- **M**: Return to menu (from game over/victory screens)

## Setup and Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

The game will open automatically in your browser (default: http://localhost:5173)

## Game Objective

Guide the candy ball through a haunted Halloween night to reach the trick-or-treat bag at the end. Navigate across platforms and gaps, avoiding the cursed bats that patrol the level - their touch is deadly! 

**Form Strategy:**
- **Candy Ball**: Best for precise platforming and jumping
- **Marshmallow**: Float slowly down large gaps and across water areas
- **Jelly**: Bouncy movement with high jumps, use fast-fall (jump in air) to quickly reach ground

You have 4 lives - use them wisely! Complete all levels to collect your candy! Levels loop infinitely with increasing difficulty.

## Technical Details

- **Engine**: Phaser 3.70.0
- **Build Tool**: Vite 5.0 for fast development and optimized builds
- **Module System**: ES6 modules
- **Physics**: Arcade Physics engine with custom tuning
- **Resolution**: 1920x1080 with responsive scaling
- **Target FPS**: 60 FPS
- **Renderer**: WebGL with automatic Canvas fallback
- **Storage**: LocalStorage for best time persistence

## Project Structure

```
├── index.html                      # Main HTML entry point
├── package.json                    # Dependencies and scripts
├── vite.config.js                  # Vite configuration
├── src/
│   ├── main.js                     # Application entry
│   ├── game.js                     # Game instance initialization
│   ├── config.js                   # Game & physics configuration
│   ├── audioConfig.js              # Audio system configuration
│   ├── data/
│   │   ├── levelData.js           # Level 1 layout
│   │   ├── level2Data.js          # Level 2 layout
│   │   ├── level3Data.js          # Level 3 layout
│   │   └── level4Data.js          # Level 4 layout
│   ├── entities/
│   │   ├── Player.js              # Player ball with physics and visuals
│   │   ├── PlatformManager.js     # Platform creation and collision
│   │   ├── Goal.js                # Trick-or-treat bag goal
│   │   ├── Enemy.js               # Cursed bat enemies with wing animation
│   │   ├── Checkpoint.js          # Checkpoint lanterns
│   │   └── Crow.js                # Flying crow background elements
│   └── scenes/
│       ├── BootScene.js           # Initial loading scene
│       ├── MenuScene.js           # Main menu with title
│       ├── TutorialScene.js       # How to play instructions
│       ├── OptionsScene.js        # Volume controls
│       ├── GameScene.js           # Main gameplay scene
│       ├── PauseScene.js          # Pause menu overlay
│       ├── RespawnScene.js        # Death/respawn screen
│       ├── GameOverScene.js       # Game over with crying kids
│       └── VictoryScene.js        # Victory celebration
└── .kiro/
    └── specs/phaser-ball-platformer/
        ├── requirements.md         # Feature requirements
        ├── design.md              # Technical design document
        └── tasks.md               # Implementation tasks
```

## Development

### Hot Module Replacement
Vite provides instant HMR for rapid development. Changes to code are reflected immediately without full page reload.

### Physics Debugging
Enable physics body visualization in `src/config.js`:

```javascript
arcade: {
    gravity: { y: 1920 },
    debug: true  // Shows collision bodies and velocities
}
```

### Configuration
Key physics values in `src/config.js`:
- **Gravity**: 1920 (creates floaty feel)
- **Max Speed**: 480 (horizontal velocity cap)
- **Acceleration**: 1440 (responsive movement)
- **Drag**: 960 (smooth deceleration)
- **Jump Velocity**: -960 (jump height)

### Level Design
Edit `src/data/levelData.js` to modify:
- Platform positions and sizes
- Enemy patrol routes
- Checkpoint locations
- Player start position
- Goal position
- World boundaries

## Game Mechanics

### Triple Form System
Press **E** or **Q** to switch between three unique forms with distinct physics:

**Candy Ball (Default)**
- Normal movement speed (480 max)
- Standard jump with responsive controls
- Falls at normal gravity (1920)
- Shine effect dynamically points toward moon
- Breaks into colored particles on death

**Marshmallow Form (E key)**
- Slower movement (240 max speed, half of candy)
- Cannot jump - must use platforms and water
- Floats down slowly with buoyancy effect (-400 upward force)
- **Realistic Water Physics:**
  - Bobs gently on water surface (6 pixel amplitude)
  - Entry splash based on velocity
  - Dip and recovery animation on landing
  - Movement creates turbulence (faster bobbing)
  - Can climb out at water edges with upward boost
  - Increased drag for realistic resistance
- Matte appearance (no shine sprite)
- Burns dark and crumbles into ash on death

**Jelly Form (Q key)**
- Moderate speed (280 max)
- Very high jumps (-1300 velocity, 36% higher than candy)
- Automatic idle hops every 800ms when grounded
- Floaty air physics (reduced gravity when falling)
- **Fast-fall mechanic:** Press jump in air to quickly drop to ground
- Bouncy physics (0.5 bounce coefficient)
- Squish animation on landing
- Splats and dissolves into green particles on death

### Water Physics (Marshmallow Only)
Marshmallow form features a sophisticated water physics system:
- **Realistic bobbing:** Gentle sinusoidal motion (6 pixel amplitude) on water surface
- **Entry splash:** Particle effects scaled by entry velocity
- **Dip and recovery:** Smooth cubic ease-out animation after landing
- **Movement turbulence:** Faster movement increases bobbing speed
- **Edge climbing:** Upward boost (-600 velocity) when approaching water edges
- **Adaptive drag:** Water resistance increases with speed (180+ base drag)
- **Spring physics:** Smooth floating with velocity-based dampening
- Two water areas in level: 850 and 560 units wide

### Enemies
- Cursed bats patrol between defined points
- Smooth floating/bobbing animation
- Instant respawn on contact (lose 1 life)
- Cannot be defeated - must be avoided

### Lives System
- Start with 3 lives
- Lose life when hit by enemy or falling off world
- Instant respawn at start position
- Form-specific death animations
- Game over when all lives lost

### Physics
- Ball rolls realistically based on velocity
- Shine effect points toward moon (candy and jelly only)
- Jump buffering allows jump input slightly before landing
- Friction system for smooth deceleration
- Form-specific physics properties

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

Requirements:
- ES6 JavaScript support
- WebGL or Canvas 2D
- LocalStorage API

## Credits

Built with Phaser 3 game framework
Developed using Kiro AI assistant
