import {
  resetPagination,
  paginate,
  renderPagination
} from './pagination.js';

import { loadPalettes } from './paletteData.js';

let samplePalettes = [];
const FAVORITES_STORAGE_KEY = 'colorcurio-favorites-palettes';

let currentArchiveFilter = 'all';
let favoritePaletteNames = loadFavoritePaletteNames();

// The five color roles used by ColorCurio.
// The order matters because it matches the order of colors in the JSON file.
const PALETTE_ROLES = [
  'base',
  'accent',
  'support',
  'deep support',
  'extra'
];

// Turns palette roles into CSS variable names.
const CSS_VARIABLE_NAMES = {
  'base': 'color-background',
  'accent': 'color-primary',
  'support': 'color-surface',
  'deep support': 'color-text',
  'extra': 'color-secondary'
};

function loadFavoritePaletteNames() {
  try {
    const saved = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Could not load favorite palettes:', error);
    return [];
  }
}

function saveFavoritePaletteNames() {
  localStorage.setItem(
    FAVORITES_STORAGE_KEY,
    JSON.stringify(favoritePaletteNames)
  );
}

function isFavorite(palette) {
  return favoritePaletteNames.includes(palette.name);
}

function toggleFavorite(paletteName) {
  if (favoritePaletteNames.includes(paletteName)) {
    favoritePaletteNames = favoritePaletteNames.filter(
      (name) => name !== paletteName
    );
  } else {
    favoritePaletteNames.push(paletteName);
  }

  saveFavoritePaletteNames();
}

function getVisiblePalettes() {
  const search = document.getElementById('archive-search');
  const searchTerm = search.value.toLowerCase();

  let palettes = samplePalettes;

  // If "My favorites" is selected, show only favorite palettes.
  if (currentArchiveFilter === 'favorites') {
    palettes = palettes.filter((palette) =>
      favoritePaletteNames.includes(palette.name)
    );
  }

  // Then filter by the search text.
  if (searchTerm) {
    palettes = palettes.filter((palette) =>
      palette.name.toLowerCase().includes(searchTerm)
    );
  }

  return palettes;
}

function updateArchiveView() {
  const visiblePalettes = getVisiblePalettes();
  const { items, totalPages } = paginate(visiblePalettes);

  renderArchive(items);
  renderPagination(visiblePalettes.length, totalPages, updateArchiveView);
  updateCount(visiblePalettes.length);
}

window.loadArchive = async function () {
  const grid = document.querySelector('#archive .palette-grid');
  const search = document.getElementById('archive-search');
  const count = document.getElementById('archive-count');
  const clearBtn = document.getElementById('clear-search');

  if (!grid) return;

  // Load the palette data
  try {
    samplePalettes = await loadPalettes();
    updateArchiveView();
  } catch (error) {
    console.error('Archive failed:', error);
    grid.innerHTML = '<p>No palettes found</p>';
  }
  
  // Search palettes by name
  search.addEventListener('input', () => {
    resetPagination();
    updateArchiveView();
  });

  // Clear the search box
  clearBtn.addEventListener('click', () => {
    search.value = '';
    resetPagination();
    updateArchiveView();
  })

  // Filter between all palettes and favorites
  const filterButtons = document.querySelectorAll('.archive-filter');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentArchiveFilter = button.dataset.filter;

      filterButtons.forEach((item) =>
        item.classList.remove('is-active')
      );

      button.classList.add('is-active');
      resetPagination();
      updateArchiveView();
    });
  });
};

function renderArchive(palettes) {
  const grid = document.querySelector('#archive .palette-grid');

  // Create one card for every palette
  grid.innerHTML = palettes
    .map((palette) => createArchiveCard(palette))
    .join('');

  // Copy one color when a swatch is clicked
  grid.querySelectorAll('.color-swatch').forEach((swatch) => {
    swatch.addEventListener('click', () => copyColor(swatch));
  });

  // Copy CSS or JSON when an action button is clicked
  grid.querySelectorAll('.palette-action').forEach((button) => {
    button.addEventListener('click', () => {
      const paletteName = button.dataset.paletteName;

      const palette = samplePalettes.find(
        (item) => item.name === paletteName
      );

      if (!palette) return;

      if (button.dataset.action === 'copy-css') {
        copyText(
          createCssVariables(palette),
          button,
          'CSS copied!'
        );
      }

      if (button.dataset.action === 'copy-json') {
        copyText(
          createPaletteJson(palette),
          button,
          'JSON copied!'
        );
      }
    });
  });

    // Add or remove a palette from favorites
  grid.querySelectorAll('.favorite-button').forEach((button) => {
    button.addEventListener('click', () => {
      const paletteName = button.dataset.paletteName;

      toggleFavorite(paletteName);
      updateArchiveView();
    });
  });
}

