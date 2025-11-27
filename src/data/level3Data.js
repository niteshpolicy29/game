export const Level3Data = {
    platforms: [
        // GROUND SEGMENTS - Level 3: More challenging gaps and water sections
        // Starting ground
        { x: 350, y: 1044, width: 550, height: 72 },
        
        // Ground segment 1 (after LARGE gap - 680 units)
        { x: 1305, y: 1044, width: 500, height: 72 },
        
        // Ground segment 2 (after HUGE gap - 920 units)
        { x: 2485, y: 1044, width: 450, height: 72 },
        
        // Ground segment 3 (after MASSIVE water gap - 1050 units)
        { x: 3985, y: 1044, width: 580, height: 72 },
        
        // Ground segment 4 (after MEDIUM gap - 520 units)
        { x: 5085, y: 1044, width: 600, height: 72 },
        
        // Ground segment 5 (after HUGE gap - 980 units)
        { x: 6665, y: 1044, width: 480, height: 72 },
        
        // Ground segment 6 (after LARGE water gap - 780 units)
        { x: 7925, y: 1044, width: 700, height: 72 },
        
        // Final ground segment (after SMALL gap - 380 units)
        { x: 9005, y: 1044, width: 650, height: 72 },
        
        // FLOATING PLATFORMS - LARGE GAP 1 (x: 625 to x: 1055) - 680 units
        { x: 750, y: 880, width: 160, height: 48 },
        { x: 920, y: 800, width: 150, height: 48 },
        { x: 1090, y: 860, width: 170, height: 48 },
        { x: 820, y: 720, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - HUGE GAP 2 (x: 1555 to x: 2260) - 920 units
        { x: 1680, y: 850, width: 160, height: 48 },
        { x: 1850, y: 760, width: 150, height: 48 },
        { x: 2020, y: 680, width: 140, height: 48 },
        { x: 2190, y: 780, width: 170, height: 48 },
        { x: 1950, y: 880, width: 160, height: 48 },
        { x: 2360, y: 840, width: 150, height: 48 },
        
        // FLOATING PLATFORMS - MASSIVE WATER GAP 3 - REMOVED (water crossing)
        
        // FLOATING PLATFORMS - MEDIUM GAP 4 (x: 4565 to x: 4825) - 520 units
        { x: 4680, y: 860, width: 150, height: 48 },
        { x: 4850, y: 780, width: 160, height: 48 },
        
        // FLOATING PLATFORMS - HUGE GAP 5 (x: 6385 to x: 6175) - 980 units
        { x: 6520, y: 840, width: 160, height: 48 },
        { x: 6690, y: 750, width: 150, height: 48 },
        { x: 6860, y: 670, width: 140, height: 48 },
        { x: 7030, y: 760, width: 170, height: 48 },
        { x: 6590, y: 920, width: 160, height: 48 },
        { x: 6760, y: 600, width: 150, height: 48 },
        { x: 6930, y: 840, width: 160, height: 48 },
        
        // FLOATING PLATFORMS - LARGE WATER GAP 6 - REMOVED (water crossing)
        
        // FLOATING PLATFORMS - SMALL GAP 7 (x: 8625 to x: 8815) - 380 units
        { x: 8720, y: 880, width: 150, height: 48 },
    ],
    playerStart: { x: 240, y: 900 },
    goal: { x: 9200, y: 850 },
    checkpoints: [],
    enemies: [
        // Enemy on ground segment 1
        { x: 1400, y: 900, patrolStart: 1305, patrolEnd: 1655 },
        // Enemy on floating platform in huge gap
        { x: 1850, y: 680, patrolStart: 1770, patrolEnd: 1930 },
        // Enemy on ground segment 2
        { x: 2600, y: 900, patrolStart: 2485, patrolEnd: 2785 },
        // Enemy on ground segment 3
        { x: 4200, y: 900, patrolStart: 3985, patrolEnd: 4415 },
        // Enemy on ground segment 4
        { x: 5300, y: 900, patrolStart: 5085, patrolEnd: 5535 },
        // Enemy on floating platform in huge gap 5
        { x: 6760, y: 520, patrolStart: 6680, patrolEnd: 6840 },
        // Another enemy in huge gap 5
        { x: 6930, y: 760, patrolStart: 6850, patrolEnd: 7010 },
        // Enemy on ground segment 6
        { x: 8100, y: 900, patrolStart: 7925, patrolEnd: 8325 },
        // Enemy on final ground
        { x: 9150, y: 900, patrolStart: 9005, patrolEnd: 9405 }
    ],
    waterAreas: [
        // First water section - fills gap between segments 2 and 3
        // Segment 2: x=2485, width=450 → right edge at 2710
        // Segment 3: x=3985, width=580 → left edge at 3695
        // Gap: 2710 to 3695 = 985 units
        { x: 3202.5, y: 1044, width: 985, height: 48 },
        // Second water section - fills gap between segments 6 and 7
        // Segment 6: x=7925, width=700 → right edge at 8275
        // Segment 7: x=9005, width=650 → left edge at 8680
        // Gap: 8275 to 8680 = 405 units
        { x: 8477.5, y: 1044, width: 405, height: 48 }
    ],
    worldBounds: { width: 9680, height: 1080 }
};
