// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
      window.location.href = 'login.html';
    }
  }
  
  // Logout function
  function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'login.html';
  }
  
  // Initialize the page
  document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    // Load user data
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      const avatar = document.querySelector('.user-avatar');
      if (avatar) {
        // In a real app, you might display the user's initials or profile picture
        avatar.setAttribute('aria-label', `Profile for ${userEmail}`);
      }
    }
    
    // Sample data loading (in a real app, this would be from an API)
    loadSampleData();
  });
  
  // Sample data for demonstration
  function loadSampleData() {
    // Sample events
    const events = [
      {
        title: "Campus Hackathon",
        description: "24-hour coding competition with prizes!",
        date: "Oct 15",
        attendees: "120 going"
      },
      {
        title: "Study Group: CS101",
        description: "Midterm prep session in Library Room 3B.",
        date: "Oct 12",
        attendees: "24 going"
      }
    ];
    
    // Sample groups
    const groups = [
      {
        title: "Game Dev Club",
        description: "For students interested in game development.",
        members: "1.2k members"
      },
      {
        title: "Campus Entrepreneurs",
        description: "Startup ideas and networking.",
        members: "856 members"
      }
    ];
    
    // Render events
    const eventsContainer = document.querySelector('.upcoming-events .card-grid');
    if (eventsContainer) {
      eventsContainer.innerHTML = events.map(event => `
        <div class="card">
          <h3 class="card-title">${event.title}</h3>
          <p class="card-desc">${event.description}</p>
          <div class="card-meta">
            <span><i class="far fa-calendar"></i> ${event.date}</span>
            <span>${event.attendees}</span>
          </div>
        </div>
      `).join('');
    }
    
    // Render groups
    const groupsContainer = document.querySelector('.recommended-groups .card-grid');
    if (groupsContainer) {
      groupsContainer.innerHTML = groups.map(group => `
        <div class="card">
          <h3 class="card-title">${group.title}</h3>
          <p class="card-desc">${group.description}</p>
          <div class="card-meta">
            <span>${group.members}</span>
          </div>
        </div>
      `).join('');
    }
    
    // Add click handlers to cards
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('click', () => {
        // In a real app, this would navigate to the event/group detail page
        console.log('Card clicked:', card.querySelector('.card-title').textContent);
      });
    });
  }