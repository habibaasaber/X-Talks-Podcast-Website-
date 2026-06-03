/* ==========================================================================
   X Talks Podcast - Core Interactive Script
   Developer: Habiba Saber | Host: Abdelrahman Hossam
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initScrollReveal();
  initSearchAndFilters();
});

/**
 * 1. Sticky Navigation Effect
 * Adds a background blur and shadow when scrolled
 */
function initStickyHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run on load and scroll
  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

/**
 * 2. Mobile Hamburger Menu Toggle
 */
function initMobileNav() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navToggle || !navMenu) return;

  const toggleMenu = () => {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    
    // Toggle body scroll locking when menu is open
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  };

  const closeMenu = () => {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  navToggle.addEventListener('click', toggleMenu);

  // Close mobile menu when links are clicked
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu on resize if screen gets wider than tablet breakpoint
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/**
 * 3. Scroll Reveal Animations (using Intersection Observer)
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      threshold: 0.12, // Trigger when 12% of the element is visible
      rootMargin: '0px 0px -40px 0px' // Slightly offset trigger point
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Stop tracking once visible
        }
      });
    }, observerOptions);

    revealElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback if browser does not support Intersection Observer
    revealElements.forEach(element => {
      element.classList.add('visible');
    });
  }
}

/**
 * 4. Search and Guest Filter Logic (Runs on episodes.html)
 */
function initSearchAndFilters() {
  const searchInput = document.getElementById('episode-search');
  const filterTags = document.querySelectorAll('#filter-tags .filter-tag');
  const episodeGrid = document.getElementById('episodes-grid-page');
  const noResults = document.getElementById('no-results');
  const resetBtn = document.getElementById('reset-search');

  // Only run this logic on the page that has the search elements
  if (!episodeGrid) return;

  const episodeCards = episodeGrid.querySelectorAll('.episode-card');
  let activeFilter = 'all';
  let searchQuery = '';

  const filterEpisodes = () => {
    let visibleCount = 0;

    episodeCards.forEach(card => {
      const titleElement = card.querySelector('.card-title');
      const guestElement = card.querySelector('.card-guest');
      
      const titleText = titleElement ? titleElement.textContent.toLowerCase() : '';
      const guestText = guestElement ? guestElement.textContent.toLowerCase() : '';
      const cardGuestAttr = card.getAttribute('data-guest') || '';
      
      // Check search match (in title or guest name)
      const matchesSearch = titleText.includes(searchQuery) || guestText.includes(searchQuery);
      
      // Check filter badge match
      const matchesFilter = activeFilter === 'all' || cardGuestAttr.toLowerCase().trim() === activeFilter.toLowerCase().trim();

      if (matchesSearch && matchesFilter) {
        card.style.display = '';
        // If they matching, make sure reveal animations trigger nicely
        card.classList.add('visible');
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Toggle Empty State
    if (visibleCount === 0) {
      episodeGrid.style.display = 'none';
      noResults.style.display = 'flex';
    } else {
      episodeGrid.style.display = '';
      noResults.style.display = 'none';
    }
  };

  // Bind Search Input Event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterEpisodes();
    });
  }

  // Bind Badge Filter Clicks
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      // Remove active from all badges, add to clicked
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');

      activeFilter = tag.getAttribute('data-filter');
      filterEpisodes();
    });
  });

  // Bind Clear/Reset Button click
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      // Clear inputs
      if (searchInput) searchInput.value = '';
      searchQuery = '';

      // Reset badges
      filterTags.forEach(t => t.classList.remove('active'));
      const allTag = document.querySelector('#filter-tags [data-filter="all"]');
      if (allTag) allTag.classList.add('active');
      activeFilter = 'all';

      // Re-filter
      filterEpisodes();
    });
  }
}
