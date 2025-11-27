export class PlatformManager {
    constructor(scene, levelData) {
        this.scene = scene;
        this.platforms = scene.physics.add.staticGroup();
        this.createPlatforms(levelData.platforms);
    }
    
    createPlatforms(platformData) {
        platformData.forEach((data, index) => {
            // Use ground texture if available, otherwise fallback to rectangle
            let platform;
            
            if (this.scene.textures.exists('ground-texture')) {
                // Create tiled sprite for ground texture
                platform = this.scene.add.tileSprite(
                    data.x,
                    data.y,
                    data.width,
                    data.height,
                    'ground-texture'
                );
            } else {
                // Fallback: Spooky dark wood platforms
                platform = this.scene.add.rectangle(
                    data.x, 
                    data.y, 
                    data.width, 
                    data.height, 
                    0x2d1b00 // Dark brown wood
                );
                
                // Add eerie purple glow outline
                platform.setStrokeStyle(4, 0x8b00ff, 0.6);
            }
            
            this.scene.physics.add.existing(platform, true);
            this.platforms.add(platform);
        });
    }
    
    setupCollisions(player) {
        this.scene.physics.add.collider(player, this.platforms);
    }
    
    getPlatforms() {
        return this.platforms;
    }
}
