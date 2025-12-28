// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

// ---------- COLOR LAB ----------
const container = document.getElementById('color-wheel-container');
const baseColorInput = document.getElementById('base-color');
const colorRange = document.getElementById('color-range');

if (baseColorInput) {
    const colorBase = document.getElementById('color-base');
    const colorComplementary = document.getElementById('color-complementary');
    const colorAnalogous1 = document.getElementById('color-analogous1');
    const colorAnalogous2 = document.getElementById('color-analogous2');

    const hexBaseText = document.getElementById('hex-base');
    const hexComplementaryText = document.getElementById('hex-complementary');
    const hexAnalogous1Text = document.getElementById('hex-analogous1');
    const hexAnalogous2Text = document.getElementById('hex-analogous2');

    function hslFromHue(hue) {
        return { h: hue, s: 100, l: 50 };
    }
    // Hex to HSL function (unchanged)
    function hexToHSL(hex) {
        let r = 0, g = 0, b = 0;
        if (hex.length === 4) {
            r = "0x" + hex[1] + hex[1];
            g = "0x" + hex[2] + hex[2];
            b = "0x" + hex[3] + hex[3];
        } else if (hex.length === 7) {
            r = "0x" + hex[1] + hex[2];
            g = "0x" + hex[3] + hex[4];
            b = "0x" + hex[5] + hex[6];
        }
        r /= 255; g /= 255; b /= 255;

        const cmin = Math.min(r, g, b);
        const cmax = Math.max(r, g, b);
        const delta = cmax - cmin;

        let h = 0, s = 0, l = 0;

        if (delta === 0) h = 0;
        else if (cmax === r) h = ((g - b) / delta) % 6;
        else if (cmax === g) h = (b - r) / delta + 2;
        else h = (r - g) / delta + 4;

        h = Math.round(h * 60);
        if (h < 0) h += 360;

        l = (cmax + cmin) / 2;
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
        s = +(s * 100).toFixed(1);
        l = +(l * 100).toFixed(1);

        return { h, s, l };
    }

    // HSL to hex function (unchanged)
    function hslToHex(h, s, l) {
        s /= 100; l /= 100;
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h / 60) % 2 - 1));
        const m = l - c / 2;
        let r = 0, g = 0, b = 0;

        if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
        else if (h < 120) { r = x; g = c; b = 0; }
        else if (h < 180) { r = 0; g = c; b = x; }
        else if (h < 240) { r = 0; g = x; b = c; }
        else if (h < 300) { r = x; g = 0; b = c; }
        else { r = c; g = 0; b = x; }

        r = Math.round((r + m) * 255);
        g = Math.round((g + m) * 255);
        b = Math.round((b + m) * 255);

        const toHex = v => v.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    // Calculate complementary and analogous hues 
    function calculateHarmonies(h) {
        const complementary = (h + 180) % 360;
        const analogous1 = (h + 30) % 360;
        const analogous2 = (h - 30 + 360) % 360;
        return { complementary, analogous1, analogous2 };
    }

    // Update colors in UI and on the color wheel
    function updateColors(baseHex) {
        const baseHSL = hexToHSL(baseHex);
        const { complementary, analogous1, analogous2 } = calculateHarmonies(baseHSL.h);

        // Update color boxes and hex text
        colorBase.style.backgroundColor = baseHex;
        hexBaseText.textContent = baseHex;

        const compHex = hslToHex(complementary, baseHSL.s, baseHSL.l);
        colorComplementary.style.backgroundColor = compHex;
        hexComplementaryText.textContent = compHex;

        const analHex1 = hslToHex(analogous1, baseHSL.s, baseHSL.l);
        colorAnalogous1.style.backgroundColor = analHex1;
        hexAnalogous1Text.textContent = analHex1;

        const analHex2 = hslToHex(analogous2, baseHSL.s, baseHSL.l);
        colorAnalogous2.style.backgroundColor = analHex2;
        hexAnalogous2Text.textContent = analHex2;
    }

    function updateFromHue(hue) {
        const hsl = hslFromHue(hue);
        const hex = hslToHex(hsl.h, hsl.s, hsl.l);
        updateColors(hex);
    }

    colorRange.addEventListener('input', () => {
        updateFromHue(+colorRange.value);
    });

    // Initialize colors with default input value
    updateColors(baseColorInput.value);
    updateFromHue(colorRange.value);

    // Update colors and wheel on color input change
    baseColorInput.addEventListener('input', e => updateColors(e.target.value));
}


