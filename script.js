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

// Sample color palettes
const samplePalettes = [
    {
        name: "Ocean Breeze",
        colors: ["#0077be", "#00a8cc", "#40e0d0", "#87ceeb", "#f0f8ff", "#e6f3ff"]
    },
    {
        name: "Sunset Vibes",
        colors: ["#ff6b35", "#f7931e", "#ffd23f", "#06ffa5", "#118ab2", "#073b4c"]
    },
    {
        name: "Warm Retro Palette",
        colors: ["#01204E", "#028391", "#F6DCAC", "#FAA968", "#F85525"]
    },
    {
        name: "Classic 80s Retro",
        colors: ["#270245", "#871A85", "#FF2941", "#FEFF38", "#FE18D3"]
    },
    {
        name: "Vintage Americana",
        colors: ["#272324", "#83B799", "#E2CD6D", "#C2B28F", "#E4D8B4", "#E86F68"]
    }
];

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
    loadPalettes();
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
