# Color Curio

A creative hub for organizing color palettes and mood board inspirations.

---

## Features

### Color Lab
- Find complementary and analogous colors based on an input color
- Quickly explore harmonious color combinations
- Input a color and get suggested matching colors for design inspiration 

### Color Palette Organizer
- Add, view, and manage custom color palettes (up to 6 colors per palette)
- Copy hex codes to clipboard with a click
- Export and import palettes as JSON files for easy sharing and backup
- Delete palettes you no longer need

### Mood Board
- Add inspiration images with captions
- View images in a responsive, clear grid
- Click any image to view it fullscreen (lightbox)
- Delete images from your mood board
- Export and import your mood board as JSON

### Sample Palettes
- Curated sample palettes are loaded from a JSON file for inspiration

---

## Project Structure

```
├── index.html
├── style.css
├── script.js
├── assets/
│   ├── images/                # Mood board images
│   ├── palettes/              # JSON files for palettes
│   │   └── samplePalettes.json
│   └── moodboard/             # Mood board JSON files
│       └── sampleMoodBoard.json
└── README.md
```

- `index.html` – Main webpage
- `style.css` – Stylesheet for the app
- `script.js` – JavaScript logic and interactivity
- `assets/images/` – Folder for all mood board image files
- `assets/palettes/` – Folder for palette JSON files, including `samplePalettes.json`
- `assets/moodboard/` – Folder for moodboard JSON files, including `sampleMoodBoard.json`
- `README.md` – Project documentation

---

## Getting Started

1. **Clone or Download** this repository.
2. **Add Images:** Place your mood board images in `assets/images/`.
3. **Open the App:** Open `index.html` in your browser (use a local server for full functionality).
4. **Create & Manage:** Add palettes and mood board items using the interface.
5. **Export/Import:** Use the export/import buttons to back up or transfer your data.

---

## Usage

- **Add Palette:** Click "+ Add New Palette", enter a name and up to 6 hex color codes (without the `#`).
- **Add Inspiration:** Click "+ Add Inspiration", enter the image filename (from `assets/images/`) and an optional caption.
- **Use Color Lab:** Experiment with colors interactively and save your favorite experiments.
- **Delete:** Use the "×" button on palettes or mood board images to remove them.
- **Export/Import:** Save your palettes and mood board as a JSON file, or load them on another device.

---

## Notes

- **Local Storage:** Custom palettes and mood board items are saved in your browser. Use export/import to move data between devices.
- **Sample Palettes:** The app loads sample palettes from `assets/palettes/samplePalettes.json`.
- **Image Management:** Only images in `assets/images/` can be added to the mood board.

---

## Example Palettes

| Palette Name      | Example Colors                                  |
|-------------------|-------------------------------------------------|
| Ocean Breeze      | #0077be, #00a8cc, #40e0d0, #87ceeb, ...         |
| Sunset Vibes      | #ff6b35, #f7931e, #ffd23f, #06ffa5, ...         |
| Modern Metallics  | #D69A6D, #A3A8A3, #F6E7CE, #2F343B, ...         |

---


## License

This project is for personal and educational use.  
Feel free to customize and expand it for your own inspiration hub!


**Creator:**
[Mayuree Reunsati](https://github.com/mareerray) 

[Project Repo](https://github.com/mareerray/MyInspoPage/settings)