// ---------- PALETTES ----------

let samplePalettes = [];

// Local storage functions for palettes
function savePalettes(palettes) {
    localStorage.setItem('colorPalettes', JSON.stringify(palettes));
}

function loadSavedPalettes() {
    const saved = localStorage.getItem('colorPalettes');
    return saved ? JSON.parse(saved) : [];
}

function getAllPalettes() {
    const savedPalettes = loadSavedPalettes();
    const allPalettes = [...samplePalettes];
    savedPalettes.forEach(savedPalette => {
        if (!allPalettes.some(palette => palette.name === savedPalette.name)) {
            allPalettes.push(savedPalette);
        }
    });
    return allPalettes;
}

function loadSamplePalettes() {
    return fetch('assets/palettes/samplePalettes.json')
        .then(response => {
            if (!response.ok) throw new Error('Failed to load sample palettes');
            return response.json();
        })
        .then(data => {
            samplePalettes = data;
        })
        .catch(error => {
            console.error(error);
            samplePalettes = [];
        });
}

function loadPalettes() {
    const paletteGrid = document.querySelector('.palette-grid');
    paletteGrid.innerHTML = '';
    const allPalettes = getAllPalettes();
    allPalettes.forEach(palette => {
        const paletteCard = createPaletteCard(palette);
        paletteGrid.appendChild(paletteCard);
    });
}

function createPaletteCard(palette) {
    const card = document.createElement('div');
    card.className = 'palette-card';

    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';
    header.style.alignItems = 'center';
    header.style.marginBottom = '1rem';

    const title = document.createElement('h3');
    title.textContent = palette.name;

    const isCustomPalette = !samplePalettes.some(sample => sample.name === palette.name);
    if (isCustomPalette) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.className = 'delete-palette-btn';
        deleteBtn.title = 'Delete palette';
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${palette.name}"?`)) {
                deletePalette(palette.name);
            }
        });
        header.appendChild(title);
        header.appendChild(deleteBtn);
    } else {
        header.appendChild(title);
    }

    const colorRow = document.createElement('div');
    colorRow.className = 'color-row';

    palette.colors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.backgroundColor = color;
        swatch.textContent = color;
        
        swatch.addEventListener('click', () => {
            navigator.clipboard.writeText(color);
            const originalText = swatch.textContent;
            swatch.textContent = 'Copied!';
            setTimeout(() => {
                swatch.textContent = originalText;
            }, 1000);
        });
        colorRow.appendChild(swatch);
    });

    card.appendChild(header);
    card.appendChild(colorRow);

    return card;
}

function deletePalette(paletteName) {
    const savedPalettes = loadSavedPalettes();
    const updatedPalettes = savedPalettes.filter(palette => palette.name !== paletteName);
    savePalettes(updatedPalettes);
    loadPalettes();
}

// Add new palette functionality
document.getElementById('add-palette').addEventListener('click', () => {
    const name = prompt('Enter palette name:');
    if (name) {
        const existingPalettes = getAllPalettes();
        if (existingPalettes.some(palette => palette.name === name)) {
            alert('A palette with this name already exists. Please choose a different name.');
            return;
        }
        const colors = [];
        for (let i = 0; i < 6; i++) {
            const colorCode = prompt(`Enter color ${i + 1} (hex code without #):`);
            if (colorCode) {
                if (/^[0-9A-F]{6}$/i.test(colorCode)) {
                    colors.push('#' + colorCode);
                } else {
                    alert(`Invalid hex code: ${colorCode}. Please use 6-character hex codes (e.g., ff6b35)`);
                    return;
                }
            }
        }
        if (colors.length > 0) {
            const newPalette = { name, colors };
            const savedPalettes = loadSavedPalettes();
            savedPalettes.push(newPalette);
            savePalettes(savedPalettes);
            loadPalettes();
            alert(`Palette "${name}" saved successfully!`);
        }
    }
});

