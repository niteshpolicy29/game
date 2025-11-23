# HTML Structure Guidelines

## HTML File Structure
- Keep HTML minimal and semantic
- Use a single container div for the Phaser game canvas
- Include proper meta tags for viewport and charset
- Load scripts at the end of body or use defer/async

## Required Elements
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Game Title</title>
    <style>
        body { margin: 0; padding: 0; overflow: hidden; }
        #game-container { width: 100vw; height: 100vh; }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script src="phaser.min.js"></script>
    <script src="game.js"></script>
</body>
</html>
```

## CSS Considerations
- Remove default margins and padding
- Set overflow: hidden to prevent scrollbars
- Make game container responsive if needed
- Use CSS for UI overlays outside the canvas

## Script Loading
- Load Phaser library before game code
- Use module bundlers (webpack/vite) for larger projects
- Consider CDN for Phaser or local copy for offline development
