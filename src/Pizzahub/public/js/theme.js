document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    const body = document.body;
  
    // Load saved preference
    if (localStorage.getItem('theme') === 'dark') {
      body.classList.add('dark-mode');
    }
  
    toggle.addEventListener('click', () => {
      body.classList.toggle('dark-mode');
      const newTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
    });
  });
  