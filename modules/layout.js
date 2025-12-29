// Layout & Navigation
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      
      // Remove active classes FIRST
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      // NO SCROLL - let CSS handle positioning!
      
      // Activate new tab
      btn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
      
      // Lazy load tab content
      if (tabId === 'palettes') loadSamplePalettes().then(() => loadPalettes());
      if (tabId === 'moodboard') loadMoodBoard();
    });
  });
});


