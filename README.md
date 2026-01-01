# Color Curio

A creative hub for organizing color palettes and mood board inspirations.

---

## Features

### Color Lab
- Find complementary and analogous colors based on an input color
- Quickly explore harmonious color combinations
- Input a color and get suggested matching colors for design inspiration 

### Color Palette Archive
- Browse 30+ curated professional sample palettes
- Instant search by name, mood, or style
- Copy individual colors to clipboard
- Read-only inspiration library

### Color Palette Organizer
- Add, view, and manage custom color palettes (up to 6 colors per palette)
- Copy hex codes to clipboard with a click
- Export and import palettes as JSON files for easy sharing and backup
- Delete palettes you no longer need

### Mood Board
- Upload inspiration images with automatic 10-color palette extraction
- Diverse color detection - finds gold, purple, red, pink, and accents even if small
- Hex codes displayed on each swatch with click-to-copy
- Right-click export: Download image with palette OR copy all colors
- Responsive grid layout with fullscreen lightbox
- Storage limit: Max 15 custom images with warnings
- Delete custom images (samples protected)

### Sample Palettes
- Curated sample palettes are loaded from a JSON file for inspiration

---

## Project Structure

```
├── index.html
├── style.css
├── home.css
├── colorlab.css
├── archive.css
├── palettes.css
├── moodboard.css
├── app.js
├── modules/
│   ├── layout.js              
│   ├── home.js
│   ├── colorlab.js   
│   ├── archive.js           
│   ├── palettes.js
│   └── moodboard.js  
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
- `app.js` – JavaScript logic and interactivity
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

- **Browse Archive:** → Search and copy colors from curated sample palettes

- **Use Color Lab:** Experiment with colors interactively and save your favorite experiments.

- **Add Image to Mood Board:** → Click "Add Inspiration" button, select image file (< 2MB), add optional caption - auto-generates 10 diverse colors

- **Click swatch** → Copy hex code to clipboard (shows "Copied!" feedback)

- **Right-click image** → Choose "Download image with palette" OR "Copy all colors"

- **Click image** → Fullscreen lightbox view
- **Storage Counter**: Shows "X/15 images uploaded" - warns when nearing limit

- **Delete:** Use the "×" button on custom palettes or mood board images to remove them. (samples protected)

---

## Notes

- **Local Storage**: Custom palettes and mood board items saved in browser. Export/import to move between devices.

- **Image Upload**: Supports JPG/PNG (< 2MB). Auto-extracts 10 diverse colors (gold, purple, red/pink, accents detected).

- **Color Diversity**: Algorithm ensures unique colors - no duplicates or similar shades.

- **Sample Content**: Sample palettes from assets/palettes/samplePalettes.json, sample moodboard from assets/moodboard/sampleMoodBoard.json.

- **Storage Limit**: Maximum 15 custom images. Delete to add more.

- **Browser Support**: Works best on modern browsers (Chrome, Firefox, Safari, Edge).

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