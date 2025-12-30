# Color Curio : "Harmony in Every Hue" 🌈

Live demo: [mareerray.github.io/ColorCurio/](http://mareerray.github.io/ColorCurio/)

Color Curio is a creative hub for organising color palettes and mood board inspirations. Designed by Mayuree Reunsati, it allows users to design palettes that feel magical and generate harmonious color schemes in a single click

## Features

### Color Lab — Color Harmonies
- Explore Harmonies: Find balanced palettes by exploring complementary (maximum contrast) and analogous (harmonious blends) colors based on a starting base color.
- Design Inspiration: Input any color to receive immediate suggested matching colors to kickstart your creative process.

### Color Palette Archive *(New!)*
- Curated Library: Browse a collection of 30+ professional sample palettes.
- Smart Search: Instantly search for inspiration by name, mood, or style.
- Quick Copy: Click any individual color to copy its hex code directly to your clipboard.
- Read-Only Library: This section serves as a permanent, curated inspiration source

### Mood Board
- Responsive Grid: Add inspiration images with captions and view them in a clear, organised layout.
- Lightbox View: Click any image to open it in a fullscreen lightbox for closer inspection.
- Management: Easily delete images from your board as your project evolves.

### Custom Palette Creator (🚧 Coming Soon!)
- Build & Preview: Tools to build, save, and preview your own palettes (up to 6 colors) with live mockups are currently under development.
- Check Back Soon: Look forward to full palette creation tools in a future update ✨


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
2. **Open the App:** Open `index.html` in your browser (use a local server for full functionality).
3. **Explore:** Use the interface to experiment with the Color Lab, browse the Archive, or build your local Mood Board.

## Example Palettes

| Palette Name      | Example Colors                                  |
|-------------------|-------------------------------------------------|
| Ocean Breeze      | #0077be, #00a8cc, #40e0d0, #87ceeb, ...         |
| Sunset Vibes      | #ff6b35, #f7931e, #ffd23f, #06ffa5, ...         |
| Modern Metallics  | #D69A6D, #A3A8A3, #F6E7CE, #2F343B, ...         |

---

## Usage

- **Browse Archive:** Search and copy colors from curated sample palettes.
- **Use Color Lab:** Interactively experiment with color combinations and harmonies.


---


## License

This project is for personal and educational use.  
Feel free to customize and expand it for your own inspiration hub!


**Creator:**
[Mayuree Reunsati](https://github.com/mareerray) 

[Project Repo : github.com/mareerray/ColorCurio](https://github.com/mareerray/ColorCurio)

