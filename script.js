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

// ---------- INITIALIZATION ----------

document.addEventListener('DOMContentLoaded', () => {
    loadSamplePalettes().then(() => {
        loadPalettes();
    });
    loadMoodBoard();
    setupLightbox();
});