// ---------- MOOD BOARD ----------

// Global mood board state
let moodBoardItems = [];

// Save mood board items to localStorage
function saveMoodBoardItems(items) {
    localStorage.setItem('moodBoardItems', JSON.stringify(items));
}

// Load mood board items from localStorage
function loadMoodBoardItems() {
    const saved = localStorage.getItem('moodBoardItems');
    return saved ? JSON.parse(saved) : [];
}

// Load mood board: sample on first visit, user items on subsequent visits
async function loadMoodBoard() {
    moodBoardItems = loadMoodBoardItems();
    if (!moodBoardItems || moodBoardItems.length === 0) {
        const response = await fetch('assets/moodboard/sampleMoodBoard.json');
        moodBoardItems = await response.json();
        saveMoodBoardItems(moodBoardItems);
    }
    renderMoodBoard();
}

function renderMoodBoard() {
    const moodGrid = document.querySelector('.mood-grid');
    moodGrid.innerHTML = '';
    moodBoardItems.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'mood-item';
        div.innerHTML = `
            <img class="mood-image" src="assets/images/${item.filename}" alt="${item.caption || ''}">
            <div class="mood-content">${item.caption || ''}</div>
            <button class="delete-mood-item" data-index="${index}" title="Delete this image">&times;</button>
        `;
        moodGrid.appendChild(div);
    });

    document.querySelectorAll('.delete-mood-item').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const idx = parseInt(btn.getAttribute('data-index'));
            moodBoardItems.splice(idx, 1);
            saveMoodBoardItems(moodBoardItems);
            renderMoodBoard();
            e.stopPropagation();
        });
    });
}

// Add mood board item
document.getElementById('add-mood-item').addEventListener('click', () => {
    const filename = prompt('Enter image filename in assets/images/ (e.g., mood1.jpg):');
    if (!filename) return;
    const caption = prompt('Enter a caption for this inspiration (optional):');
    moodBoardItems.push({ filename, caption });
    saveMoodBoardItems(moodBoardItems);
    renderMoodBoard();
});

// ---------- EXPORT / IMPORT ----------

function getExportData() {
    const palettes = getAllPalettes();
    const moodboard = moodBoardItems;
    return { palettes, moodboard };
}

function saveDataAsJSON() {
    const data = getExportData();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "palette_moodboard.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.getElementById('save-json').addEventListener('click', saveDataAsJSON);

document.getElementById('import-json-btn').addEventListener('click', function() {
    document.getElementById('import-json').click();
});

document.getElementById('import-json').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            // Import palettes
            if (data.palettes && Array.isArray(data.palettes)) {
                const sampleNames = (window.samplePalettes || []).map(p => p.name);
                const customPalettes = data.palettes.filter(p => !sampleNames.includes(p.name));
                localStorage.setItem('colorPalettes', JSON.stringify(customPalettes));
            }
            // Import mood board
            if (data.moodboard && Array.isArray(data.moodboard)) {
                localStorage.setItem('moodBoardItems', JSON.stringify(data.moodboard));
            }
            if (typeof loadPalettes === 'function') loadPalettes();
            if (typeof loadMoodBoard === 'function') loadMoodBoard();
            alert('Import successful!');
        } catch (err) {
            alert('Invalid JSON file.');
        }
    };
    reader.readAsText(file);
});

// ---------- LIGHTBOX ----------

function setupLightbox() {
    const overlay = document.getElementById('lightbox-overlay');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');

    document.querySelector('.mood-grid').addEventListener('click', function(e) {
        if (e.target.classList.contains('mood-image')) {
            lightboxImg.src = e.target.src;
            lightboxCaption.textContent = e.target.closest('.mood-item').querySelector('.mood-content').textContent || '';
            overlay.style.display = 'flex';
        }
    });

    closeBtn.addEventListener('click', () => {
        overlay.style.display = 'none';
        lightboxImg.src = '';
        lightboxCaption.textContent = '';
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.display = 'none';
            lightboxImg.src = '';
            lightboxCaption.textContent = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            overlay.style.display = 'none';
            lightboxImg.src = '';
            lightboxCaption.textContent = '';
        }
    });
}

