// FINAL MOODBOARD - With hex display, copy, and export features
let moodBoardItems = [];
const MAX_IMAGES = 15;
const STORAGE_LIMIT_MB = 5;

// ========== PUBLIC FUNCTIONS ==========
// Save to localStorage
function saveMoodBoardItems(items) {
  try {
    localStorage.setItem('moodBoardItems', JSON.stringify(items));
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      alert('Storage is full! Please delete some images to continue.\n\nTip: Each image takes storage space. Keep your collection under 15 images.');
    }
  }
}

// Load from localStorage
function loadMoodBoardItems() {
  const saved = localStorage.getItem('moodBoardItems');
  return saved ? JSON.parse(saved) : [];
}

window.loadMoodBoard = async function() {
  // 1) Try localStorage
  moodBoardItems = loadMoodBoardItems();

  // 2) If empty → load sample JSON once
  if (!moodBoardItems || moodBoardItems.length === 0) {
    try {
      const response = await fetch('assets/moodboard/sampleMoodBoard.json');
      moodBoardItems = await response.json();
      saveMoodBoardItems(moodBoardItems);
    } catch (error) {
      console.error('Failed to load sample moodboard:', error);
      moodBoardItems = [];
    }
  }

  // 3) Ensure some items are marked as samples (safe if JSON already has isSample)
  if (!moodBoardItems.some(item => item.isSample)) {
    moodBoardItems.slice(0, 3).forEach(item => { item.isSample = true; });
    saveMoodBoardItems(moodBoardItems);
  }

  renderMoodBoard();
  updateStorageInfo();
};


window.renderMoodBoard = function() {
  const moodGrid = document.querySelector('.mood-grid');
  if (!moodGrid) return;
  moodGrid.innerHTML = '';
  
  moodBoardItems.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = `mood-item ${item.isSample ? 'sample-item' : 'custom-item'}`;
    div.setAttribute('data-index', index);
    
    const imageSrc = item.imageData 
      ? item.imageData 
      : `assets/images/${item.filename}`;
    
    div.innerHTML = `
      <img class="mood-image" src="${imageSrc}" alt="${item.caption || ''}" crossorigin="anonymous">
      <div class="mood-content">${item.caption || ''}</div>
      
      ${item.colors ? `
        <div class="mood-colors">
          ${item.colors.map(color => `
            <div class="mini-swatch" data-color="${color}" style="background-color: ${color}" title="Click to copy ${color}">
              <span class="hex-label">${color}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      <button class="delete-mood-item" data-index="${index}" title="Delete this image">&times;</button>
    `;
    
    moodGrid.appendChild(div);
    
    // Add right-click context menu for export
    div.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      exportImageWithPalette(index);
    });
  });

  // Delete buttons
  document.querySelectorAll('.delete-mood-item').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-index'));
      
      if (moodBoardItems[idx] && moodBoardItems[idx].isSample) {
        alert('Sample images cannot be deleted. Add your own images to customize!');
        return;
      }
      
      if (confirm('Delete this image?')) {
        moodBoardItems.splice(idx, 1);
        saveMoodBoardItems(moodBoardItems);
        renderMoodBoard();
        updateStorageInfo();
      }
    });
  });
  
  // Click to copy hex code
  document.querySelectorAll('.mini-swatch').forEach(swatch => {
    swatch.addEventListener('click', function(e) {
      e.stopPropagation();
      const color = swatch.getAttribute('data-color');
      copyToClipboard(color);
      
      // Visual feedback
      const originalContent = swatch.innerHTML;
      swatch.innerHTML = '<span class="hex-label">Copied!</span>';
      swatch.style.transform = 'scale(1.2)';
      
      setTimeout(() => {
        swatch.innerHTML = originalContent;
        swatch.style.transform = '';
      }, 1000);
    });
  });
};

async function exportImageWithPalette(index) {
  const item = moodBoardItems[index];
  if (!item) return;

  const download = confirm('Download image with palette?\n\nOK = Download exact display\nCancel = Copy colors');
  
  if (!download) {
    if (item.colors?.length > 0) {
      copyToClipboard(item.colors.join(', '));
      alert('✓ Colors copied!');
    }
    return;
  }

  // AUTO-FIND display element (tries common selectors)
  let displayElement;
  const selectors = [
    `[data-item="${index}"]`,
    `[data-index="${index}"]`,
    `#item-${index}`,
    `.item-${index}`,
    `.moodboard-item:nth-child(${index + 1})`,
    document.querySelectorAll('.moodboard-item, .item')[index]
  ];

  for (let sel of selectors) {
    displayElement = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (displayElement) {
      console.log('Found element with selector:', sel);
      break;
    }
  }

  if (!displayElement) {
    alert('No display element! Open console (F12) and check "All mood items" log.');
    return;
  }

  // Hide buttons temporarily
  const buttons = displayElement.querySelectorAll('button, .btn, .export');
  buttons.forEach(btn => btn.style.opacity = '0');

  try {
    const canvas = await html2canvas(displayElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Trim white space + exact bounds
    const trimmedCanvas = trimWhiteSpace(canvas);

    // Download trimmed
    trimmedCanvas.toBlob(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ColorCurio-${item.caption || index}-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      // alert('✓ Perfect crop exported!');
    });

    // alert('✓ Exact display exported!');
  } catch (err) {
    alert('Error: ' + err.message);
  } finally {
    buttons.forEach(btn => btn.style.opacity = '');
  }
}

