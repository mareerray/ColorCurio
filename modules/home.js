document.addEventListener("DOMContentLoaded", function() {
  // Show only home on load
  document.querySelectorAll(".tab-content").forEach(tab => {
    tab.style.display = "none";
  });
  document.getElementById("home").style.display = "block";

  // Tab switching - SIMPLE VERSION
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", function(e) {
      e.preventDefault();
      const targetTab = btn.dataset.tab;

      // Hide all, show one
      document.querySelectorAll(".tab-content").forEach(tab => {
        tab.style.display = "none";
      });
      document.getElementById(targetTab).style.display = "block";

      // Update active button
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
});

