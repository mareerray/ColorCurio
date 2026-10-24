// Layout & Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;
    
    // Remove active classes FIRST
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    
    // Activate new tab
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');

    // Start the selected tab at the top
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
      
    // Lazy load tab content
    if (tabId === 'archive') {
      window.loadArchive?.();  // Archive samples
    } else if (tabId === 'palettes') {
      window.loadSamplePalettes?.().then(() => window.loadPalettes?.());
    } else if (tabId === 'moodboard') {
      window.loadMoodBoard?.();
    }
  });
});

// Footer: back to top
const backToTop = document.querySelector(".site-footer__top");

backToTop?.addEventListener("click", (event) => {
  event.preventDefault();

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: reduceMotion ? "instant" : "smooth",
  });
});

