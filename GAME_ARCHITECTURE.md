# Game Architecture

## Overview

Haunted Pumpkin is a 2D physics-based platformer built with Phaser 3. The architecture follows a scene-based structure with clear separation between game logic, rendering, and state management. The game uses Arcade Physics for collision detection and movement, with custom entity classes extending Phaser's built-in types.

The game features a unique marshmallow transformation mechanic where the player can toggle between a candy ball (normal physics) and a marshmallow form (buoyant, slow-falling) to navigate challenging platforming sections with varied gap sizes.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Phaser Game Instance                         │
│                     (src/game.js)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Boot Scene   │→ │ Menu Scene   │→ │ Game Scene   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│         ↓                  ↓                  ↓                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            Arcade Physics Engine                          │  │
│  │  - Gravity: 1920                                          │  │
│  │  - Collision Detection                                    │  │
│  │  - Velocity & Acceleration                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Player Ball  │  │ Platform     │  │ Enemy Bats   │          │
│  │ Entity       │  │ Manager      │  │              │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Checkpoint   │  │ Goal         │  │ Camera       │          │
│  │ System       │  │ (Candy Bag)  │  │ Controller   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Input Handler & UI System                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Game Configuration (src/config.js)

Central configuration for all game constants and Phaser settings.

**Key Exports:**
- `GameConfig`: Phaser game configuration object
- `PhysicsConfig`: Physics constants for player movement

**Configuration Details:**
```javascript
{
  type: Phaser.AUTO,           // WebGL with Canvas fallback
  width: 1920,                 // Native resolution
  height: 1080,
  backgroundColor: '#0a0a0f',  // Dark background
  physics: {
    arcade: {
      gravity: { y: 1920 },    // Floaty feel
      debug: false
    }
  },
  scale: {
    mode: WIDTH_CONTROLS_HEIGHT,
    autoCenter: CENTER_BOTH
  }
}
```

### 2. Scene System

#### BootScene (src/scenes/BootScene.js)
- **Purpose**: Initial loading and setup
- **Responsibilities**:
  - Display loading text
  - Preload assets (currently generates at runtime)
  - Transition to MenuScene
- **Lifecycle**: Runs once at game start

#### MenuScene (src/scenes/MenuScene.js)
- **Purpose**: Main menu and game entry point
- **Features**:
  - Title: "HAUNTED PUMPKIN"
  - Subtitle: "ESCAPE THE DARKNESS"
  - Control instructions
  - Blinking "Press SPACE to Start" text
- **Input**: SPACE key to start game

#### GameScene (src/scenes/GameScene.js)
- **Purpose**: Main gameplay scene
- **Responsibilities**:
  - Level creation and management
  - Player, enemy, checkpoint, and goal instantiation
  - Collision detection setup
  - Lives system management
  - Camera control
  - Background rendering (Halloween theme)
  - UI rendering (lives display)
  - Game state tracking
- **Update Loop**: Updates player, enemies, and checks for fall-off
- **Key Methods**:
  - `createHalloweenBackground()`: Renders night sky, moon, stars, castle, pumpkins, fog
  - `loseLife()`: Handles life loss and respawn
  - `showResurrectionScreen()`: Displays respawn animation
  - `reachCheckpoint()`: Activates checkpoint and updates spawn point
  - `reachGoal()`: Triggers victory sequence
  - `hitEnemy()`: Handles enemy collision

#### GameOverScene (src/scenes/GameOverScene.js)
- **Purpose**: Display game over state
- **Features**:
  - "NO CANDY!" title
  - Crying kids animation with tears
  - Empty candy bags
  - Restart and menu options
- **Input**: SPACE to restart, M for menu

#### VictoryScene (src/scenes/VictoryScene.js)
- **Purpose**: Celebrate level completion
- **Features**:
  - "YOU ESCAPED!" title
  - Completion time display
  - Best time saving to localStorage
  - Restart and menu options
- **Input**: SPACE to restart, M for menu

### 3. Entity System

#### Player (src/entities/Player.js)

**Extends**: `Phaser.Physics.Arcade.Sprite`

**Visual Features:**
- Candy ball with orange/yellow spiral stripes
- Marshmallow form with soft white pillowy texture
- Dynamic shine sprite that points toward moon (hidden in marshmallow form)
- Rolling animation based on velocity
- Glow outline effect
- Transformation particle effects

**Physics Properties:**
```javascript
{
  radius: 48,
  maxSpeed: 480,              // Candy ball
  marshmallowMaxSpeed: 240,   // Marshmallow (slower)
  acceleration: 1440,         // Candy ball
  marshmallowAcceleration: 720, // Marshmallow (less responsive)
  friction: 720,
  jumpVelocity: -960,
  jumpBufferWindow: 150ms,
  buoyancyForce: -400         // Upward force in marshmallow form
}
```

