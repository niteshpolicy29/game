export const Level4Data = {
    platforms: [
        // GROUND SEGMENTS - Level 4: EXTREME challenge redesigned
        // Starting ground
        { x: 350, y: 1044, width: 700, height: 72 },
        
        // Ground segment 1 (after large gap - 650 units)
        { x: 1375, y: 1044, width: 550, height: 72 },
        
        // Ground segment 2 (after huge gap - 850 units)
        { x: 2775, y: 1044, width: 500, height: 72 },
        
        // Ground segment 3 (after massive water gap - 950 units)
        { x: 4225, y: 1044, width: 600, height: 72 },
        
        // Ground segment 4 (after large gap - 720 units)
        { x: 5545, y: 1044, width: 550, height: 72 },
        
        // Ground segment 5 (after huge gap - 880 units)
        { x: 6975, y: 1044, width: 500, height: 72 },
        
        // Ground segment 6 (after massive water gap - 1000 units) - EXTENDED
        { x: 8475, y: 1044, width: 1400, height: 72 },
        
        // FLOATING PLATFORMS - LARGE GAP 1 (650 units)
        { x: 850, y: 880, width: 150, height: 48 },
        { x: 1010, y: 820, width: 140, height: 48 },
        { x: 1170, y: 860, width: 160, height: 48 },
        
        // FLOATING PLATFORMS - HUGE GAP 2 (850 units)
        { x: 2050, y: 870, width: 150, height: 48 },
        { x: 2210, y: 800, width: 140, height: 48 },
        { x: 2370, y: 730, width: 160, height: 48 },
        { x: 2530, y: 820, width: 150, height: 48 },
        { x: 2690, y: 880, width: 140, height: 48 },
        
        // FLOATING PLATFORMS - MASSIVE WATER GAP 3 - REMOVED (water crossing)
        
        // FLOATING PLATFORMS - LARGE GAP 4 (720 units)
        { x: 4710, y: 870, width: 150, height: 48 },
        { x: 4870, y: 810, width: 140, height: 48 },
        { x: 5030, y: 750, width: 160, height: 48 },
        { x: 5190, y: 830, width: 150, height: 48 },
        
        // FLOATING PLATFORMS - HUGE GAP 5 (880 units)
        { x: 6380, y: 860, width: 150, height: 48 },
        { x: 6540, y: 790, width: 140, height: 48 },
        { x: 6700, y: 720, width: 160, height: 48 },
        { x: 6860, y: 810, width: 150, height: 48 },
        
        // FLOATING PLATFORMS - MASSIVE WATER GAP 6 - REMOVED (water crossing)
    ],
    playerStart: { x: 240, y: 900 },
    goal: { x: 9000, y: 850 },
    checkpoints: [],
    enemies: [
        // Enemy on ground segment 1
        { x: 1500, y: 900, patrolStart: 1375, patrolEnd: 1775 },
        // Enemy on floating platform in huge gap
        { x: 2210, y: 720, patrolStart: 2130, patrolEnd: 2290 },
        // Enemy on ground segment 2
        { x: 2900, y: 900, patrolStart: 2775, patrolEnd: 3125 },
        // Enemy on ground segment 3
        { x: 4400, y: 900, patrolStart: 4225, patrolEnd: 4625 },
        // Enemy on ground segment 4
        { x: 5700, y: 900, patrolStart: 5545, patrolEnd: 5945 },
        // Enemy on floating platform in huge gap 5
        { x: 6540, y: 710, patrolStart: 6460, patrolEnd: 6620 },
        // Enemy on ground segment 5
        { x: 7150, y: 900, patrolStart: 6975, patrolEnd: 7375 },
        // Enemy on ground segment 6
        { x: 8700, y: 900, patrolStart: 8475, patrolEnd: 8875 },
        // Enemy on final part of segment 6
        { x: 9100, y: 900, patrolStart: 8950, patrolEnd: 9250 }
    ],
    waterAreas: [
        // First water section - fills gap between segments 2 and 3
        // Segment 2: x=2775, width=500 → right edge at 3025
        // Segment 3: x=4225, width=600 → left edge at 3925
        // Gap: 3025 to 3925 = 900 units
        { x: 3475, y: 1044, width: 900, height: 48 },
        // Second water section - fills gap between segments 5 and 6
        // Segment 5: x=6975, width=500 → right edge at 7225
        // Segment 6: x=8475, width=1400 → left edge at 7775
        // Gap: 7225 to 7775 = 550 units
        { x: 7500, y: 1044, width: 550, height: 48 }
    ],
    worldBounds: { width: 9675, height: 1080 }
};
