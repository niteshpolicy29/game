export class PlatformManager {
    constructor(scene, levelData) {
        this.scene = scene;
        this.platforms = scene.physics.add.staticGroup();
        this.createPlatforms(levelData.platforms);
    }
    
    createPlatforms(platformData) {
        platformData.forEach((data, index) => {
            // Create a dark background rectangle first
            const bgRect = this.scene.add.rectangle(
                data.x,
                data.y,
                data.width,
                data.height,
                0x3d2817 // Dark brown background
            );
            this.scene.physics.add.existing(bgRect, true);
            this.platforms.add(bgRect);
            
            // Then add ground texture on top if available
            if (this.scene.textures.exists('ground-texture')) {
                const groundTexture = this.scene.add.tileSprite(
                    data.x,
                    data.y,
                    data.width,
                    data.height,
                    'ground-texture'
                );
                groundTexture.setDepth(bgRect.depth + 0.1);
            } else {
                console.warn('Ground texture not found, using solid color');
                // Add eerie purple glow outline to background
                bgRect.setStrokeStyle(4, 0x8b00ff, 0.6);
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
