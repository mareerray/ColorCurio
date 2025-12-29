// // modules/palettes.js - COMPLETE & FIXED
// let samplePalettes = [];

// // ========== PUBLIC FUNCTIONS ==========
// window.loadSamplePalettes = function() {
//   return fetch('assets/palettes/samplePalettes.json')
//     .then(response => {
//       if (!response.ok) throw new Error('Failed to load sample palettes');
//       return response.json();
//     })
//     .then(data => {
//       samplePalettes = data;
//     })
//     .catch(error => {
//       console.error(error);
//       samplePalettes = [];
//     });
// };

// window.loadPalettes = function() {
//   const paletteGrid = document.querySelector('.palette-grid');
//   if (!paletteGrid) return;
//   paletteGrid.innerHTML = '';
//   const allPalettes = getAllPalettes();
//   allPalettes.forEach(palette => {
//     const paletteCard = createPaletteCard(palette);
//     paletteGrid.appendChild(paletteCard);
//   });
// };

// window.createPaletteCard = function(palette) {
//   const card = document.createElement('div');
//   card.className = 'palette-card';

//   const header = document.createElement('div');
//   header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem';

//   const title = document.createElement('h3');
//   title.textContent = palette.name;

//   const isCustomPalette = !samplePalettes.some(sample => sample.name === palette.name);
//   if (isCustomPalette) {
//     const deleteBtn = document.createElement('button');
//     deleteBtn.textContent = '×';
//     deleteBtn.className = 'delete-palette-btn';
//     deleteBtn.title = 'Delete palette';
//     deleteBtn.addEventListener('click', () => {
//       if (confirm(`Are you sure you want to delete "${palette.name}"?`)) {
//         deletePalette(palette.name);
//       }
//     });
//     header.appendChild(title);
//     header.appendChild(deleteBtn);
//   } else {
//     header.appendChild(title);
//   }

//   const colorRow = document.createElement('div');
//   colorRow.className = 'color-row';

//   palette.colors.forEach(color => {
//     const swatch = document.createElement('div');
//     swatch.className = 'color-swatch';
//     swatch.style.backgroundColor = color;
//     swatch.textContent = color;
    
//     swatch.addEventListener('click', () => {
//       navigator.clipboard.writeText(color);
//       const originalText = swatch.textContent;
//       swatch.textContent = 'Copied!';
//       setTimeout(() => {
//         swatch.textContent = originalText;
//       }, 1000);
//     });
//     colorRow.appendChild(swatch);
//   });

//   card.appendChild(header);
//   card.appendChild(colorRow);
//   return card;
// };

// // ========== PRIVATE FUNCTIONS ==========
// function savePalettes(palettes) {
//   localStorage.setItem('colorPalettes', JSON.stringify(palettes));
// }

// function loadSavedPalettes() {
//   const saved = localStorage.getItem('colorPalettes');
//   return saved ? JSON.parse(saved) : [];
// }

// function getAllPalettes() {
//   const savedPalettes = loadSavedPalettes();
//   const allPalettes = [...samplePalettes];
//   savedPalettes.forEach(savedPalette => {
//     if (!allPalettes.some(palette => palette.name === savedPalette.name)) {
//       allPalettes.push(savedPalette);
//     }
//   });
//   return allPalettes;
// }

// function deletePalette(paletteName) {
//   const savedPalettes = loadSavedPalettes();
//   const updatedPalettes = savedPalettes.filter(palette => palette.name !== paletteName);
//   savePalettes(updatedPalettes);
//   loadPalettes();
// }

// function addPalette() {
//   const name = prompt('Enter palette name:');
//   if (name) {
//     const existingPalettes = getAllPalettes();
//     if (existingPalettes.some(palette => palette.name === name)) {
//       alert('A palette with this name already exists. Please choose a different name.');
//       return;
//     }
//     const colors = [];
//     for (let i = 0; i < 6; i++) {
//       const colorCode = prompt(`Enter color ${i + 1} (hex code without #):`);
//       if (colorCode) {
//         if (/^[0-9A-F]{6}$/i.test(colorCode)) {
//           colors.push('#' + colorCode);
//         } else {
//           alert(`Invalid hex code: ${colorCode}. Please use 6-character hex codes (e.g., ff6b35)`);
//           return;
//         }
//       }
//     }
//     if (colors.length > 0) {
//       const newPalette = { name, colors };
//       const savedPalettes = loadSavedPalettes();
//       savedPalettes.push(newPalette);
//       savePalettes(savedPalettes);
//       loadPalettes();
//       alert(`Palette "${name}" saved successfully!`);
//     }
//   }
// }

// function getExportData() {
//   const palettes = getAllPalettes();
//   const moodboard = window.moodBoardItems || [];
//   return { palettes, moodboard };
// }

// window.saveDataAsJSON = function() {
//   const data = getExportData();
//   const json = JSON.stringify(data, null, 2);
//   const blob = new Blob([json], { type: "application/json" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "palette_moodboard.json";
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
//   URL.revokeObjectURL(url);
// };

// // ========== EVENT LISTENERS ==========
// document.addEventListener('DOMContentLoaded', () => {
//   document.getElementById('add-palette')?.addEventListener('click', addPalette);
//   document.getElementById('save-json')?.addEventListener('click', window.saveDataAsJSON);
//   document.getElementById('import-json-btn')?.addEventListener('click', () => {
//     document.getElementById('import-json').click();
//   });
  
//   document.getElementById('import-json')?.addEventListener('change', function(event) {
//     const file = event.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = function(e) {
//       try {
//         const data = JSON.parse(e.target.result);
//         if (data.palettes && Array.isArray(data.palettes)) {
//           const sampleNames = (window.samplePalettes || []).map(p => p.name);
//           const customPalettes = data.palettes.filter(p => !sampleNames.includes(p.name));
//           localStorage.setItem('colorPalettes', JSON.stringify(customPalettes));
//         }
//         if (data.moodboard && Array.isArray(data.moodboard)) {
//           localStorage.setItem('moodBoardItems', JSON.stringify(data.moodboard));
//         }
//         window.loadPalettes?.();
//         window.loadMoodBoard?.();
//         alert('Import successful!');
//       } catch (err) {
//         alert('Invalid JSON file.');
//       }
//     };
//     reader.readAsText(file);
//   });
// });
