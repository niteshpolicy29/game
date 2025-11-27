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
                // Use the ground texture with grass and dirt
                platform = this.scene.add.tileSprite(
                    data.x,
                    data.y,
                    data.width,
                    data.height,
                    'ground-texture'
                );
                platform.setOrigin(0.5, 0.5);
            } else {
                console.warn('Ground texture not found, using fallback');
                // Fallback: brown rectangle
                platform = this.scene.add.rectangle(
                    data.x,
                    data.y,
                    data.width,
                    data.height,
                    0x4a3520
                );
                platform.setStrokeStyle(2, 0x2d1f14, 1);
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
