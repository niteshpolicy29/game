export class PlatformManager {
    constructor(scene, levelData) {
        this.scene = scene;
        this.platforms = scene.physics.add.staticGroup();
        this.createPlatforms(levelData.platforms);
    }
    
    createPlatforms(platformData) {
        platformData.forEach((data, index) => {
            // Create solid background for visibility
            const bgPlatform = this.scene.add.rectangle(
                data.x,
                data.y,
                data.width,
                data.height,
                0x5c4033 // Medium brown dirt color
            );
            
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
                groundTexture.setOrigin(0.5, 0.5);
                groundTexture.setDepth(bgPlatform.depth + 0.1);
            } else {
                console.warn('Ground texture not found');
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
