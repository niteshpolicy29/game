# Design Document

## Introduction

This document provides the technical design for a 2D ball platformer game built with Phaser 3. The design focuses on creating smooth physics-based movement, responsive controls, and a clean minimal aesthetic. The architecture follows Phaser's scene-based structure with proper separation of concerns between game logic, rendering, and state management.

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     Phaser Game Instance                     │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Boot Scene   │→ │ Menu Scene   │→ │ Game Scene   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│         ↓                  ↓                  ↓             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Asset Loader & Preloader                  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Arcade Physics Engine (Phaser)               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Player Ball  │  │ Platform     │  │ Goal Marker  │     │
│  │ Entity       │  │ Manager      │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Input Handler & Camera Controller            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Scene Structure

**BootScene**: Handles initial asset loading and Phaser configuration
**MenuScene**: Displays start screen with play button
**GameScene**: Main gameplay scene with player, platforms, and game logic
**GameOverScene**: Shows game over or victory screen with restart option

## Detailed Design

### 1. Player Ball Entity

**Purpose**: Represents the player-controlled ball character with physics-based movement

**Properties**:
```javascript
{
  sprite: Phaser.Physics.Arcade.Sprite,
  maxSpeed: 200,              // Maximum horizontal velocity
  acceleration: 600,          // Horizontal acceleration rate
  drag: 400,                  // Deceleration when no input
  jumpVelocity: -400,         // Initial jump impulse
  gravity: 800,               // Downward acceleration
  isGrounded: boolean,        // Whether ball is on platform
  canDoubleJump: boolean,     // Double jump availability
  hasUsedDoubleJump: boolean  // Double jump state
}
```

**Methods**:
- `create(scene, x, y)`: Initialize ball sprite with physics body
- `update(cursors, keys)`: Handle input and update movement
- `jump()`: Apply jump velocity if grounded or double jump available
- `moveLeft()`: Apply leftward acceleration
- `moveRight()`: Apply rightward acceleration
- `applyDeceleration()`: Reduce horizontal velocity when no input
- `checkGrounded()`: Update grounded state based on physics body

**Correctness Properties**:
- P1.1: Horizontal velocity SHALL NOT exceed maxSpeed in either direction
- P1.2: Acceleration SHALL be applied only when movement keys are pressed
- P1.3: Deceleration SHALL reduce velocity toward zero when no keys pressed
- P1.4: Jump SHALL only occur when isGrounded is true OR canDoubleJump is true
- P1.5: Double jump SHALL set hasUsedDoubleJump to true and canDoubleJump to false
- P1.6: Landing on platform SHALL reset hasUsedDoubleJump to false

### 2. Platform System

**Purpose**: Manages static and dynamic platforms for collision and level layout

**Properties**:
```javascript
{
  platforms: Phaser.Physics.Arcade.StaticGroup,
  platformData: Array<{x, y, width, height, color}>,
  ground: Phaser.Physics.Arcade.Sprite
}
```

**Methods**:
- `createPlatforms(scene, levelData)`: Generate platforms from level configuration
- `createGround(scene)`: Create bottom boundary platform
- `setupCollisions(player)`: Configure collision between player and platforms

**Correctness Properties**:
- P3.1: Platforms SHALL have static physics bodies that don't move
- P3.2: Collision SHALL prevent player from passing through platforms
- P3.3: Ground SHALL span entire bottom of game world
- P3.4: Platform collision SHALL resolve in single frame without tunneling

### 3. Input Handler

**Purpose**: Processes keyboard and touch input for player control

**Properties**:
```javascript
{
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  wasd: {W, A, S, D},
  spaceKey: Phaser.Input.Keyboard.Key
}
```

**Methods**:
- `setupInput(scene)`: Initialize keyboard listeners
- `getHorizontalInput()`: Returns -1 (left), 0 (none), or 1 (right)
- `isJumpPressed()`: Returns true if jump key pressed this frame

**Correctness Properties**:
- P1.1: Left arrow OR 'A' key SHALL trigger leftward movement
- P1.2: Right arrow OR 'D' key SHALL trigger rightward movement
- P1.3: Spacebar OR up arrow SHALL trigger jump action
- P1.4: Input SHALL be polled every frame in update loop

### 4. Camera Controller

**Purpose**: Manages camera following and world boundaries

**Properties**:
```javascript
{
  camera: Phaser.Cameras.Scene2D.Camera,
  followMode: 'smooth' | 'fixed',
  worldBounds: {x, y, width, height},
  smoothFactor: 0.1
}
```

**Methods**:
- `setupCamera(scene, player)`: Configure camera to follow player
- `setBounds(x, y, width, height)`: Set world boundary limits
- `update()`: Apply smooth following if enabled

**Correctness Properties**:
- P5.1: Camera SHALL follow player horizontally with optional smoothing
- P5.2: Camera SHALL NOT show areas outside world boundaries
- P5.3: Player SHALL remain visible within viewport at all times
- P5.4: Camera SHALL center on player at game start

### 5. Physics Configuration

