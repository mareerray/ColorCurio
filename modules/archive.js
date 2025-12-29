// ARCHIVE.JS - Uses your existing palette-grid styling
let samplePalettes = [];

window.loadArchive = async function() {
  const grid = document.querySelector('#archive .palette-grid');
  const search = document.getElementById('archive-search');
  const count = document.getElementById('archive-count');
  const clearBtn = document.getElementById('clear-search');
  
  if (!grid) return;
  
  // Load samples
  try {
    const response = await fetch('assets/palettes/samplePalettes.json');
    samplePalettes = await response.json();
    renderArchive(samplePalettes);
    updateCount(samplePalettes.length);
  } catch (error) {
    console.error('Archive failed:', error);
    grid.innerHTML = '<p>No palettes found</p>';
  }
  
  // Search
  search.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = samplePalettes.filter(p => 
      p.name.toLowerCase().includes(term)
    );
    renderArchive(filtered);
    updateCount(filtered.length);
  });
  
  // Clear search
  clearBtn.addEventListener('click', () => {
    search.value = '';
    renderArchive(samplePalettes);
    updateCount(samplePalettes.length);
  });
};

function renderArchive(palettes) {
  const grid = document.querySelector('#archive .palette-grid');
  grid.innerHTML = palettes.map(palette => createArchiveCard(palette)).join('');
  
  // Add copy functionality to swatches
  grid.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('click', () => copyColor(swatch));
  });
}

function createArchiveCard(palette) {
  return `
    <div class="palette-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <h3>${palette.name}</h3>
        <span style="font-size: 0.8rem; opacity: 0.7;">Sample</span>
      </div>
      <div class="color-row">
        ${palette.colors.map(color => 
          `<div class="color-swatch" data-color="${color}" style="background-color: ${color}">${color}</div>`
        ).join('')}
      </div>
    </div>
  `;
}

function copyColor(swatch) {
  const color = swatch.dataset.color;
  navigator.clipboard.writeText(color).then(() => {
    const original = swatch.textContent;
    swatch.textContent = 'Copied!';
    setTimeout(() => swatch.textContent = original, 1000);
  });
}

function updateCount(num) {
  document.getElementById('archive-count').textContent = num;
}

// Init - Load when tab clicked OR page loads on archive
document.addEventListener('DOMContentLoaded', () => {
  // Load archive when tab button clicked
  document.querySelectorAll('.tab-btn[data-tab="archive"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Small delay to ensure tab is active
      setTimeout(() => {
        if (document.querySelector('.tab-content.active')?.id === 'archive') {
          window.loadArchive();
        }
      }, 50);
    });
  });
  
  // ALSO load if page opens directly on archive
  if (document.querySelector('.tab-content.active')?.id === 'archive') {
    window.loadArchive();
  }
});