// Tab switching functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked tab and corresponding content
        btn.classList.add('active');
        document.getElementById(tabId).classList.add('active');
    });
});

let samplePalettes = [];
let moodBoardItems = loadMoodBoardItems(); // Load from storage or initialize as empty

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
      samplePalettes = []; // fallback to empty if loading fails
    });
}

// Local storage functions
function savePalettes(palettes) {
    localStorage.setItem('colorPalettes', JSON.stringify(palettes));
}

function loadSavedPalettes() {
    const saved = localStorage.getItem('colorPalettes');
    return saved ? JSON.parse(saved) : [];
}

function getAllPalettes() {
    const savedPalettes = loadSavedPalettes();
    // Combine sample palettes with saved ones, avoiding duplicates
    const allPalettes = [...samplePalettes];
    
    savedPalettes.forEach(savedPalette => {
        if (!allPalettes.some(palette => palette.name === savedPalette.name)) {
            allPalettes.push(savedPalette);
        }
    });
    
    return allPalettes;
}

// Load all palettes
function loadPalettes() {
    const paletteGrid = document.querySelector('.palette-grid');
    paletteGrid.innerHTML = ''; // Clear existing palettes
    
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
    
    // Add delete button for custom palettes (not sample ones)
    const isCustomPalette = !samplePalettes.some(sample => sample.name === palette.name);
    if (isCustomPalette) {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '×';
        deleteBtn.style.background = '#ff4757';
        deleteBtn.style.color = 'white';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '50%';
        deleteBtn.style.width = '25px';
        deleteBtn.style.height = '25px';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.fontSize = '16px';
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
            
            // Visual feedback for copying
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

// Delete palette function
function deletePalette(paletteName) {
    const savedPalettes = loadSavedPalettes();
    const updatedPalettes = savedPalettes.filter(palette => palette.name !== paletteName);
    savePalettes(updatedPalettes);
    loadPalettes(); // Refresh the display
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadSamplePalettes().then(() => {
    loadPalettes();
    });
    renderMoodBoard();
    document.getElementById('save-json').addEventListener('click', saveDataAsJSON);
});

// Add new palette functionality with saving
document.getElementById('add-palette').addEventListener('click', () => {
    const name = prompt('Enter palette name:');
    if (name) {
        // Check if palette name already exists
        const existingPalettes = getAllPalettes();
        if (existingPalettes.some(palette => palette.name === name)) {
            alert('A palette with this name already exists. Please choose a different name.');
            return;
        }
        
        const colors = [];
        for (let i = 0; i < 6; i++) {
            const colorCode = prompt(`Enter color ${i + 1} (hex code without #):`);
            if (colorCode) {
                // Validate hex code
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
            
            // Save to local storage
            const savedPalettes = loadSavedPalettes();
            savedPalettes.push(newPalette);
            savePalettes(savedPalettes);
            
            // Refresh the display
            loadPalettes();
            
            alert(`Palette "${name}" saved successfully!`);
        }
    }
});

function getExportData() {
    // Example: adjust to your actual data structure
    const palettes = getAllPalettes(); // Function that returns palette array
    const moodboard = getMoodBoardItems(); // Function that returns mood board array

    return { palettes, moodboard };
}

function saveDataAsJSON() {
    const data = getExportData();
    const json = JSON.stringify(data, null, 2); // Pretty print

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
                // Only import custom palettes, avoid overwriting samples
                const sampleNames = (window.samplePalettes || []).map(p => p.name);
                const customPalettes = data.palettes.filter(p => !sampleNames.includes(p.name));
                localStorage.setItem('colorPalettes', JSON.stringify(customPalettes));
            }

            // Import mood board
            if (data.moodboard && Array.isArray(data.moodboard)) {
                localStorage.setItem('moodBoardItems', JSON.stringify(data.moodboard));
            }

            // Reload UI to reflect imported data
            if (typeof loadPalettes === 'function') loadPalettes();
            if (typeof renderMoodBoard === 'function') renderMoodBoard();

            alert('Import successful!');
        } catch (err) {
            alert('Invalid JSON file.');
        }
    };
    reader.readAsText(file);
});


function saveMoodBoardItems(items) {
    localStorage.setItem('moodBoardItems', JSON.stringify(items));
}

function loadMoodBoardItems() {
    const saved = localStorage.getItem('moodBoardItems');
    return saved ? JSON.parse(saved) : [];
}
function renderMoodBoard() {
    const moodGrid = document.querySelector('.mood-grid');
    moodGrid.innerHTML = '';
    moodBoardItems.forEach(item => {
        const div = document.createElement('div');
        div.className = 'mood-item';
        div.innerHTML = `
            <img class="mood-image" src="assets/images/${item.filename}" alt="${item.caption || ''}">
            <div class="mood-content">${item.caption || ''}</div>
        `;
        moodGrid.appendChild(div);
    });
}

document.getElementById('add-mood-item').addEventListener('click', () => {
    const filename = prompt('Enter image filename in assets/images/ (e.g., mood1.jpg):');
    if (!filename) return;
    const caption = prompt('Enter a caption for this inspiration (optional):');
    moodBoardItems.push({ filename, caption });
    saveMoodBoardItems(moodBoardItems);
    renderMoodBoard();
});

// function getMoodBoardItems() {
//     return loadMoodBoardItems();
// }

function imageToBase64(imgElement) {
    const canvas = document.createElement('canvas');
    canvas.width = imgElement.width;
    canvas.height = imgElement.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgElement, 0, 0);
    return canvas.toDataURL('image/png');
}

// Lightbox functionality
function setupLightbox() {
  const overlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  // Event delegation for mood images
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

  // Close on overlay click (but not image)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    }
  });

  // Optional: close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      overlay.style.display = 'none';
      lightboxImg.src = '';
      lightboxCaption.textContent = '';
    }
  });
}

// Call this after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // ...existing code...
  setupLightbox();
});
