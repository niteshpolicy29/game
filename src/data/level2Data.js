export const Level2Data = {
    platforms: [
        // GROUND SEGMENTS with DIFFERENT gap sizes than level 1
        // Starting ground
        { x: 350, y: 1044, width: 600, height: 72 },
        
        // Ground segment 1 (after MEDIUM gap - 450 units)
        { x: 1250, y: 1044, width: 550, height: 72 },
        
        // Ground segment 2 (after LARGE gap - 720 units)
        { x: 2345, y: 1044, width: 480, height: 72 },
        
        // Ground segment 3 (after HUGE water gap - 950 units)
        { x: 3760, y: 1044, width: 620, height: 72 },
        
        // Ground segment 4 (after SMALL gap - 320 units)
        { x: 4700, y: 1044, width: 650, height: 72 },
        
        // Ground segment 5 (after MASSIVE gap - 1100 units)
        { x: 6450, y: 1044, width: 500, height: 72 },
        
        // Final ground segment (after MEDIUM water gap - 680 units)
        { x: 7630, y: 1044, width: 750, height: 72 },
        
        // FLOATING PLATFORMS - MEDIUM GAP 1 (x: 650 to x: 1000) - 450 units
        { x: 800, y: 900, width: 150, height: 48 },
        { x: 980, y: 820, width: 160, height: 48 },
        { x: 1150, y: 880, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - LARGE GAP 2 (x: 1525 to x: 2105) - 720 units
        { x: 1680, y: 850, width: 170, height: 48 },
        { x: 1880, y: 740, width: 150, height: 48 },
        { x: 2080, y: 820, width: 180, height: 48 },
        { x: 1780, y: 680, width: 140, height: 48 },
        { x: 2250, y: 900, width: 160, height: 48 },
        
        // FLOATING PLATFORMS - HUGE WATER GAP 3 - REMOVED (water crossing)
        
        // FLOATING PLATFORMS - SMALL GAP 4 (x: 4380 to x: 4540) - 320 units
        { x: 4460, y: 880, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - MASSIVE GAP 5 (x: 5350 to x: 6200) - 1100 units
        { x: 5480, y: 850, width: 170, height: 48 },
        { x: 5680, y: 760, width: 150, height: 48 },
        { x: 5880, y: 680, width: 160, height: 48 },
        { x: 6080, y: 740, width: 140, height: 48 },
        { x: 5580, y: 920, width: 180, height: 48 },
        { x: 5780, y: 600, width: 150, height: 48 },
        { x: 5980, y: 820, width: 170, height: 48 },
        { x: 6180, y: 880, width: 160, height: 48 },
        
        // FLOATING PLATFORMS - MEDIUM WATER GAP 6 - REMOVED (water crossing)
    ],
    playerStart: { x: 240, y: 900 },
    goal: { x: 7800, y: 850 },
    checkpoints: [],
    enemies: [
        // Enemy on ground segment 1
        { x: 1400, y: 900, patrolStart: 1250, patrolEnd: 1650 },
        // Enemy on floating platform in large gap
        { x: 1880, y: 660, patrolStart: 1800, patrolEnd: 1960 },
        // Enemy on ground segment 2
        { x: 2500, y: 900, patrolStart: 2350, patrolEnd: 2750 },
        // Enemy on ground segment 4
        { x: 4900, y: 900, patrolStart: 4750, patrolEnd: 5100 },
        // Enemy on floating platform in massive gap
        { x: 5780, y: 520, patrolStart: 5700, patrolEnd: 5860 },
        // Another enemy in massive gap
        { x: 6080, y: 660, patrolStart: 6000, patrolEnd: 6160 },
        // Enemy on ground segment 5
        { x: 6600, y: 900, patrolStart: 6500, patrolEnd: 6850 }
    ],
    waterAreas: [
        // First water section - fills gap between segments 2 and 3
        // Segment 2: x=2345, width=480 → right edge at 2585
        // Segment 3: x=3760, width=620 → left edge at 3450
        // Gap: 2585 to 3450 = 865 units
        { x: 3017.5, y: 1044, width: 865, height: 48 },
        // Second water section - fills gap between segments 5 and final
        // Segment 5: x=6450, width=500 → right edge at 6700
        // Final segment: x=7630, width=750 → left edge at 7255
        // Gap: 6700 to 7255 = 555 units
        { x: 6977.5, y: 1044, width: 555, height: 48 }
    ],
    worldBounds: { width: 8400, height: 1080 }
};