// TRIM HELPER FUNCTION 
function trimWhiteSpace(canvas) {
  const ctx = canvas.getContext('2d');
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const tolerance = 10; // Allow near-white

  // Find crop bounds
  let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const i = (y * canvas.width + x) * 4;
      const r = data[i], g = data[i+1], b = data[i+2];
      if (r > 255-tolerance && g > 255-tolerance && b > 255-tolerance) continue;
      
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
  }
  
  if (minX > maxX) return canvas; // All white
  
  // Crop canvas
  const cropped = document.createElement('canvas');
  cropped.width = maxX - minX + 1;
  cropped.height = maxY - minY + 1;
  cropped.getContext('2d').drawImage(canvas, -minX, -minY);
  
  return cropped;
}

// Copy to clipboard helper
function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Copied:', text);
    }).catch(err => {
      console.error('Failed to copy:', err);
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

// Fallback copy method for older browsers
function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    console.log('Copied (fallback):', text);
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }
  document.body.removeChild(textarea);
}

// Upload image with 10-color detection
function addMoodItemWithUpload() {
  const customImages = moodBoardItems.filter(item => !item.isSample);
  if (customImages.length >= MAX_IMAGES) {
    alert(`Storage limit reached! You can upload maximum ${MAX_IMAGES} images.\n\nTip: Delete some images to add new ones.`);
    return;
  }
  
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  
  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      alert('Image is too large! Please use an image under 2MB.\n\nTip: Resize or compress your image before uploading.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
      const imageData = e.target.result;
      const caption = prompt('Enter a caption (optional):') || '';
      
      extractColorsFromImage(imageData, function(colors) {
        moodBoardItems.push({ 
          imageData: imageData,
          caption: caption,
          colors: colors,
          isSample: false
        });
        
        saveMoodBoardItems(moodBoardItems);
        renderMoodBoard();
        updateStorageInfo();
      });
    };
    
    reader.readAsDataURL(file);
  });
  
  fileInput.click();
}

function extractColorsFromImage(imageData, callback) {
  const img = new Image();
  img.onload = function() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 200;
    canvas.height = 200;
    ctx.drawImage(img, 0, 0, 200, 200);

    const imageDataObj = ctx.getImageData(0, 0, 200, 200);
    const pixels = imageDataObj.data;

    const colorCounts = {};

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const a = pixels[i + 3];
      if (a < 125) continue;

      const roundedR = Math.round(r / 8) * 8;
      const roundedG = Math.round(g / 8) * 8;
      const roundedB = Math.round(b / 8) * 8;

      const hex = rgbToHex(roundedR, roundedG, roundedB);
      colorCounts[hex] = (colorCounts[hex] || 0) + 1;
    }

    const allColorsSorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]);

    const selectedColors = [];

    // 1) Force‑pick up to 2 warm accents (gold / orange)
    const warmCandidates = allColorsSorted.filter(([hex, count]) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      const brightness = (r + g + b) / 3;

      // "Gold / warm" heuristic: red and green high, blue lower
      return (
        brightness > 120 &&
        r > 160 &&
        g > 130 &&
        b < 140 &&
        r >= g &&            // warm, not greenish
        count >= 3           // ignore pure noise
      );
    });

    warmCandidates.slice(0, 2).forEach(([hex]) => {
      if (!selectedColors.includes(hex)) {
        selectedColors.push(hex);
      }
    });

    // 2) Add the most common color if not already in
    if (allColorsSorted.length > 0 && !selectedColors.includes(allColorsSorted[0][0])) {
      selectedColors.push(allColorsSorted[0][0]);
    }

    // 3) Diversity selection for the remaining slots
    function tryFillWithThreshold(threshold) {
      for (let [hex, count] of allColorsSorted) {
        if (selectedColors.length >= 10) break;
        if (selectedColors.includes(hex)) continue;

        const minDist = Math.min(
          ...selectedColors.map(c => colorDistance(c, hex))
        );
        if (minDist > threshold) {
          selectedColors.push(hex);
        }
      }
    }

    tryFillWithThreshold(80);
    if (selectedColors.length < 10) tryFillWithThreshold(60);
    if (selectedColors.length < 10) tryFillWithThreshold(45);

    while (selectedColors.length < 10) {
      const hex = allColorsSorted[selectedColors.length]?.[0];
      if (hex && !selectedColors.includes(hex)) {
        selectedColors.push(hex);
      } else {
        selectedColors.push('#cccccc');
      }
    }

    console.log('FINAL COLORS:', selectedColors);
    callback(selectedColors);
  };

  img.src = imageData;
}

