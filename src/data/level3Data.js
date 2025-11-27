export const Level3Data = {
    platforms: [
        // GROUND SEGMENTS - Level 3: Redesigned with proper gaps
        // Starting ground
        { x: 350, y: 1044, width: 700, height: 72 },
        
        // Ground segment 1 (after small gap - 350 units)
        { x: 1225, y: 1044, width: 550, height: 72 },
        
        // Ground segment 2 (after medium gap - 520 units)
        { x: 2295, y: 1044, width: 500, height: 72 },
        
        // Ground segment 3 (after large water gap - 750 units)
        { x: 3545, y: 1044, width: 600, height: 72 },
        
        // Ground segment 4 (after medium gap - 480 units)
        { x: 4625, y: 1044, width: 550, height: 72 },
        
        // Ground segment 5 (after large gap - 680 units)
        { x: 5855, y: 1044, width: 500, height: 72 },
        
        // Ground segment 6 (after huge water gap - 850 units)
        { x: 7205, y: 1044, width: 650, height: 72 },
        
        // Final ground segment (after small gap - 380 units)
        { x: 8235, y: 1044, width: 700, height: 72 },
        
        // FLOATING PLATFORMS - SMALL GAP 1 (350 units)
        { x: 850, y: 900, width: 150, height: 48 },
        { x: 1020, y: 850, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - MEDIUM GAP 2 (520 units)
        { x: 1680, y: 880, width: 150, height: 48 },
        { x: 1840, y: 820, width: 140, height: 48 },
        { x: 2000, y: 860, width: 160, height: 48 },
        { x: 2160, y: 900, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - LARGE WATER GAP 3 - REMOVED (water crossing)
        
        // FLOATING PLATFORMS - MEDIUM GAP 4 (480 units)
        { x: 4110, y: 870, width: 150, height: 48 },
        { x: 4270, y: 810, width: 140, height: 48 },
        { x: 4430, y: 870, width: 150, height: 48 },
        
        // FLOATING PLATFORMS - LARGE GAP 5 (680 units)
        { x: 5280, y: 860, width: 150, height: 48 },
        { x: 5440, y: 780, width: 140, height: 48 },
        { x: 5600, y: 700, width: 160, height: 48 },
        { x: 5760, y: 820, width: 150, height: 48 },
        
        // FLOATING PLATFORMS - HUGE WATER GAP 6 - REMOVED (water crossing)
        
        // FLOATING PLATFORMS - SMALL GAP 7 (380 units)
        { x: 7720, y: 900, width: 150, height: 48 },
    ],
    playerStart: { x: 240, y: 900 },
    goal: { x: 8450, y: 950 },
    checkpoints: [],
    enemies: [
        // Enemy on ground segment 1
        { x: 1350, y: 900, patrolStart: 1225, patrolEnd: 1625 },
        // Enemy on floating platform in medium gap
        { x: 1840, y: 740, patrolStart: 1760, patrolEnd: 1920 },
        // Enemy on ground segment 2
        { x: 2420, y: 900, patrolStart: 2295, patrolEnd: 2645 },
        // Enemy on ground segment 3
        { x: 3700, y: 900, patrolStart: 3545, patrolEnd: 3945 },
        // Enemy on ground segment 4
        { x: 4780, y: 900, patrolStart: 4625, patrolEnd: 5025 },
        // Enemy on floating platform in large gap
        { x: 5600, y: 620, patrolStart: 5520, patrolEnd: 5680 },
        // Enemy on ground segment 5
        { x: 6000, y: 900, patrolStart: 5855, patrolEnd: 6205 },
        // Enemy on ground segment 6
        { x: 7380, y: 900, patrolStart: 7205, patrolEnd: 7605 },
        // Enemy on final ground
        { x: 8400, y: 900, patrolStart: 8235, patrolEnd: 8635 }
    ],
    waterAreas: [
        // First water section - fills gap between segments 2 and 3
        // Segment 2: x=2295, width=500 → right edge at 2545
        // Segment 3: x=3545, width=600 → left edge at 3245
        // Gap: 2545 to 3245 = 700 units
        { x: 2895, y: 1044, width: 700, height: 48 },
        // Second water section - fills gap between segments 5 and 6
        // Segment 5: x=5855, width=500 → right edge at 6105
        // Segment 6: x=7205, width=650 → left edge at 6880
        // Gap: 6105 to 6880 = 775 units
        { x: 6492.5, y: 1044, width: 775, height: 48 }
    ],
    worldBounds: { width: 8585, height: 1080 }
};