function createArchiveCard(palette) {
  return `
    <div class="palette-card">
      <div class="palette-card-header">
        <h3>${palette.name}</h3>

        <button
          type="button"
          class="favorite-button ${isFavorite(palette) ? 'is-favorite' : ''}"
          data-palette-name="${palette.name}"
          aria-pressed="${isFavorite(palette)}"
          aria-label="${isFavorite(palette) ? 'Remove from favorites' : 'Add to favorites'}"
        >
          <i
            class="bi ${isFavorite(palette) ? 'bi-heart-fill' : 'bi-heart'}"
            aria-hidden="true"
          ></i>
        </button>
      </div>

      <div class="color-row">
        ${palette.colors
          .map(
            (color) => `
              <button
                type="button"
                class="color-swatch"
                data-color="${color}"
                style="background-color: ${color}"
                aria-label="Copy ${color}"
              >
                <span class="swatch-label">${color}</span>
              </button>
            `
          )
          .join('')}
      </div>
      
      <div class="palette-actions">
        <button
          type="button"
          class="palette-action"
          data-action="copy-css"
          data-palette-name="${palette.name}"
        >
          <i class="bi bi-clipboard" aria-hidden="true"></i>
          Copy CSS
        </button>

        <button
          type="button"
          class="palette-action"
          data-action="copy-json"
          data-palette-name="${palette.name}"
        >
          <i class="bi bi-braces" aria-hidden="true"></i>
          Copy JSON
        </button>
      </div>
    </div>
  `;
}

// Turns ["#FFF7ED", "#A64B38", ...] into labeled color objects.
function getPaletteRoles(palette) {
  return palette.colors.map((hex, index) => {
    return {
      role: PALETTE_ROLES[index],
      hex: hex
    };
  });
}

// Creates the JSON text that will be copied.
function createPaletteJson(palette) {
  const paletteData = {
    name: palette.name,
    colors: getPaletteRoles(palette)
  };

  // null, 2 makes the JSON easy to read with indentation.
  return JSON.stringify(paletteData, null, 2);
}

// Creates the CSS text that will be copied.
function createCssVariables(palette) {
  const variables = getPaletteRoles(palette)
    .map(({ role, hex }) => {
      const cssName = CSS_VARIABLE_NAMES[role];
      return `  --${cssName}: ${hex.toLowerCase()};`;
    })
    .join('\n');

  return `/* Palette: ${palette.name} */
:root {
${variables}
}`;
}

// Copies any text and shows feedback on the clicked button.
function copyText(text, button, successMessage) {
  navigator.clipboard.writeText(text).then(() => {
    const originalButtonContent = button.innerHTML;

    button.innerHTML = successMessage;

    setTimeout(() => {
      button.innerHTML = originalButtonContent;
    }, 1200);
  });
}

// Keeps your existing single-color copy behavior.
function copyColor(swatch) {
  const color = swatch.dataset.color;

  navigator.clipboard.writeText(color).then(() => {
    const originalText = swatch.textContent;

    swatch.textContent = 'Copied!';

    setTimeout(() => {
      swatch.textContent = originalText;
    }, 1000);
  });
}

function updateCount(number) {
  document.getElementById('archive-count').textContent = number;
}

// Init - Load when tab clicked OR page loads on archive
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn[data-tab="archive"]').forEach((button) => {
    button.addEventListener('click', () => {
      setTimeout(() => {
        const activeTab = document.querySelector('.tab-content.active');

        if (activeTab?.id === 'archive') {
          window.loadArchive();
        }
      }, 50);
    });
  });

  const activeTab = document.querySelector('.tab-content.active');

  if (activeTab?.id === 'archive') {
    window.loadArchive();
  }
});