// ---------- HARMONY PALETTES ----------

function generateSoftPalette(baseHex) {
  const hsl = hexToHSL(baseHex);
  const baseHue = hsl.h;
  
  return [
    hslToHex(baseHue, hsl.s * 0.5, hsl.l * 0.9),
    hslToHex((baseHue + 30) % 360, hsl.s * 0.4, hsl.l * 0.85),
    hslToHex((baseHue - 30 + 360) % 360, hsl.s * 0.4, hsl.l * 0.85),
    hslToHex((baseHue + 180) % 360, hsl.s * 0.3, hsl.l * 0.88),
    hslToHex(baseHue, hsl.s * 0.6, hsl.l * 0.95)
  ];
}

function generateAllSchemes() {
  const baseColor = document.getElementById('baseColor').value;
  const hsl = hexToHSL(baseColor);
  const baseHue = hsl.h;
  
  const schemes = {
    'Analogous': [
      baseColor,
      hslToHex((baseHue + 30) % 360, hsl.s, hsl.l),
      hslToHex((baseHue - 30 + 360) % 360, hsl.s, hsl.l),
      hslToHex(baseHue, hsl.s * 0.8, hsl.l * 1.1)
    ],
    'Complementary': [
      baseColor,
      hslToHex((baseHue + 180) % 360, hsl.s, hsl.l)
    ],
    'Triadic': [
      baseColor,
      hslToHex((baseHue + 120) % 360, hsl.s, hsl.l),
      hslToHex((baseHue + 240) % 360, hsl.s, hsl.l)
    ],
    'Tetradic': [
      baseColor,
      hslToHex((baseHue + 90) % 360, hsl.s, hsl.l),
      hslToHex((baseHue + 180) % 360, hsl.s, hsl.l),
      hslToHex((baseHue + 270) % 360, hsl.s, hsl.l)
    ],
    'Monochromatic': [
      baseColor,
      hslToHex(baseHue, hsl.s * 0.7, hsl.l * 0.7),
      hslToHex(baseHue, hsl.s * 0.5, hsl.l * 0.5),
      hslToHex(baseHue, hsl.s * 0.3, hsl.l * 1.2)
    ],
    'Soft': generateSoftPalette(baseColor)
  };
  
  displayAllSchemes(schemes);
}

function displayAllSchemes(schemes) {
  const container = document.getElementById('paletteSwatches');
  if (!container) return;
  
  // Pad schemes to same length (5 colors max)
  const maxLength = 5;
  const paddedSchemes = {};
  for (const [name, colors] of Object.entries(schemes)) {
    paddedSchemes[name] = [...colors, ...Array(maxLength - colors.length).fill('#f0f0f0')];
  }
  
  container.innerHTML = Object.entries(paddedSchemes).map(([name, colors]) => `
    <div class="scheme-row">
      <h4>${name}</h4>
      <div class="scheme-swatches">
        ${colors.map(color => 
          `<div class="swatch" style="background: ${color};" 
                 onclick="navigator.clipboard.writeText('${color}')">
            <span>${color}</span>
          </div>`
        ).join('')}
      </div>
    </div>
  `).join('');
}

// ---------- INITIALIZATION ----------

// Replace FINAL DOMContentLoaded with:
document.addEventListener('DOMContentLoaded', () => {
  // Tab switching works immediately
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
      
      // Load content AFTER tab switch
      if (tabId === 'palettes') loadSamplePalettes().then(() => loadPalettes());
      if (tabId === 'moodboard') loadMoodBoard();
    });
  });
  
  // Load active tab (Palettes)
  loadSamplePalettes().then(() => loadPalettes());
  setupLightbox();
});


