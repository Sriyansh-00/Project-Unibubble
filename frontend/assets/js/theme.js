const toggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  toggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem('darkMode', isDark);
}

// Initialize
const storedPreference = localStorage.getItem('darkMode');
if (storedPreference !== null) {
  setTheme(storedPreference === 'true');
} else {
  setTheme(prefersDark.matches);
}

// Toggle handler
toggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'dark';
  setTheme(isDark);
});

// Watch system preference changes
prefersDark.addListener(e => {
  if (localStorage.getItem('darkMode') === null) {
    setTheme(e.matches);
  }
});