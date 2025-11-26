# Game Architecture

## Overview

Haunted Pumpkin is a 2D physics-based platformer built with Phaser 3. The architecture follows a scene-based structure with clear separation between game logic, rendering, and state management. The game uses Arcade Physics for collision detection and movement, with custom entity classes extending Phaser's built-in types.

The game features a unique triple-form transformation system where the player can switch between three distinct forms:
- **Candy Ball**: Standard platforming with normal physics (480 max speed, -960 jump velocity)
- **Marshmallow**: Buoyant floating with realistic water physics (240 max speed, cannot jump, floats on water)
- **Jelly**: Bouncy movement with auto-hops and fast-fall mechanics (280 max speed, -1300 jump velocity, auto-hops every 800ms)

Each form has unique physics properties, procedurally generated textures, visual appearance, and death animations, enabling creative level design with varied gap sizes (280-980 units) and water crossings (850 and 560 unit water areas).

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

#### RespawnScene (src/scenes/RespawnScene.js)
- **Purpose**: Display encouraging message during respawn
- **Features**:
  - Cheering chibi character (3 variations based on lives lost)
  - Encouraging messages that change with each death
  - Lives remaining display
  - Bouncing animation on chibi
  - 2.5 second display before respawn
- **Lifecycle**: Pauses GameScene, displays message, resumes GameScene
- **Assets**: Uses pre-loaded chibi images from public/cheer-chibi/

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
- Jelly form with translucent green appearance and glossy highlights
- Dynamic shine sprite that points toward moon (hidden in marshmallow form)
- Rolling animation based on velocity (form-specific speed)
- Glow outline effect
- Transformation particle effects (sparkles for candy, puffs for marshmallow, green particles for jelly)
- Form-specific death animations

**Physics Properties:**
```javascript
{
  radius: 48,
  
  // Candy Ball (default)
  maxSpeed: 480,
  acceleration: 1440,
  jumpVelocity: -960,
  
  // Marshmallow Form
  marshmallowMaxSpeed: 240,        // Half speed
  marshmallowAcceleration: 720,    // Half acceleration
  buoyancyForce: -400,             // Upward force when falling
  
  // Jelly Form
  jellyMaxSpeed: 280,              // Slow horizontal
  jellyAcceleration: 840,          // Moderate acceleration
  jellyJumpVelocity: -1300,        // Very high jumps
  jellyIdleHopVelocity: -500,      // Automatic small hops
  jellyBounce: 0.5,                // Bouncy physics
  jellyHopInterval: 800ms,         // Auto-hop frequency
  
  // Universal
  friction: 720,
  jumpBufferWindow: 150ms,
  
  // Water Physics (marshmallow only)
  waterBobSpeed: 0.02,             // Gentle bobbing
  waterDrag: 180+,                 // Increases with speed
}
```

**Key Methods:**
- `createVisuals()`: Generates candy ball texture with stripes and glow
- `createMarshmallowTexture()`: Generates marshmallow texture with pillowy appearance
- `createJellyTexture()`: Generates translucent jelly texture with glossy highlights
- `createShine()`: Creates separate shine sprite
- `update(cursors, keys)`: Main update loop for input and movement
- `transformTo(form)`: Switch between forms ('candy', 'marshmallow', 'jelly') with particle effects
- `toggleMarshmallow()`: Toggle marshmallow form (E key)
- `toggleJelly()`: Toggle jelly form (Q key)
- `moveLeft()` / `moveRight()`: Apply horizontal acceleration (speed varies by form)
- `applyFriction()`: Smooth deceleration when no input
- `applyBuoyancy()`: Apply upward force when falling in marshmallow form
- `applyJellyFloat()`: Reduced gravity for floaty jelly physics
- `applyJellyFastFall()`: Strong downward force when fast-falling
- `updateJellyIdleHop()`: Automatic small hops when grounded in jelly form
- `jump()`: Apply jump velocity with buffering (form-specific behavior)
- `checkGrounded()`: Update grounded state and handle buffered jumps
- `onLanding()`: Handle landing animations (squish for jelly)
- `updateRoll()`: Rotate ball based on velocity (form-specific speed)
- `updateShinePosition()`: Position shine toward moon (hidden in marshmallow form)

**Jump Buffering:**
If jump is pressed while airborne, it's buffered for 150ms. If the player lands within that window, the jump executes immediately, creating responsive controls.

**Jelly Fast-Fall:**
In jelly form, pressing jump while airborne triggers fast-fall mode. The jelly drops quickly to the ground, and if jump is buffered, it executes immediately on landing for quick bounces.

