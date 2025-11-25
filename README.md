# Haunted Pumpkin - Ball Platformer Game

A Halloween-themed 2D platformer game built with Phaser 3 where you control a candy ball character through a spooky physics-based environment. Navigate through haunted landscapes, avoid cursed bats, and collect your candy before the night ends!

## Features

- **Triple Form System**: Switch between three unique forms with distinct physics
  - **Candy Ball**: Normal movement, can jump, standard physics
  - **Marshmallow**: Slow floating descent, cannot jump, water physics
  - **Jelly**: Bouncy with automatic idle hops, fast-fall mechanic, floaty air physics
- **Water Physics**: Marshmallow form floats on water with realistic bobbing and splash effects
- **Enemy Hazards**: Cursed bats patrol platforms with deadly touch
- **Challenging Level Design**: Navigate varied gaps (small, medium, large, huge) across an 8220-unit world
- **Spooky Halloween Theme**: Purple night sky, haunted castle, glowing moon, spooky trees with faces
- **Lives System**: 3 lives with instant respawn and form-specific death animations
- **Dynamic Camera**: Smooth following camera with world boundaries
- **Victory & Game Over**: Unique scenes with thematic animations
- **Completion Time Tracking**: Best time saved to localStorage
- **Jump Buffering**: Responsive jump input with 150ms buffer window
- **Visual Polish**: Rolling animation, dynamic shine effects, particle systems, procedural textures

## Controls

- **Arrow Keys** or **WASD**: Move left/right
- **Spacebar** or **Up Arrow** or **W**: Jump (not available in marshmallow form)
- **E**: Toggle marshmallow form (floats slowly, cannot jump, water physics)
- **Q**: Toggle jelly form (bouncy, auto-hops, fast-fall with jump in air)
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

You have 3 lives - use them wisely! Complete the journey to collect your candy!

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
│   ├── data/
│   │   └── levelData.js           # Level layout, platforms, enemies, checkpoints
│   ├── entities/
│   │   ├── Player.js              # Player ball with physics and visuals
│   │   ├── PlatformManager.js     # Platform creation and collision
│   │   ├── Goal.js                # Trick-or-treat bag goal
│   │   ├── Enemy.js               # Cursed bat enemies
│   │   └── Checkpoint.js          # Checkpoint lanterns
│   └── scenes/
│       ├── BootScene.js           # Initial loading scene
│       ├── MenuScene.js           # Main menu with title
│       ├── GameScene.js           # Main gameplay scene
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
Press **E** or **Q** to switch between three unique forms:

**Candy Ball (Default)**
- Normal movement speed (480 max)
- Can jump with responsive controls
- Falls at normal gravity
- Shine effect points toward moon

**Marshmallow Form (E key)**
- Slower movement (240 max speed)
- Cannot jump
- Floats down slowly with buoyancy effect
- Water physics: bobs on water surface with realistic splash and dip effects
- Matte appearance (no shine)
- Burns and crumbles on death

**Jelly Form (Q key)**
- Moderate speed (280 max)
- Very high jumps (1300 velocity)
- Automatic idle hops every 800ms when grounded
- Floaty air physics (reduced gravity)
- Fast-fall mechanic: press jump in air to quickly drop to ground
- Bouncy landing with squish animation
- Splats and dissolves on death

### Water Physics (Marshmallow Only)
- Realistic bobbing on water surface
- Entry splash based on velocity
- Dip and recovery animation on landing
- Can climb out at water edges
- Increased drag for realistic resistance

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
