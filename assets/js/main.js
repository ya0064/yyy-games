/**
 * 玩丫游戏 - Main JavaScript
 */

// Mobile menu toggle
function toggleMenu() {
  const nav = document.getElementById('main-nav');
  if (nav) {
    nav.classList.toggle('active');
  }
}

// Close mobile menu on resize
window.addEventListener('resize', function() {
  if (window.innerWidth > 768) {
    const nav = document.getElementById('main-nav');
    if (nav) {
      nav.classList.remove('active');
    }
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        img.classList.add('loaded');
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Search functionality
const searchInput = document.querySelector('.search-box input');
if (searchInput) {
  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      const query = this.value.trim();
      if (query) {
        // Redirect to search results page
        window.location.href = `/search?q=${encodeURIComponent(query)}`;
      }
    }
  });
}

// Dark mode toggle (for future use)
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
}

// Console branding
console.log(`
  🎮 玩丫游戏 - 全球单机游戏交流中心
  
  官方网站: https://bububuga.cc.cd
  GitHub: https://github.com/ya0064/games
  
  技术支持: Jekyll + GitHub Pages
`);