**Water Physics (Marshmallow):**
When marshmallow enters water, realistic physics apply:
- Entry splash based on velocity
- Dip and recovery animation
- Gentle sinusoidal bobbing (6 pixel amplitude)
- Movement creates turbulence (faster bobbing)
- Can climb out at water edges with upward boost
- Increased drag for realistic resistance

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

#### Crow (src/entities/Crow.js)

**Extends**: `Phaser.GameObjects.Sprite`

**Visual Features:**
- Black silhouette with animated wings
- Two-frame wing flapping animation (200ms per frame)
- Procedurally generated texture with body, head, beak, wings, tail
- Depth: -50 (behind all gameplay elements)

**Behavior:**
- Flies horizontally across the screen
- Random speed (100-200 pixels/second)
- Spawns from either side of the world
- Destroys itself when off-screen
- New crows spawn every 8 seconds

**Properties:**
```javascript
{
  direction: 1 or -1,  // Flight direction
  speed: 100-200,      // Horizontal velocity
  wingFrame: 0 or 1,   // Current animation frame
  wingAnimTime: number // Animation timer
}
```

**Methods:**
- `createCrowTextures(scene)`: Static method to generate two animation frames
- `createCrowFrame(scene, textureName, wingPosition)`: Generate single frame texture
- `update(delta)`: Move horizontally and animate wings

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
- No checkpoints - continuous challenge (3 lives system)
- 6 enemies with varied patrol routes
- 20+ platforms creating platforming challenges
- Ground divided into segments with varied gap sizes:
  - Small gap: 280 units (easy jump)
  - Medium gap: 520 units (requires marshmallow or precise platforming)
  - Large gap: 850 units (marshmallow recommended)
  - Huge gap: 980 units (marshmallow or jelly required)
- 2 water areas (850 and 560 units wide) requiring marshmallow form
- Floating platforms over gaps offering risky alternatives
- Strategic enemy placement forces form switching decisions

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

**Implementation**: Players start with 3 lives displayed as hearts in the top-left corner.

**Death Triggers:**
- Falling below world boundary (y > 1080)
- Collision with enemy bats

**Death Flow:**
1. Life counter decrements
2. Form-specific death animation plays:
   - **Candy**: Breaks into colored particles
   - **Marshmallow**: Burns dark, crumbles into ash with smoke
   - **Jelly**: Splats and dissolves
3. Spooky ghost marker floats up
4. Death screen displays with lives remaining
5. Player respawns at start position in candy form
6. If lives reach 0, transition to GameOverScene

**Respawn:**
- Instant respawn at start position (no checkpoints in current level)
- Always respawn in candy form
- Full control restored immediately
- Camera resumes following

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
  → handleDeath()
    → Decrement lives counter (4 → 3 → 2 → 1 → 0)
    → Disable player controls (isDead = true)
    → Camera flash effect (300ms red flash)
    → Play form-specific death animation:
      - candyBreak(): Particle explosion (12 particles)
      - marshmallowExpire(): Burn dark → crumble into ash with smoke
      - jellyDeath(): Splat and dissolve (15 green particles)
    → Create floating ghost marker (fades in, floats up, fades out)
    → If lives > 0:
      → Wait 1000ms
      → Pause GameScene
      → Launch RespawnScene (overlay)
        → Show cheering chibi (3 variations based on lives lost)
        → Display encouraging message
        → Show lives remaining
        → Wait 2500ms
        → Call GameScene.respawnPlayer()
          → Reset position to start (no checkpoints in current level)
          → Transform to candy form
          → Restore controls (isDead = false)
          → Resume camera following
        → Stop RespawnScene
        → Resume GameScene
    → If lives == 0:
      → Wait 1000ms
      → Transition to GameOverScene
        → Show crying kids with tears
        → Display "NO CANDY!" message
        → Show restart and menu options
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
- [ ] Player movement feels responsive in all three forms
- [ ] Marshmallow transformation works with E key
- [ ] Jelly transformation works with Q key
- [ ] Marshmallow floats slowly when falling
- [ ] Marshmallow cannot jump
- [ ] Jelly auto-hops when idle
- [ ] Jelly fast-fall works (jump in air)
- [ ] Jelly has high jumps and bouncy landing
- [ ] Water physics work correctly (marshmallow only)
- [ ] Water entry creates splash
- [ ] Marshmallow bobs on water surface
- [ ] Can climb out of water at edges
- [ ] Jump buffering works correctly
- [ ] Enemies patrol correctly
- [ ] Goal triggers victory
- [ ] Fall-off triggers death and respawn
- [ ] Enemy collision triggers death and respawn
- [ ] Lives system works (3 lives, game over at 0)
- [ ] Form-specific death animations play
- [ ] Camera follows smoothly
- [ ] Scene transitions work
- [ ] Best time saves correctly
- [ ] Shine sprite points toward moon (candy and jelly only)
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
