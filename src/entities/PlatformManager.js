export class PlatformManager {
    constructor(scene, levelData) {
        this.scene = scene;
        this.platforms = scene.physics.add.staticGroup();
        this.createPlatforms(levelData.platforms);
    }
    
    createPlatforms(platformData) {
        platformData.forEach((data, index) => {
            let platform;
            
            if (this.scene.textures.exists('ground-texture')) {
                // Use ground texture directly
                platform = this.scene.add.tileSprite(
                    data.x,
                    data.y,
                    data.width,
                    data.height,
                    'ground-texture'
                );
            } else {
                console.warn('Ground texture not found, using fallback');
                // Fallback: dark brown rectangle
                platform = this.scene.add.rectangle(
                    data.x,
                    data.y,
                    data.width,
                    data.height,
                    0x3d2817
                );
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
