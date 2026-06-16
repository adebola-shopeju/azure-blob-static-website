// Azure Blob Storage Static Website — main.js
// Handles minor UI enhancements. No frameworks, no dependencies.

document.addEventListener('DOMContentLoaded', () => {

  // ── Fade-in cards on scroll ──
  const cards = document.querySelectorAll('.card, .info-block, .steps li');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      observer.observe(card);
    });
  }

  // ── Log deployment info to console ──
  console.log('%c☁️ Azure Static Website', 'color:#0078D4; font-size:1.2rem; font-weight:bold;');
  console.log('%cHosted on Azure Blob Storage — $web container', 'color:#5A6478;');
  console.log('%cEndpoint: https://mytestwebsite2025.z13.web.core.windows.net/', 'color:#50E6FF;');

});
