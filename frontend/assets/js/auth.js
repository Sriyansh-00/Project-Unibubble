// DOM Elements
const loginForm = document.getElementById('loginForm');
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

// Toggle password visibility
if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.innerHTML = type === 'password' ? 
      '<i class="fas fa-eye" aria-hidden="true"></i>' : 
      '<i class="fas fa-eye-slash" aria-hidden="true"></i>';
  });
}

// Form submission
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    // Simple validation
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    try {
      // Here you would typically make an API call to your backend
      // For demo purposes, we'll simulate a successful login
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      
      // Redirect to home page
      window.location.href = 'home.html';
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
  });
}

// Social login handlers
document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const provider = btn.classList.contains('google') ? 'Google' : 'Microsoft';
    alert(`${provider} login would be implemented here`);
  });
});
