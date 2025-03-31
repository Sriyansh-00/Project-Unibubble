document.getElementById('profileForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    
    fetch('/api/settings', {
      method: 'POST',
      body: JSON.stringify({ username, email })
    }).then(() => alert('Profile updated!'));
  });