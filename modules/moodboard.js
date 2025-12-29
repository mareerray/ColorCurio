// modules/moodboard.js - COMPLETE & FIXED
let moodBoardItems = [];

// ========== PUBLIC FUNCTIONS ==========
window.loadMoodBoard = async function() {
  moodBoardItems = loadMoodBoardItems();
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
  if (!window.moodBoardItems.some(item => item.isSample)) {
    window.moodBoardItems.slice(0, 3).forEach((item, idx) => {
      item.isSample = true;
    });
    saveMoodBoardItems(window.moodBoardItems);
  }
  
  renderMoodBoard();
};

window.renderMoodBoard = function() {
  const moodGrid = document.querySelector('.mood-grid');
  if (!moodGrid) return;
  moodGrid.innerHTML = '';
  moodBoardItems.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'mood-item';
    div.innerHTML = `
      <img class="mood-image" src="assets/images/${item.filename}" alt="${item.caption || ''}">
      <div class="mood-content">${item.caption || ''}</div>
      <button class="delete-mood-item" data-index="${index}" title="Delete this image">&times;</button>
    `;
    div.className = `mood-item ${item.isSample ? 'sample-item' : 'custom-item'}`;
    div.setAttribute('data-is-sample', item.isSample || false);

    moodGrid.appendChild(div);
  });

  // Delete buttons
  document.querySelectorAll('.delete-mood-item').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const idx = parseInt(btn.getAttribute('data-index'));
      
      // CHECK if it's a SAMPLE item (disable delete)
      if (window.isSampleMoodItem?.(idx)) {
        e.stopPropagation();
        alert('Sample images cannot be deleted. Add your own images to edit!');
        return;
      }
      
      // Normal delete for custom items
      window.moodBoardItems.splice(idx, 1);
      saveMoodBoardItems(window.moodBoardItems);
      renderMoodBoard();
    });
  });
};

window.setupLightbox = function() {
  const overlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');

  if (!overlay || !lightboxImg) return;

  // Image click → lightbox
  document.querySelector('.mood-grid')?.addEventListener('click', function(e) {
    if (e.target.classList.contains('mood-image')) {
      lightboxImg.src = e.target.src;
      lightboxCaption.textContent = e.target.closest('.mood-item')?.querySelector('.mood-content').textContent || '';
      overlay.style.display = 'flex';
    }
  });

  // Close lightbox
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

// ========== PRIVATE FUNCTIONS ==========
function saveMoodBoardItems(items) {
  localStorage.setItem('moodBoardItems', JSON.stringify(items));
}

function loadMoodBoardItems() {
  const saved = localStorage.getItem('moodBoardItems');
  return saved ? JSON.parse(saved) : [];
}

function addMoodItem() {
  const filename = prompt('Enter image filename in assets/images/ (e.g., mood1.jpg):');
  if (!filename) return;
  const caption = prompt('Enter a caption for this inspiration (optional):');
  moodBoardItems.push({ filename, caption });
  saveMoodBoardItems(moodBoardItems);
  renderMoodBoard();
}

// Make private functions global
window.addMoodItem = addMoodItem;
window.moodBoardItems = moodBoardItems;  // For export

// ========== EVENT LISTENERS ==========
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('add-mood-item')?.addEventListener('click', addMoodItem);
});

