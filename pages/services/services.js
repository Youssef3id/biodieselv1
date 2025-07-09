// Collapse sidebar on resize
window.addEventListener("resize", function () {
  const sidebar = document.querySelector(".sidebar");
  if (window.innerWidth < 992) { // Changed to match Bootstrap's lg breakpoint
    sidebar.classList.add("d-none");
  } else {
    sidebar.classList.remove("d-none");
  }
});

// Toggle mobile menu
document.querySelector('[data-bs-toggle="offcanvas"]').addEventListener("click", function() {
  document.querySelector(".offcanvas").classList.toggle("show");
});

// Set active nav item
document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", function() {
    document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
    this.classList.add("active");
  });
});

// Initialize Lucide icons
if (window.lucide) {
  lucide.createIcons();
}

// Main initialization when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Add any additional initialization code here
});