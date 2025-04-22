// Theme toggle
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
});

// Set saved theme on load
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
});





fetch('http://localhost:5000/api/pizzas')
  .then(response => response.json())
  .then(data => {
    const pizzaContainer = document.querySelector('#pizza-container');
    data.forEach(pizza => {
      pizzaContainer.innerHTML += `
        <div class="pizza-card">
          <img src="${pizza.image_url}" alt="${pizza.name}" />
          <h3>${pizza.name}</h3>
          <p>${pizza.description}</p>
          <span>$${pizza.price}</span>
        </div>
      `;
    });
  })
  .catch(error => console.error('Error fetching pizzas:', error));
