# Typing Speed Test

This is a small browser app I hacked together to practice typing without needing an account or any setup. Open `index.html` and you get a clean welcome screen where you enter your name, pick a difficulty, and jump straight into a timed typing session.

## Highlights
- Three difficulty presets: short friendly lines, medium sentences, and longer technical passages.
- Real-time stats while you type: WPM, sentences per minute, accuracy, and elapsed time.
- Keyboard-friendly workflow — press Enter to move to the next sentence, Shift+Enter if you need a line break.
- Motivational summary cards and a lightweight local history that stays in your browser storage (no backend needed).
- Reset buttons everywhere so you can bail and restart if the run goes sideways.

## How to Run
1. Clone or download the folder.
2. Double-click `index.html` (or host it with any static server if you prefer).
3. Type your name, hit **Start**, and follow the on-screen prompts.

## Project Structure
- `index.html` – screens for welcome, menu, difficulty picker, typing test, results, and history.
- `style.css` – glassmorphism-inspired layout, responsive grid for stats/results, and status colors for correct/incorrect letters.
- `script.js` – handles the entire app state (user, difficulty, timers), calculates WPM/SPM/accuracy, and keeps the history in `localStorage`.
- `opps.cpp` – scratchpad for C++ practice (not required for the web app).

## Tech Stack
Plain HTML, vanilla CSS, and modern JavaScript. No frameworks or build tools.

## Future Ideas
- Add a custom text mode so friends can paste their own paragraphs.
- Sync history to a backend so results follow you between devices.
- Add sound cues or keyboard shortcuts for people who keep the screen hidden.

## License
Feel free to reuse or tweak any part of this project. A shout-out is appreciated but not required.

