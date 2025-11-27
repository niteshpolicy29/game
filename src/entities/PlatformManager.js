export class PlatformManager {
    constructor(scene, levelData) {
        this.scene = scene;
        this.platforms = scene.physics.add.staticGroup();
        this.createPlatforms(levelData.platforms);
    }
    
    createPlatforms(platformData) {
        platformData.forEach((data, index) => {
            // Always create a visible background first
            const bgPlatform = this.scene.add.rectangle(
                data.x,
                data.y,
                data.width,
                data.height,
                0x4a3520 // Brown ground color
            );
            bgPlatform.setStrokeStyle(2, 0x2d1f14, 1);
            
            this.scene.physics.add.existing(bgPlatform, true);
            this.platforms.add(bgPlatform);
            
            // Add ground texture on top if available
            if (this.scene.textures.exists('ground-texture')) {
                const groundTexture = this.scene.add.tileSprite(
                    data.x,
                    data.y,
                    data.width,
                    data.height,
                    'ground-texture'
                );
                // Make sure texture is visible and at correct depth
                groundTexture.setDepth(bgPlatform.depth + 0.1);
                groundTexture.setAlpha(1);
            }
        });
    }
    
    setupCollisions(player) {
        this.scene.physics.add.collider(player, this.platforms);
    }
    
    getPlatforms() {
        return this.platforms;
    }
}
