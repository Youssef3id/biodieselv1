/* ======================
   DOCUMENT READY HANDLER
   ====================== */
document.addEventListener('DOMContentLoaded', () => {
  
  /* ======================
     COUNTER ANIMATION
     ====================== */
  const counters = document.querySelectorAll('.counter');
  const duration = 2000;
  const frameRate = 1000 / 60; // 60fps

  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const increment = target / (duration / frameRate);

    const updateCounter = () => {
      count += increment;
      if (count < target) {
        counter.innerText = Math.floor(count).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };

    updateCounter();
  };

  /* ======================
     INTERSECTION OBSERVER
     ====================== */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        
        const counter = entry.target.querySelector('.counter');
        if (counter) {
          animateCounter(counter);
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  // Observe elements
  document.querySelectorAll('.hero-section, .card').forEach(element => {
    observer.observe(element);
  });

  /* ======================
     SIDEBAR NAVIGATION
     ====================== */
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });

});