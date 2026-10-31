document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const targetTab = btn.dataset.tab;

      document.querySelectorAll(".tab-content").forEach(tab => {
        tab.classList.remove("active");
      });

      document.getElementById(targetTab).classList.add("active");

      document.querySelectorAll(".tab-btn").forEach(button => {
        button.classList.remove("active");
      });

      btn.classList.add("active");
    });
  });
});
