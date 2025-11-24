export const LevelData = {
    platforms: [
        // GROUND SEGMENTS with VARIED gap sizes
        // Starting ground
        { x: 350, y: 1044, width: 700, height: 72 },
        
        // Ground segment 1 (after SMALL gap - 280 units)
        { x: 1330, y: 1044, width: 480, height: 72 },
        
        // Ground segment 2 (after MEDIUM gap - 520 units)
        { x: 2330, y: 1044, width: 620, height: 72 },
        
        // Ground segment 3 (after LARGE water gap - 850 units)
        { x: 3800, y: 1044, width: 550, height: 72 },
        
        // Ground segment 4 (after TINY gap - 180 units)
        { x: 4530, y: 1044, width: 700, height: 72 },
        
        // Ground segment 5 (after HUGE gap - 980 units)
        { x: 6210, y: 1044, width: 450, height: 72 },
        
        // Final ground segment (after LARGE water gap - 760 units)
        { x: 7420, y: 1044, width: 800, height: 72 },
        
        // FLOATING PLATFORMS - SMALL GAP 1 (x: 700 to x: 1050) - 280 units
        { x: 850, y: 880, width: 160, height: 48 },
        { x: 1050, y: 820, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - MEDIUM GAP 2 (x: 1810 to x: 2110) - 520 units
        { x: 1920, y: 850, width: 180, height: 48 },
        { x: 2100, y: 760, width: 150, height: 48 },
        { x: 2280, y: 820, width: 170, height: 48 },
        { x: 2000, y: 680, width: 130, height: 48 },
        
        // FLOATING PLATFORMS - LARGE WATER GAP 3 (x: 2950 to x: 3650) - 850 units
        { x: 3050, y: 800, width: 190, height: 48 },
        { x: 3280, y: 720, width: 160, height: 48 },
        { x: 3500, y: 650, width: 140, height: 48 },
        { x: 3150, y: 880, width: 170, height: 48 },
        { x: 3680, y: 780, width: 200, height: 48 },
        { x: 3400, y: 600, width: 150, height: 48 },
        
        // FLOATING PLATFORMS - TINY GAP 4 (x: 4350 to x: 4440) - 180 units
        { x: 4400, y: 850, width: 120, height: 48 },
        
        // FLOATING PLATFORMS - HUGE GAP 5 (x: 5230 to x: 6030) - 980 units
        { x: 5350, y: 820, width: 180, height: 48 },
        { x: 5580, y: 740, width: 160, height: 48 },
        { x: 5820, y: 680, width: 140, height: 48 },
        { x: 5450, y: 880, width: 170, height: 48 },
        { x: 5700, y: 600, width: 150, height: 48 },
        { x: 5950, y: 760, width: 190, height: 48 },
        { x: 6100, y: 850, width: 160, height: 48 },
        
        // FLOATING PLATFORMS - LARGE WATER GAP 6 (x: 6660 to x: 7180) - 760 units
        { x: 6750, y: 780, width: 180, height: 48 },
        { x: 6950, y: 700, width: 170, height: 48 },
        { x: 7150, y: 820, width: 160, height: 48 },
        { x: 6850, y: 650, width: 140, height: 48 },
        { x: 7300, y: 750, width: 190, height: 48 }
    ],
    playerStart: { x: 240, y: 900 },
    goal: { x: 7650, y: 850 },
    checkpoints: [],
    enemies: [
        // Enemy on ground segment 1
        { x: 1450, y: 900, patrolStart: 1280, patrolEnd: 1680 },
        // Enemy on floating platform in medium gap
        { x: 2100, y: 680, patrolStart: 2020, patrolEnd: 2180 },
        // Enemy on ground segment 2
        { x: 2550, y: 900, patrolStart: 2380, patrolEnd: 2820 },
        // Enemy on floating platform in water gap
        { x: 3400, y: 520, patrolStart: 3320, patrolEnd: 3480 },
        // Enemy on ground segment 4
        { x: 4800, y: 900, patrolStart: 4600, patrolEnd: 5100 },
        // Enemy on floating platform in huge gap
        { x: 5700, y: 520, patrolStart: 5620, patrolEnd: 5780 },
        // Enemy on ground segment 5
        { x: 6350, y: 900, patrolStart: 6250, patrolEnd: 6550 },
        // Enemy on floating platform in water gap 2
        { x: 6950, y: 620, patrolStart: 6870, patrolEnd: 7030 }
    ],
    waterAreas: [
        // First water section - large gap (850 units)
        { x: 3325, y: 900, width: 850, height: 200 },
        // Second water section - large gap (760 units)
        { x: 6920, y: 900, width: 760, height: 200 }
    ],
    worldBounds: { width: 8220, height: 1080 }
};
