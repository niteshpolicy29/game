import Phaser from 'phaser';

export const GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    parent: 'game-container',
    backgroundColor: '#0a0a0f',
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false,
        powerPreference: 'high-performance',
        mipmapFilter: 'LINEAR_MIPMAP_LINEAR'
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1920 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        parent: 'game-container'
    }
};

export const PhysicsConfig = {
    gravity: 1920,
    maxSpeed: 480,
    acceleration: 1440,
    drag: 960,
    jumpVelocity: -960
};