**Purpose**: Configure Phaser Arcade Physics for desired game feel

**Configuration**:
```javascript
{
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false,
      fps: 60
    }
  }
}
```

**Correctness Properties**:
- P8.1: Gravity constant SHALL create light, floaty feel
- P8.2: Jump trajectory SHALL form smooth parabolic arc
- P8.3: Horizontal acceleration SHALL create responsive movement
- P8.4: Physics SHALL update at 60 FPS target rate
- P9.4: Arcade Physics engine SHALL be used for all physics calculations

### 6. Scene Management

**Purpose**: Handle transitions between game states

**Scene Flow**:
```
Boot → Menu → Game → GameOver
         ↑            ↓
         └────────────┘
```

**Methods**:
- `startGame()`: Transition from Menu to Game scene
- `gameOver()`: Transition from Game to GameOver scene
- `restart()`: Reset Game scene and restart gameplay
- `victory()`: Transition to victory screen

**Correctness Properties**:
- P7.1: Game SHALL display start screen on application load
- P7.2: Start action SHALL transition to gameplay state
- P7.3: Falling below world boundary SHALL trigger game over
- P7.4: Game over screen SHALL show restart option
- P7.5: Restart SHALL reset level and return to gameplay

### 7. Goal System

**Purpose**: Detect level completion and trigger victory state

**Properties**:
```javascript
{
  goalMarker: Phaser.GameObjects.Sprite,
  position: {x, y},
  completionTime: number,
  score: number
}
```

**Methods**:
- `createGoal(scene, x, y)`: Place goal marker at level end
- `checkCompletion(player)`: Detect player-goal collision
- `triggerVictory()`: Handle level completion

**Correctness Properties**:
- P6.1: Goal marker SHALL be placed at defined position
- P6.2: Player-goal collision SHALL trigger level completion
- P6.3: Victory screen SHALL display score and completion time
- P6.4: Completion status SHALL be saved

### 8. Visual Rendering

**Purpose**: Render game objects with minimal aesthetic style

**Visual Elements**:
- Background: Solid color (#2c3e50 or similar)
- Player Ball: Circular sprite with glow effect (#3498db)
- Platforms: Rectangular shapes with solid colors (#ecf0f1)
- Goal: Distinct marker sprite (#2ecc71)
- Optional: Soft shadow beneath player ball

**Correctness Properties**:
- P4.1: Background SHALL be solid color
- P4.2: Player ball SHALL be circular with solid color or glow
- P4.3: Platforms SHALL be rectangular with solid colors
- P4.4: Shadow SHALL optionally appear beneath player ball
- P4.5: Visual style SHALL be consistent and minimal

### 9. Game Configuration

**Purpose**: Central configuration for game constants and settings

**Configuration Object**:
```javascript
const GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#2c3e50',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 800 },
      debug: false
    }
  },
  scene: [BootScene, MenuScene, GameScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}
```

**Correctness Properties**:
- P9.1: Phaser SHALL use WebGL with Canvas fallback
- P9.2: Game SHALL target 60 FPS
- P9.3: Canvas SHALL scale appropriately on window resize
- P9.5: Assets SHALL preload before gameplay starts

## Data Structures

### Level Data Format
```javascript
{
  platforms: [
    { x: 400, y: 550, width: 800, height: 50 },  // Ground
    { x: 200, y: 400, width: 200, height: 20 },
    { x: 600, y: 300, width: 150, height: 20 }
  ],
  playerStart: { x: 100, y: 100 },
  goal: { x: 750, y: 250 },
  worldBounds: { width: 800, height: 600 }
}
```

### Game State
```javascript
{
  currentScene: string,
  score: number,
  completionTime: number,
  isGameOver: boolean,
  isVictory: boolean
}
```

## Implementation Notes

### Physics Tuning
- Gravity: 800 (light, floaty feel)
- Jump velocity: -400 (moderate jump height)
- Max speed: 200 (responsive but controlled)
- Acceleration: 600 (quick response to input)
- Drag: 400 (smooth deceleration)

### Performance Considerations
- Use static physics bodies for platforms (no unnecessary calculations)
- Limit number of active physics bodies
- Use object pooling if adding collectibles or particles
- Optimize collision detection with proper physics groups

### Browser Compatibility
- WebGL renderer with automatic Canvas fallback
- Responsive scaling for different screen sizes
- Touch input support for mobile devices (future enhancement)

## Testing Strategy

### Unit Testing Focus
- Player movement calculations
- Jump mechanics and double jump logic
- Collision detection accuracy
- Camera boundary constraints

### Integration Testing
- Scene transitions
- Input handling across scenes
- Physics interactions
- Goal detection and victory flow

### Manual Testing
- Game feel and responsiveness
- Visual consistency
- Performance on target devices
- Edge cases (falling off world, rapid input)

## Future Enhancements

- Collectible items (coins, power-ups)
- Multiple levels with progression
- Moving platforms
- Enemy obstacles
- Particle effects
- Mobile touch controls
- Leaderboard system
