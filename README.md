# Haunted Pumpkin - Ball Platformer Game

A Halloween-themed 2D platformer game built with Phaser 3 where you control a candy ball character through a spooky physics-based environment. Navigate through haunted landscapes, avoid cursed bats, and collect your candy before the night ends!

## Features

- **Smooth Physics-Based Movement**: Realistic ball rolling with acceleration and friction
- **Lives System**: 3 lives with checkpoint respawning
- **Enemy Hazards**: Cursed bats patrol platforms with deadly touch
- **Checkpoint System**: Save progress at glowing lanterns throughout the level
- **Spooky Halloween Theme**: Dark night sky, haunted castle, glowing moon, and jack-o-lanterns
- **Dynamic Camera**: Smooth following camera with world boundaries
- **Victory & Game Over**: Unique scenes with thematic animations
- **Completion Time Tracking**: Best time saved to localStorage
- **Jump Buffering**: Responsive jump input with 150ms buffer window
- **Visual Polish**: Rolling animation, dynamic shine effects, particle systems

## Controls

- **Arrow Keys** or **WASD**: Move left/right
- **Spacebar** or **Up Arrow** or **W**: Jump
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

Guide the candy ball through a haunted Halloween night to reach the trick-or-treat bag at the end. Avoid the cursed bats that patrol the platforms - their touch is deadly! Use checkpoints to save your progress. You have 3 lives to complete the journey.

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

### Lives System
- Start with 3 lives (hearts displayed in top-left)
- Lose a life when touching enemies or falling off world
- Respawn at last activated checkpoint
- Game over when all lives are lost

### Checkpoints
- Glowing lanterns throughout the level
- Activate by touching them
- Lantern lights up when activated
- Respawn here after losing a life

### Enemies
- Cursed bats patrol between defined points
- Smooth floating/bobbing animation
- Instant death on contact
- Cannot be defeated - must be avoided

### Physics
- Ball rolls realistically based on velocity
- Shine effect always points toward moon
- Jump buffering allows jump input slightly before landing
- Friction system for smooth deceleration

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
