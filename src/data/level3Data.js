export const Level3Data = {
    platforms: [
        // GROUND SEGMENTS - Level 3: More challenging gaps and water sections
        // Starting ground
        { x: 350, y: 1044, width: 700, height: 72 },
        
        // Ground segment 1 (after MEDIUM gap - 480 units)
        { x: 1330, y: 1044, width: 500, height: 72 },
        
        // Ground segment 2 (after LARGE gap - 750 units)
        { x: 2455, y: 1044, width: 480, height: 72 },
        
        // Ground segment 3 (after HUGE water gap - 920 units)
        { x: 3855, y: 1044, width: 550, height: 72 },
        
        // Ground segment 4 (after MEDIUM gap - 520 units)
        { x: 4925, y: 1044, width: 600, height: 72 },
        
        // Ground segment 5 (after LARGE gap - 780 units)
        { x: 6205, y: 1044, width: 500, height: 72 },
        
        // Ground segment 6 (after HUGE water gap - 880 units)
        { x: 7585, y: 1044, width: 650, height: 72 },
        
        // Final ground segment (after SMALL gap - 380 units)
        { x: 8590, y: 1044, width: 700, height: 72 },
        
        // FLOATING PLATFORMS - MEDIUM GAP 1 (x: 700 to x: 1080) - 480 units
        { x: 820, y: 880, width: 160, height: 48 },
        { x: 990, y: 820, width: 150, height: 48 },
        { x: 1160, y: 880, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - LARGE GAP 2 (x: 1580 to x: 2215) - 750 units
        { x: 1700, y: 860, width: 150, height: 48 },
        { x: 1860, y: 780, width: 140, height: 48 },
        { x: 2020, y: 700, width: 160, height: 48 },
        { x: 2180, y: 800, width: 150, height: 48 },
        { x: 1940, y: 880, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - HUGE WATER GAP 3 - REMOVED (water crossing)
        
        // FLOATING PLATFORMS - MEDIUM GAP 4 (x: 4405 to x: 4625) - 520 units
        { x: 4500, y: 860, width: 150, height: 48 },
        { x: 4670, y: 800, width: 140, height: 48 },
        { x: 4840, y: 860, width: 160, height: 48 },
        
        // FLOATING PLATFORMS - LARGE GAP 5 (x: 5525 to x: 5955) - 780 units
        { x: 5640, y: 850, width: 150, height: 48 },
        { x: 5800, y: 770, width: 140, height: 48 },
        { x: 5960, y: 690, width: 160, height: 48 },
        { x: 6120, y: 800, width: 150, height: 48 },
        { x: 5880, y: 880, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - HUGE WATER GAP 6 - REMOVED (water crossing)
        
        // FLOATING PLATFORMS - SMALL GAP 7 (x: 8235 to x: 8265) - 380 units
        { x: 8350, y: 880, width: 150, height: 48 },
    ],
    playerStart: { x: 240, y: 900 },
    goal: { x: 8800, y: 850 },
    checkpoints: [],
    enemies: [
        // Enemy on ground segment 1
        { x: 1450, y: 900, patrolStart: 1330, patrolEnd: 1680 },
        // Enemy on floating platform in large gap
        { x: 1860, y: 700, patrolStart: 1780, patrolEnd: 1940 },
        // Enemy on ground segment 2
        { x: 2580, y: 900, patrolStart: 2455, patrolEnd: 2815 },
        // Enemy on ground segment 3
        { x: 4050, y: 900, patrolStart: 3855, patrolEnd: 4255 },
        // Enemy on ground segment 4
        { x: 5100, y: 900, patrolStart: 4925, patrolEnd: 5325 },
        // Enemy on floating platform in large gap 5
        { x: 5800, y: 690, patrolStart: 5720, patrolEnd: 5880 },
        // Enemy on ground segment 5
        { x: 6350, y: 900, patrolStart: 6205, patrolEnd: 6555 },
        // Enemy on ground segment 6
        { x: 7750, y: 900, patrolStart: 7585, patrolEnd: 7935 },
        // Enemy on final ground
        { x: 8750, y: 900, patrolStart: 8590, patrolEnd: 8940 }
    ],
    waterAreas: [
        // First water section - fills gap between starting ground and segment 1
        // Starting ground: x=350, width=700 → right edge at 700
        // Segment 1: x=1330, width=500 → left edge at 1080
        // Gap: 700 to 1080 = 380 units
        { x: 890, y: 1044, width: 380, height: 48 },
        // Second water section - fills gap between segments 2 and 3
        // Segment 2: x=2455, width=480 → right edge at 2695
        // Segment 3: x=3855, width=550 → left edge at 3580
        // Gap: 2695 to 3580 = 885 units
        { x: 3137.5, y: 1044, width: 885, height: 48 },
        // Third water section - fills gap between segments 6 and 7
        // Segment 6: x=7585, width=650 → right edge at 7910
        // Segment 7: x=8590, width=700 → left edge at 8240
        // Gap: 7910 to 8240 = 330 units
        { x: 8075, y: 1044, width: 330, height: 48 }
    ],
    worldBounds: { width: 8940, height: 1080 }
};
