export const LevelData = {
    platforms: [
        { x: 3200, y: 1044, width: 6400, height: 72 },  // Extended ground
        // Section 1 (Start to Checkpoint 1)
        { x: 300, y: 900, width: 250, height: 48 },
        { x: 700, y: 780, width: 200, height: 48 },
        { x: 1050, y: 660, width: 180, height: 48 },
        { x: 1350, y: 540, width: 220, height: 48 },
        { x: 1700, y: 420, width: 200, height: 48 },
        // Section 2 (Checkpoint 1 to Checkpoint 2)
        { x: 2100, y: 540, width: 200, height: 48 },
        { x: 2450, y: 660, width: 180, height: 48 },
        { x: 2800, y: 540, width: 220, height: 48 },
        { x: 3150, y: 420, width: 180, height: 48 },
        { x: 3500, y: 300, width: 200, height: 48 },
        { x: 3850, y: 420, width: 180, height: 48 },
        // Section 3 (Checkpoint 2 to Checkpoint 3)
        { x: 4200, y: 540, width: 200, height: 48 },
        { x: 4550, y: 660, width: 180, height: 48 },
        { x: 4900, y: 540, width: 220, height: 48 },
        { x: 5250, y: 420, width: 180, height: 48 },
        { x: 5600, y: 300, width: 200, height: 48 },
        // Final section (Checkpoint 3 to Goal)
        { x: 5950, y: 420, width: 180, height: 48 },
        { x: 6300, y: 540, width: 200, height: 48 }
    ],
    playerStart: { x: 240, y: 180 },
    goal: { x: 6300, y: 350 },
    checkpoints: [
        { x: 2000, y: 400 },  // Checkpoint 1
        { x: 4000, y: 400 },  // Checkpoint 2
        { x: 5800, y: 250 }   // Checkpoint 3
    ],
    enemies: [
        // Section 1 enemies
        { x: 700, y: 700, patrolStart: 600, patrolEnd: 900 },
        { x: 1350, y: 460, patrolStart: 1250, patrolEnd: 1550 },
        // Section 2 enemies
        { x: 2450, y: 580, patrolStart: 2350, patrolEnd: 2650 },
        { x: 3150, y: 340, patrolStart: 3050, patrolEnd: 3300 },
        { x: 3850, y: 340, patrolStart: 3750, patrolEnd: 4000 },
        // Section 3 enemies
        { x: 4550, y: 580, patrolStart: 4450, patrolEnd: 4750 },
        { x: 5250, y: 340, patrolStart: 5150, patrolEnd: 5400 },
        // Final section enemies
        { x: 5950, y: 340, patrolStart: 5850, patrolEnd: 6100 }
    ],
    worldBounds: { width: 6400, height: 1080 }
};
