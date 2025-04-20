// Smooth Scroll
newFunction();

function newFunction() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
      // Close mobile menu if open
      document.querySelector('.nav-links').classList.remove('active');
    });
  });

  // Sticky Nav on Scroll
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile Menu Toggle
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container') && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
    }
  });

  // Fade-in Animations on Scroll (same as before)
  const fadeIns = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });
  fadeIns.forEach(fadeIn => {
    observer.observe(fadeIn);
  });



  // Dark Mode Toggle
  const darkModeToggle = document.getElementById('darkmode-toggle');
  const body = document.body;

  // Check user preference + localStorage
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedMode = localStorage.getItem('darkMode');

  // Initialize dark mode
  if (savedMode === 'enabled' || (prefersDarkMode && savedMode !== 'disabled')) {
    body.classList.add('dark-mode');
    darkModeToggle.checked = true;
  }

  // Toggle dark mode
  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    } else {
      body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    }
  });




  // Hero Slideshow Functionality
  document.addEventListener('DOMContentLoaded', function () {
    const slides = document.querySelectorAll('.hero-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    const slideInterval = 5000; // 5 seconds

    function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));

      slides[index].classList.add('active');
      indicators[index].classList.add('active');
      currentSlide = index;
    }

    function nextSlide() {
      let newIndex = (currentSlide + 1) % slides.length;
      showSlide(newIndex);
    }

    // Auto-advance slides
    let slideTimer = setInterval(nextSlide, slideInterval);

    // Pause on hover
    const slideshow = document.querySelector('.slideshow-container');
    slideshow.addEventListener('mouseenter', () => clearInterval(slideTimer));
    slideshow.addEventListener('mouseleave', () => {
      slideTimer = setInterval(nextSlide, slideInterval);
    });

    // Click indicators to navigate
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        clearInterval(slideTimer);
        showSlide(index);
        slideTimer = setInterval(nextSlide, slideInterval);
      });
    });
  });


  // Update your existing social media JS with dark mode support
  const setupSocialEmbeds = () => {
    // Twitter Embed with Theme Control
    const loadTwitter = () => {
      const tweetEmbed = `
      <blockquote class="twitter-tweet"><p lang="en" dir="ltr">stop saying, just show it</p>&mdash; Charlie (@charlsuuu_des) <a href="https://twitter.com/charlsuuu_des/status/1184837977937076224?ref_src=twsrc%5Etfw">October 17, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    `;
      document.getElementById('twitter-embed').innerHTML = tweetEmbed;

      if (window.twttr) {
        window.twttr.widgets.load();
      } else {
        const script = document.createElement('script');
        script.src = "https://platform.twitter.com/widgets.js";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    // Optimized GitHub Slider
    const loadGitHub = newFunction();
    // LinkedIn Badge with Theme Control
    const loadLinkedIn = () => {
      const theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      const linkedinEmbed = document.getElementById('linkedin-embed');
      linkedinEmbed.innerHTML = `
      <div class="LI-profile-badge" 
           data-version="v1" 
           data-size="large" 
           data-locale="en_US" 
           data-type="vertical" 
           data-theme="${theme}" 
           data-vanity="your-linkedin-id">
      </div>
    `;

      if (window.LI) {
        window.LI.init();
      } else {
        const script = document.createElement('script');
        script.src = "https://platform.linkedin.com/badges/js/profile.js";
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    };

    // Watch for dark mode changes
    const darkModeObserver = new MutationObserver(() => {
      loadTwitter();
      loadLinkedIn();
    });

    darkModeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Initial load
    loadTwitter();
    loadGitHub();
    loadLinkedIn();

    function newFunction() {
      const loadGitHub = async () => {
        try {
          const response = await fetch('https://api.github.com/users/Tohbuu/repos?sort=updated&per_page=1');
          const repos = await response.json();

          const sliderContent = repos.map(repo => `
      <div class="repo-slide">
        <a href="${repo.html_url}" target="_blank" class="repo-name">${repo.name}</a>
        <p class="repo-desc">${repo.description || ''}</p>
        <div class="repo-meta">
          <span>${repo.language || ''}</span>
          <span>★ ${repo.stargazers_count}</span>
        </div>
      </div>
    `).join('');

          document.getElementById('github-activity').innerHTML = `
      <div class="repo-slider">
        ${sliderContent}
      </div>
      <div class="slider-dots"></div>
    `;

          initSlider();
        } catch (error) {
          document.getElementById('github-activity').innerHTML = '<p>Failed to load GitHub activity</p>';
        }
      };

      // Minimal Slider Logic
      const initSlider = () => {
        const slider = document.querySelector('.repo-slider');
        const slides = document.querySelectorAll('.repo-slide');
        if (!slides.length) return;

        let currentIndex = 0;
        const dotsContainer = document.querySelector('.slider-dots');

        // Create dots
        slides.forEach((_, i) => {
          dotsContainer.innerHTML += `<span class="dot" data-index="${i}"></span>`;
        });

        const dots = document.querySelectorAll('.dot');
        dots[0].classList.add('active');

        // Auto-slide every 3 seconds
        const slideInterval = setInterval(() => {
          currentIndex = (currentIndex + 1) % slides.length;
          updateSlider();
        }, 3000);

        // Pause on hover
        slider.parentElement.addEventListener('mouseenter', () => clearInterval(slideInterval));
        slider.parentElement.addEventListener('mouseleave', () => {
          slideInterval = setInterval( /* same interval logic */);
        });

        function updateSlider() {
          slider.style.transform = `translateX(-${currentIndex * 100}%)`;
          dots.forEach(dot => dot.classList.remove('active'));
          dots[currentIndex].classList.add('active');
        }
      };
      return loadGitHub;
    }
  };

  document.addEventListener('DOMContentLoaded', setupSocialEmbeds);
}







// Add this script
document.addEventListener('DOMContentLoaded', function() {
  // Get elements
  const websiteLink = document.querySelector('a[href="#website"]');
  const popup = document.getElementById('websitePopup');
  const closeBtn = document.querySelector('.close-popup');
  
  // Show popup when clicking the link
  if(websiteLink) {
    websiteLink.addEventListener('click', function(e) {
      e.preventDefault();
      popup.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
  }
  
  // Close popup
  if(closeBtn) {
    closeBtn.addEventListener('click', function() {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto';
    });
  }
  
  // Close when clicking outside content
  popup.addEventListener('click', function(e) {
    if(e.target === popup) {
      popup.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });
});