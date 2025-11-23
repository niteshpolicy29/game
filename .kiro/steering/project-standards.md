# Project Development Standards

## Code Style and Structure

### JavaScript/Phaser Conventions
- Use ES6+ syntax (const/let, arrow functions, classes)
- Use meaningful variable and function names
- Keep functions small and focused (single responsibility)
- Add comments for complex game logic
- Use Phaser 3 best practices and lifecycle methods

### File Organization
- Separate scenes into individual files
- Keep game objects/entities in dedicated files
- Use a clear folder structure:
  - `/src` - Source code
  - `/assets` - Images, audio, sprites
  - `/scenes` - Game scenes
  - `/entities` - Game objects and entities
  - `/utils` - Helper functions

### Game Architecture
- Use Phaser's scene system properly
- Implement proper state management
- Keep game logic separate from rendering
- Use object pooling for frequently created/destroyed objects
- Implement proper cleanup in scene shutdown methods

## Performance Guidelines
- Optimize sprite atlases and textures
- Use texture atlases instead of individual images
- Implement object pooling for bullets, particles, etc.
- Avoid creating objects in update loops
- Use Phaser's built-in physics efficiently
- Profile and measure performance regularly

## Documentation Requirements
- Keep README.md updated with setup and run instructions
- Document game architecture and design decisions
- Track performance optimizations
- Maintain KIRO_IMPACT.md with development insights

## Git Practices
- Write clear, descriptive commit messages
- Commit working features incrementally
- Keep commits focused and atomic
