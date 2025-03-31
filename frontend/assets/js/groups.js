document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const groupsList = document.getElementById('groupsList');
  const createBtn = document.getElementById('createGroupBtn');
  const exploreBtn = document.getElementById('exploreGroupsBtn');
  const searchInput = document.querySelector('.search__input');
  const filters = document.querySelectorAll('.filter');
  const modal = document.getElementById('createGroupModal');
  const closeModal = document.querySelector('.modal__close');
  const groupForm = document.getElementById('newGroupForm');

  // Load user's groups
  loadGroups();

  // Event Listeners
  createBtn.addEventListener('click', () => modal.style.display = 'block');
  closeModal.addEventListener('click', () => modal.style.display = 'none');
  exploreBtn?.addEventListener('click', () => window.location.href = 'explore.html');
  
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  // Filter groups
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadGroups(btn.dataset.filter);
    });
  });

  // Search groups
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.group-card');
    
    cards.forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      const matches = name.includes(term);
      card.style.display = matches ? 'block' : 'none';
    });
  });

  // Create new group
  groupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const group = {
      id: Date.now(),
      name: document.getElementById('groupName').value,
      description: document.getElementById('groupDescription').value,
      category: document.getElementById('groupCategory').value,
      isPrivate: document.getElementById('groupPrivate').checked,
      createdAt: new Date().toISOString()
    };

    saveGroup(group);
    modal.style.display = 'none';
    groupForm.reset();
    loadGroups();
  });

  // Functions
  function loadGroups(filter = 'all') {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    let filteredGroups = groups;
    
    if (filter === 'admin') {
      filteredGroups = groups.filter(g => g.creator === currentUser.username);
    } else if (filter === 'member') {
      filteredGroups = groups.filter(g => g.creator !== currentUser.username);
    }
    
    displayGroups(filteredGroups);
  }

  function displayGroups(groups) {
    if (groups.length === 0) {
      groupsList.innerHTML = `
        <div class="empty">
          <i class="fas fa-users empty__icon"></i>
          <h3 class="empty__title">No groups found</h3>
          <p class="empty__text">Try changing your filters</p>
        </div>
      `;
      return;
    }

    groupsList.innerHTML = groups.map(group => `
      <div class="group-card">
        <h3>${group.name}</h3>
        <p>${group.description || 'No description'}</p>
        <div class="group-meta">
          <span>${group.category}</span>
          <span>${group.isPrivate ? 'Private' : 'Public'}</span>
        </div>
        <button class="button button--small" data-id="${group.id}">
          View Group
        </button>
      </div>
    `).join('');
  }

  function saveGroup(group) {
    const groups = JSON.parse(localStorage.getItem('groups')) || [];
    groups.push(group);
    localStorage.setItem('groups', JSON.stringify(groups));
  }
});