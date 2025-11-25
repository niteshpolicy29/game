import Phaser from 'phaser';
import { GameConfig } from './config.js';
import { TutorialScene } from './scenes/TutorialScene.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { VictoryScene } from './scenes/VictoryScene.js';

// Initialize game configuration with scenes
const config = {
    ...GameConfig,
    scene: [TutorialScene, BootScene, MenuScene, GameScene, GameOverScene, VictoryScene]
};

// Create game instance
export const game = new Phaser.Game(config);
