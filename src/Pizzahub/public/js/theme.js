document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('themeToggle');
  const body = document.body;

  // Load saved preference
  const savedTheme = localStorage.getItem('theme') || 'light';
  body.classList.toggle('dark-mode', savedTheme === 'dark');
  document.documentElement.setAttribute('data-theme', savedTheme);

  toggle.addEventListener('click', () => {
    const newTheme = body.classList.toggle('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  });
});
