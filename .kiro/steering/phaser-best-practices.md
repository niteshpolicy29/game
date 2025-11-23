# Phaser Game Development Best Practices

## Scene Management
- Use `this.scene.start()` to switch between scenes
- Properly clean up resources in `shutdown()` method
- Pass data between scenes using scene data parameter
- Use scene keys as constants to avoid typos

## Asset Loading
- Preload all assets in a dedicated Boot or Preload scene
- Use loading progress bars for better UX
- Organize assets with clear naming conventions
- Use sprite sheets and texture atlases for better performance

## Game Objects
- Extend Phaser classes for custom game objects
- Use Groups for managing similar objects
- Implement proper destroy methods to prevent memory leaks
- Use arcade physics for simple collision detection

## Input Handling
- Set up input handlers in `create()` method
- Use pointer events for touch/mouse input
- Implement keyboard controls with proper key bindings
- Handle both desktop and mobile input when applicable

## Update Loop Optimization
- Keep update() methods lightweight
- Use delta time for frame-independent movement
- Avoid heavy calculations in update loop
- Use events and signals instead of polling when possible

## Common Patterns
- Use configuration objects for game settings
- Implement state machines for complex behaviors
- Use tweens for smooth animations
- Leverage Phaser's built-in camera system
