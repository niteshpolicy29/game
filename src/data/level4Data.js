export const Level4Data = {
    platforms: [
        // GROUND SEGMENTS - Level 4: EXTREME challenge with massive gaps
        // Starting ground
        { x: 350, y: 1044, width: 500, height: 72 },
        
        // Ground segment 1 (after HUGE gap - 850 units)
        { x: 1450, y: 1044, width: 480, height: 72 },
        
        // Ground segment 2 (after MASSIVE gap - 1150 units)
        { x: 2855, y: 1044, width: 420, height: 72 },
        
        // Ground segment 3 (after EXTREME water gap - 1280 units)
        { x: 4555, y: 1044, width: 550, height: 72 },
        
        // Ground segment 4 (after LARGE gap - 720 units)
        { x: 5825, y: 1044, width: 580, height: 72 },
        
        // Ground segment 5 (after MASSIVE gap - 1200 units)
        { x: 7605, y: 1044, width: 460, height: 72 },
        
        // Ground segment 6 (after HUGE water gap - 950 units)
        { x: 9015, y: 1044, width: 620, height: 72 },
        
        // Final ground segment (after MEDIUM gap - 580 units)
        { x: 10215, y: 1044, width: 700, height: 72 },
        
        // FLOATING PLATFORMS - HUGE GAP 1 (x: 600 to x: 1210) - 850 units
        { x: 720, y: 860, width: 150, height: 48 },
        { x: 880, y: 780, width: 140, height: 48 },
        { x: 1040, y: 700, width: 160, height: 48 },
        { x: 1200, y: 820, width: 150, height: 48 },
        { x: 960, y: 880, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - MASSIVE GAP 2 (x: 1690 to x: 2645) - 1150 units
        { x: 1820, y: 840, width: 150, height: 48 },
        { x: 1980, y: 760, width: 140, height: 48 },
        { x: 2140, y: 680, width: 160, height: 48 },
        { x: 2300, y: 600, width: 140, height: 48 },
        { x: 2460, y: 720, width: 150, height: 48 },
        { x: 2620, y: 820, width: 160, height: 48 },
        { x: 2060, y: 880, width: 140, height: 48 },
        { x: 2220, y: 800, width: 150, height: 48 },
        
        // FLOATING PLATFORMS - EXTREME WATER GAP 3 - REMOVED (water crossing)
        
        // FLOATING PLATFORMS - LARGE GAP 4 (x: 5275 to x: 5545) - 720 units
        { x: 5380, y: 860, width: 150, height: 48 },
        { x: 5540, y: 780, width: 160, height: 48 },
        { x: 5700, y: 840, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - MASSIVE GAP 5 (x: 6115 to x: 7145) - 1200 units
        { x: 6240, y: 850, width: 150, height: 48 },
        { x: 6400, y: 770, width: 140, height: 48 },
        { x: 6560, y: 690, width: 160, height: 48 },
        { x: 6720, y: 610, width: 140, height: 48 },
        { x: 6880, y: 720, width: 150, height: 48 },
        { x: 7040, y: 820, width: 160, height: 48 },
        { x: 6480, y: 880, width: 140, height: 48 },
        { x: 6640, y: 800, width: 150, height: 48 },
        { x: 6800, y: 600, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - HUGE WATER GAP 6 - REMOVED (water crossing)
        
        // FLOATING PLATFORMS - MEDIUM GAP 7 (x: 9625 to x: 9925) - 580 units
        { x: 9740, y: 880, width: 150, height: 48 },
        { x: 9900, y: 800, width: 160, height: 48 },
    ],
    playerStart: { x: 240, y: 900 },
    goal: { x: 10450, y: 850 },
    checkpoints: [],
    enemies: [
        // Enemy on ground segment 1
        { x: 1550, y: 900, patrolStart: 1450, patrolEnd: 1790 },
        // Enemy on floating platform in massive gap
        { x: 1980, y: 680, patrolStart: 1900, patrolEnd: 2060 },
        // Another enemy in massive gap
        { x: 2300, y: 520, patrolStart: 2220, patrolEnd: 2380 },
        // Enemy on ground segment 2
        { x: 2950, y: 900, patrolStart: 2855, patrolEnd: 3135 },
        // Enemy on ground segment 3
        { x: 4700, y: 900, patrolStart: 4555, patrolEnd: 4955 },
        // Enemy on ground segment 4
        { x: 6000, y: 900, patrolStart: 5825, patrolEnd: 6225 },
        // Enemy on floating platform in massive gap 5
        { x: 6560, y: 610, patrolStart: 6480, patrolEnd: 6640 },
        // Another enemy in massive gap 5
        { x: 6880, y: 640, patrolStart: 6800, patrolEnd: 6960 },
        // Third enemy in massive gap 5
        { x: 7040, y: 740, patrolStart: 6960, patrolEnd: 7120 },
        // Enemy on ground segment 5
        { x: 7750, y: 900, patrolStart: 7605, patrolEnd: 7975 },
        // Enemy on ground segment 6
        { x: 9200, y: 900, patrolStart: 9015, patrolEnd: 9435 },
        // Enemy on final ground
        { x: 10350, y: 900, patrolStart: 10215, patrolEnd: 10615 }
    ],
    waterAreas: [
        // First water section - fills gap between segments 2 and 3
        // Segment 2: x=2855, width=420 → right edge at 3065
        // Segment 3: x=4555, width=550 → left edge at 4280
        // Gap: 3065 to 4280 = 1215 units
        { x: 3672.5, y: 1044, width: 1215, height: 48 },
        // Second water section - fills gap between segments 5 and 6
        // Segment 5: x=7605, width=460 → right edge at 7835
        // Segment 6: x=9015, width=620 → left edge at 8705
        // Gap: 7835 to 8705 = 870 units
        { x: 8270, y: 1044, width: 870, height: 48 }
    ],
    worldBounds: { width: 10915, height: 1080 }
};