**Key Methods:**
- `createVisuals()`: Generates candy ball texture with stripes and glow
- `createMarshmallowTexture()`: Generates marshmallow texture with pillowy appearance
- `createShine()`: Creates separate shine sprite
- `update(cursors, keys)`: Main update loop for input and movement
- `toggleMarshmallow()`: Switch between candy and marshmallow forms with particle effects
- `moveLeft()` / `moveRight()`: Apply horizontal acceleration (speed varies by form)
- `applyFriction()`: Smooth deceleration when no input
- `applyBuoyancy()`: Apply upward force when falling in marshmallow form
- `jump()`: Apply jump velocity with buffering (disabled in marshmallow form)
- `checkGrounded()`: Update grounded state and handle buffered jumps
- `updateRoll()`: Rotate ball based on velocity (slower in marshmallow form)
- `updateShinePosition()`: Position shine toward moon (hidden in marshmallow form)

**Jump Buffering:**
If jump is pressed while airborne, it's buffered for 150ms. If the player lands within that window, the jump executes immediately, creating responsive controls.

#### PlatformManager (src/entities/PlatformManager.js)

**Purpose**: Manages all static platforms in the level

**Features:**
- Creates platforms from level data
- Dark wood appearance with purple glow outline
- Static physics bodies (no movement)
- Collision setup with player

**Methods:**
- `createPlatforms(platformData)`: Generate all platforms
- `setupCollisions(player)`: Configure player-platform collision
- `getPlatforms()`: Return platform group

#### Enemy (src/entities/Enemy.js)

**Extends**: `Phaser.Physics.Arcade.Sprite`

**Visual Features:**
- Large bat sprite with spread wings
- Glowing red eyes
- Visible fangs
- Purple/dark coloring

**Behavior:**
- Patrols between `patrolStart` and `patrolEnd` x-coordinates
- Smooth floating/bobbing animation using sine wave
- Flips sprite based on direction
- Deadly on contact

**Properties:**
```javascript
{
  speed: 150,
  bobPhase: random,  // For varied bobbing
  baseY: spawn y-coordinate
}
```

**Methods:**
- `createBatTexture()`: Static method to generate bat texture
- `update()`: Patrol movement and bobbing animation

#### Checkpoint (src/entities/Checkpoint.js)

**Note**: Checkpoints have been removed from the current level design. The level now focuses on continuous platforming challenges without checkpoint saves. Players must complete the entire level in one attempt.

#### Goal (src/entities/Goal.js)

**Extends**: `Phaser.Physics.Arcade.Sprite`

**Visual Features:**
- Trick-or-treat bag (orange)
- Jack-o-lantern face on bag
- Pulsing glow effects (purple and green)
- Swirling particles
- Wobble animation

**Behavior:**
- Triggers victory on player overlap
- Animates player being sucked into bag
- Creates sparkle effect
- Transitions to VictoryScene

**Methods:**
- `createPortalVisuals()`: Generate candy bag texture
- `createAnimations()`: Set up glow, particles, and wobble

### 4. Data Layer

#### LevelData (src/data/levelData.js)

**Structure:**
```javascript
{
  platforms: [
    { x, y, width, height }  // Array of platform definitions
  ],
  playerStart: { x, y },     // Starting position
  goal: { x, y },            // Goal position
  checkpoints: [             // Checkpoint positions
    { x, y }
  ],
  enemies: [                 // Enemy definitions
    { x, y, patrolStart, patrolEnd }
  ],
  worldBounds: { width, height }
}
```

**Current Level:**
- World size: 8220x1080
- No checkpoints - continuous challenge
- 8 enemies with varied patrol routes
- 30+ platforms creating platforming challenges
- Ground divided into segments with varied gap sizes (small, medium, large, huge)
- 2 water areas marked for visual distinction
- Floating platforms over gaps requiring precise jumps or marshmallow transformation

### 5. Input System

**Keyboard Controls:**
- Arrow keys: Movement and jump
- WASD: Alternative movement and jump
- Spacebar: Jump
- M: Return to menu (in end scenes)

**Input Handling:**
- Created in GameScene using `this.input.keyboard`
- Polled every frame in player update
- Uses `JustDown()` for jump to prevent holding
- Jump buffering system for responsive feel

### 6. Camera System

**Configuration:**
- Follows player with smooth lerp (0.1 factor)
- Bounded to world dimensions
- Zoom: 1.0 (no zoom)
- Mode: WIDTH_CONTROLS_HEIGHT for responsive scaling

**Behavior:**
- Centers on player at game start
- Smoothly follows horizontal and vertical movement
- Never shows areas outside world bounds
- UI elements use `setScrollFactor(0)` to stay fixed

### 7. Lives System

**Note**: The lives system has been removed from the current implementation. Players now have unlimited attempts, with instant respawn at the start position when falling off the world or hitting enemies. This creates a more forgiving, exploration-focused experience where players can experiment with the marshmallow transformation mechanic without penalty.

### 8. Collision System

