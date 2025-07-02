# Standalone Skeet Game

This is a standalone version of the skeet shooting game, built with Phaser 3. The game is mobile-responsive and works on both desktop and mobile devices.

## Features

-   Responsive design that works on all screen sizes
-   Mobile controls with touch support
-   Desktop controls with mouse
-   Multiple target types with different point values
-   Sound effects
-   Score tracking
-   Game over screen with restart option

## How to Run

1. You can run the game using any static file server. Here are a few options:

    Using Node.js:

    ```bash
    npm install
    npm run dev
    ```

2. Open your browser and navigate to:
    - If using Python: `http://localhost:8000`
    - If using Node.js: `http://localhost:3000`
    - If using PHP: `http://localhost:8000`

## Controls

### Desktop

-   Move mouse to aim
-   Click to shoot
-   Click reload button when out of bullets

### Mobile

-   Use the control pad on the left to move the crosshair
-   Tap the shoot button on the right to shoot
-   Tap the reload button when out of bullets

## Game Rules

1. You start with 6 bullets
2. Hit targets to score points:
    - Bottle: 100 points
    - Can: 150 points
    - Dynamite: 200 points
    - Skull: 300 points
3. Game ends when you run out of bullets
4. Try to get the highest score possible!

## Development

The game is built using:

-   Phaser 3.60.0
-   HTML5
-   CSS3
-   JavaScript

All game assets are included in the `images/games/skeet` directory.