// Calculate color distance (how different two colors are)
function colorDistance(hex1, hex2) {
  const r1 = parseInt(hex1.slice(1, 3), 16);
  const g1 = parseInt(hex1.slice(3, 5), 16);
  const b1 = parseInt(hex1.slice(5, 7), 16);
  
  const r2 = parseInt(hex2.slice(1, 3), 16);
  const g2 = parseInt(hex2.slice(3, 5), 16);
  const b2 = parseInt(hex2.slice(5, 7), 16);
  
  // Manhattan distance - simple and effective
  return Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2);
}

// Helper: Convert RGB to Hex
function rgbToHex(r, g, b) {
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  
  return "#" + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  }).join('');
}

function updateStorageInfo() {
  const customImages = moodBoardItems.filter(item => !item.isSample);
  const storageInfo = document.getElementById('storage-info');
  
  if (storageInfo) {
    storageInfo.textContent = `${customImages.length}/${MAX_IMAGES} images uploaded`;
    
    if (customImages.length >= MAX_IMAGES - 2) {
      storageInfo.style.color = '#ff6b35';
      storageInfo.style.fontWeight = 'bold';
    } else {
      storageInfo.style.color = '';
      storageInfo.style.fontWeight = '';
    }
  }
}

window.setupLightbox = function() {
  const overlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxContent = document.getElementById('lightbox-content');
  const closeBtn = document.getElementById('lightbox-close');

  if (!overlay || !lightboxImg || !lightboxCaption) return;

  // Create palette container if missing
  if (!lightboxContent) {
    const contentDiv = document.createElement('div');
    contentDiv.id = 'lightbox-content';
    contentDiv.style.cssText = `
      display: flex; flex-direction: column; align-items: center; 
      padding: 20px; background: white; border-radius: 12px; 
      max-width: 90vw; max-height: 90vh; overflow: auto;
    `;
    lightboxCaption.parentNode.insertBefore(contentDiv, lightboxCaption.nextSibling);
  }

  document.querySelector('.mood-grid')?.addEventListener('click', function(e) {
    if (e.target.classList.contains('mood-image')) {
      const moodItem = e.target.closest('.mood-item');
      const index = Array.from(document.querySelectorAll('.mood-item')).indexOf(moodItem);
      
      if (index === -1 || !moodBoardItems[index]) return;
      
      const item = moodBoardItems[index];
      
      // Set image
      lightboxImg.src = e.target.src;
      lightboxImg.style.maxWidth = '100%';
      lightboxImg.style.borderRadius = '8px';
      
      // Set caption
      lightboxCaption.textContent = item.caption || '';
      
      // NEW: Build palette HTML
      // Only show palette if NOT a sample and colors exist
      if (!item.isSample && item.colors?.length) {
        const paletteHtml = `
          <div style="margin-top: 40px; padding: 15px; background: #f8f9fa; border-radius: 8px; width: 100%;">
            <h4 style="margin: 0 0 15px 0; text-align: center; color: #333;">Color Palette</h4>
            <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; max-width: 400px;">
              ${item.colors?.map(color => `
                <div style="
                  width: 50px; height: 50px; 
                  background: ${color}; 
                  border-radius: 8px; 
                  border: 3px solid white; 
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                  position: relative;
                ">
                  <span style="
                    position: absolute; bottom: -10px; left: 50%; 
                    transform: translateX(-50%); 
                    background: white; padding: 2px 6px; 
                    border-radius: 4px; font-size: 11px; 
                    font-weight: bold; color: #333; 
                    white-space: nowrap; box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                  ">${color}</span>
                </div>
              `).join('') || '<p style="text-align: center; color: #666;">No colors extracted</p>'}
            </div>
          </div>
        `;
      lightboxContent.innerHTML = paletteHtml;
      } else {
      lightboxContent.innerHTML = '';
      }
      overlay.style.display = 'flex';
    }
  });

  closeBtn?.addEventListener('click', () => {
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
};

// Make sure loadMoodBoard() runs on start
window.addMoodItem = addMoodItemWithUpload;
window.moodBoardItems = moodBoardItems;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-mood-item')
    ?.addEventListener('click', addMoodItemWithUpload);
  // load items + render grid
  loadMoodBoard();
});




