document.addEventListener('DOMContentLoaded', function() {
    // FORCE hide all tabs except home on load
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById('home').classList.add('active');
    
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetTab = btn.dataset.tab;
            
            // Hide ALL tabs first
            document.querySelectorAll('.tab-content').forEach(tab => {
                tab.classList.remove('active');
                tab.style.display = 'none';  // Force hide
            });
            
            // Show ONLY target tab
            const targetElement = document.getElementById(targetTab);
            if (targetElement) {
                targetElement.classList.add('active');
                targetElement.style.display = 'block';  // Force show
                const headerHeight = 22 * 16;  // 22rem = 352px (adjust if needed)
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: "smooth"
                });
            }
            
            // Update active buttons
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
});