**Collision Pairs:**
- Player ↔ Platforms: Collider (blocks movement)
- Player ↔ Enemies: Overlap (triggers instant respawn)
- Player ↔ Goal: Overlap (triggers `reachGoal`)

**Physics Groups:**
- Platforms: Static group (no physics updates)
- Enemies: Dynamic group (updated each frame)
- Goal: Single sprite with overlap detection

## Design Patterns

### 1. Entity Component Pattern
Each game object (Player, Enemy, Checkpoint, Goal) is a self-contained entity with:
- Visual representation (texture generation)
- Physics body
- Behavior logic (update methods)
- State management

### 2. Scene Management Pattern
Phaser's built-in scene system provides:
- Clear separation of game states
- Data passing between scenes
- Scene lifecycle methods (preload, create, update, shutdown)

### 3. Configuration Object Pattern
Centralized configuration in `config.js`:
- Single source of truth for constants
- Easy tuning of physics values
- Consistent settings across game

### 4. Static Factory Methods
Texture generation uses static methods:
- `Enemy.createBatTexture(scene)`
- Textures created once and reused
- Prevents duplicate texture generation

### 5. Object Pooling (Implicit)
Phaser's group system provides implicit pooling:
- Groups manage multiple similar objects
- Efficient iteration and collision detection

## Performance Considerations

### Optimizations
1. **Static Physics Bodies**: Platforms use static bodies (no physics calculations)
2. **Texture Caching**: Textures generated once and reused
3. **Efficient Collision**: Physics groups for batch collision detection
4. **Fixed UI**: UI elements don't scroll with camera
5. **Conditional Updates**: Enemies only update when in scene
6. **Tween Reuse**: Tweens for animations instead of manual updates

### Rendering
- WebGL renderer for hardware acceleration
- Automatic Canvas fallback for compatibility
- Depth sorting for proper layering
- Alpha blending for glow effects

### Memory Management
- Textures destroyed after generation
- Particles destroyed after animation
- Scene cleanup in shutdown methods
- No memory leaks from event listeners

## Data Flow

### Game Start Flow
```
index.html loads
  → src/main.js imports src/game.js
    → Game instance created with config
      → BootScene.preload()
        → BootScene.create()
          → MenuScene.create()
            → [User presses SPACE]
              → GameScene.create()
                → Game loop begins
```

### Gameplay Loop
```
GameScene.update() [60 FPS]
  → Player.update(cursors, keys)
    → Apply input to physics
    → Update grounded state
    → Check jump buffer
    → Update roll animation
    → Update shine position
  → Enemy.update() for each enemy
    → Patrol movement
    → Bobbing animation
  → Check fall-off condition
  → Physics engine resolves collisions
  → Render frame
```

### Death and Respawn Flow
```
Player touches enemy OR falls off world
  → Instant respawn at start position
  → No lives system
  → No game over
  → Encourages experimentation with marshmallow form
```

### Victory Flow
```
Player overlaps goal
  → reachGoal()
    → Set goalReached flag
    → Disable player controls
    → Tween player to goal position
      → Scale down player
        → Fade out player
          → Sparkle particles
            → Wait 0.8s
              → Transition to VictoryScene
                → Display time
                → Save best time to localStorage
```

## Extension Points

### Adding New Levels
1. Create new level data object in `src/data/`
2. Define platforms, enemies, checkpoints, goal
3. Pass to GameScene or create new scene

### Adding New Enemy Types
1. Create new class extending `Phaser.Physics.Arcade.Sprite`
2. Implement `update()` method with behavior
3. Add to `levelData.enemies` with type property
4. Handle in GameScene enemy creation

### Adding Power-ups or Collectibles
1. Create power-up entity class
2. Add to level data
3. Create overlap detection in GameScene
4. Implement effect on player
5. Consider using object pooling for many collectibles

### Adding New Mechanics
1. Add properties to Player class
2. Implement logic in Player.update()
3. Add UI elements if needed
4. Update controls documentation
5. Example: Marshmallow transformation demonstrates form-switching mechanic pattern

## Testing Strategy

### Manual Testing Checklist
- [ ] Player movement feels responsive in both forms
- [ ] Marshmallow transformation works with E key
- [ ] Marshmallow floats slowly when falling
- [ ] Marshmallow cannot jump
- [ ] Jump buffering works correctly in candy form
- [ ] Enemies patrol correctly
- [ ] Goal triggers victory
- [ ] Fall-off triggers instant respawn
- [ ] Enemy collision triggers instant respawn
- [ ] Camera follows smoothly
- [ ] Scene transitions work
- [ ] Best time saves correctly
- [ ] Shine sprite points toward moon (candy form only)
- [ ] Transformation particle effects display correctly

### Performance Testing
- Monitor FPS in browser dev tools
- Check for memory leaks (heap snapshots)
- Test on different screen sizes
- Verify physics stability at 60 FPS

### Browser Testing
- Chrome/Edge (WebGL)
- Firefox (WebGL)
- Safari (WebGL)
- Fallback to Canvas if needed
