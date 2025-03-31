document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const eventsList = document.getElementById('eventsList');
  const addEventBtn = document.getElementById('addEventBtn');
  const eventSearch = document.getElementById('eventSearch');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const modal = document.getElementById('createEventModal');
  const closeModal = document.querySelector('.close-modal');
  const newEventForm = document.getElementById('newEventForm');

  // Initialize events in localStorage if not exists
  if (!localStorage.getItem('events')) {
    localStorage.setItem('events', JSON.stringify([]));
  }

  // Load events
  loadEvents();

  // Event Listeners
  addEventBtn.addEventListener('click', () => modal.style.display = 'block');
  closeModal.addEventListener('click', () => modal.style.display = 'none');
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Filter events
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadEvents(btn.dataset.filter);
    });
  });

  // Search events
  eventSearch.addEventListener('input', (e) => {
    filterEvents(e.target.value.toLowerCase());
  });

  // Create new event
  newEventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const eventData = {
      id: Date.now().toString(),
      title: document.getElementById('eventTitle').value,
      description: document.getElementById('eventDescription').value,
      date: document.getElementById('eventDate').value,
      time: document.getElementById('eventTime').value,
      location: document.getElementById('eventLocation').value,
      category: document.getElementById('eventCategory').value,
      createdAt: new Date().toISOString()
    };

    saveEvent(eventData);
    modal.style.display = 'none';
    newEventForm.reset();
    loadEvents();
  });

  // Functions
  function loadEvents(filter = 'all') {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    let filteredEvents = [];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    switch(filter) {
      case 'upcoming':
        filteredEvents = events.filter(event => new Date(event.date) >= today);
        break;
      case 'past':
        filteredEvents = events.filter(event => new Date(event.date) < today);
        break;
      default:
        filteredEvents = events;
    }
    
    // Sort by date (soonest first)
    filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    displayEvents(filteredEvents);
  }

  function displayEvents(events) {
    if (events.length === 0) {
      eventsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-calendar-alt fa-3x"></i>
          <h3>No events found</h3>
          <p>Try changing your filters or create a new event</p>
        </div>
      `;
      return;
    }

    eventsList.innerHTML = events.map(event => {
      const eventDate = new Date(event.date);
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      
      return `
        <div class="event-card" data-id="${event.id}">
          <div class="event-header">
            <div class="event-date">
              <span class="day">${eventDate.getDate()}</span>
              <span class="month">${monthNames[eventDate.getMonth()]}</span>
            </div>
            <div class="event-info">
              <h3>${event.title}</h3>
              <div class="event-meta">
                <span><i class="fas fa-clock"></i> ${event.time}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${event.location || 'Online'}</span>
                <span><i class="fas fa-tag"></i> ${event.category}</span>
              </div>
            </div>
          </div>
          <p class="event-description">${event.description || 'No description provided.'}</p>
          <div class="event-footer">
            <button class="btn btn-small btn-join" data-id="${event.id}">
              RSVP
            </button>
            <span class="event-actions">
              <button class="btn-icon"><i class="fas fa-share-alt"></i></button>
              <button class="btn-icon"><i class="fas fa-ellipsis-h"></i></button>
            </span>
          </div>
        </div>
      `;
    }).join('');

    // Add event listeners to event cards
    document.querySelectorAll('.btn-join').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const eventId = e.target.dataset.id;
        // Add your RSVP logic here
      });
    });
  }

  function filterEvents(searchTerm) {
    const cards = document.querySelectorAll('.event-card');
    let hasResults = false;
    
    cards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const description = card.querySelector('.event-description').textContent.toLowerCase();
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = 'block';
        hasResults = true;
      } else {
        card.style.display = 'none';
      }
    });

    if (!hasResults) {
      eventsList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search fa-3x"></i>
          <h3>No events found</h3>
          <p>Try a different search term</p>
        </div>
      `;
    }
  }

  function saveEvent(event) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
  }
});