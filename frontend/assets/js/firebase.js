// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  // Export Firebase services
  export { auth, db, storage };
  // Login functionality
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      console.log("User logged in:", userCredential.user.uid);
      window.location.href = 'home.html';
    } catch (error) {
      console.error("Login error:", error);
      alert(error.message);
    }
  });
  
  // Check auth state
  auth.onAuthStateChanged(user => {
    if (user) {
      // User is logged in, redirect if on login page
      if (window.location.pathname.includes('login.html')) {
        window.location.href = 'home.html';
      }
    } else {
      // User is not logged in, redirect to login
      if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
      }
    }
  });
  // Load user data
auth.onAuthStateChanged(async user => {
    if (user) {
      // Get user profile from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();
      
      // Display user info
      document.getElementById('userName').textContent = userData.name;
      document.getElementById('userAvatar').src = userData.avatarUrl || 'default-avatar.jpg';
      
      // Load recent activity
      const activitySnapshot = await db.collection('activity')
        .where('userId', '==', user.uid)
        .orderBy('timestamp', 'desc')
        .limit(5)
        .get();
      
      activitySnapshot.forEach(doc => {
        // Render activity items
      });
    }
  });
  
  // Logout functionality
  document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut().then(() => {
      window.location.href = 'login.html';
    });
  });
  // Load groups
auth.onAuthStateChanged(async user => {
    if (user) {
      // Get groups the user is member of
      const groupsSnapshot = await db.collection('groups')
        .where('members', 'array-contains', user.uid)
        .get();
      
      const groupsList = document.getElementById('groupsList');
      groupsList.innerHTML = '';
      
      groupsSnapshot.forEach(doc => {
        const group = doc.data();
        const groupElement = `
          <div class="group-item" data-id="${doc.id}">
            <div class="group-avatar">${group.name.charAt(0)}</div>
            <span>${group.name}</span>
            <span class="member-count">${group.members.length} members</span>
          </div>
        `;
        groupsList.innerHTML += groupElement;
      });
      
      // Add click handlers
      document.querySelectorAll('.group-item').forEach(item => {
        item.addEventListener('click', () => {
          const groupId = item.getAttribute('data-id');
          window.location.href = `group.html?id=${groupId}`;
        });
      });
    }
  });
  // Load events
auth.onAuthStateChanged(async user => {
    if (user) {
      // Get upcoming events
      const now = new Date();
      const eventsSnapshot = await db.collection('events')
        .where('date', '>=', now)
        .orderBy('date')
        .limit(10)
        .get();
      
      const eventsContainer = document.getElementById('eventsList');
      eventsContainer.innerHTML = '';
      
      eventsSnapshot.forEach(doc => {
        const event = doc.data();
        const eventElement = `
          <div class="event-card" data-id="${doc.id}">
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <p>Date: ${event.date.toDate().toLocaleString()}</p>
            <p>Location: ${event.location}</p>
            <button class="rsvp-btn">RSVP (${event.attendees.length})</button>
          </div>
        `;
        eventsContainer.innerHTML += eventElement;
      });
      
      // Add RSVP handlers
      document.querySelectorAll('.rsvp-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const eventId = e.target.closest('.event-card').getAttribute('data-id');
          await db.collection('events').doc(eventId).update({
            attendees: firebase.firestore.FieldValue.arrayUnion(user.uid)
          });
          alert('You have RSVPed to this event!');
        });
      });
    }
  });// Real-time message listener
  db.collection('groups').doc(groupId).collection('messages')
    .orderBy('timestamp', 'asc')
    .onSnapshot(snapshot => {
      const messagesContainer = document.getElementById('messages');
      messagesContainer.innerHTML = '';
      
      snapshot.forEach(doc => {
        const msg = doc.data();
        const messageElement = `
          <div class="message ${msg.senderId === user.uid ? 'user-message' : 'other-message'}">
            <div class="message-info">
              <span class="message-sender">${msg.senderName}</span>
              <span class="message-time">${new Date(msg.timestamp).toLocaleTimeString()}</span>
            </div>
            <div class="message-content">${msg.content}</div>
          </div>
        `;
        messagesContainer.innerHTML += messageElement;
      });
      
      // Scroll to bottom
  // Real-time message listener with proper error handling
const messagesQuery = db.collection('groups').doc(groupId)
.collection('messages')
.orderBy('timestamp', 'asc');

const unsubscribe = messagesQuery.onSnapshot(
(snapshot) => {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.innerHTML = '';
  
  snapshot.forEach((doc) => {
    const msg = doc.data();
    const messageElement = document.createElement('div');
    messageElement.className = `message ${msg.senderId === user.uid ? 'user-message' : 'other-message'}`;
    messageElement.innerHTML = `
      <div class="message-info">
        <span class="message-sender">${msg.senderName || 'Unknown'}</span>
        <span class="message-time">${msg.timestamp?.toDate().toLocaleTimeString() || 'Just now'}</span>
      </div>
      <div class="message-content">${msg.content}</div>
    `;
    messagesContainer.appendChild(messageElement);
  });
  
  // Scroll to bottom after rendering
  setTimeout(() => {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }, 100);
},
(error) => {
  console.error("Error listening to messages:", error);
}
);

// Remember to unsubscribe when needed (e.g., when leaving the page)
window.addEventListener('beforeunload', () => {
unsubscribe();
});
// When creating a group:
await db.collection('groups').doc(groupId).set({
    name: "Group Name",
    ownerId: user.uid,
    members: [user.uid],
    admins: [user.uid],
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  
  // When adding a message:
  await db.collection('groups').doc(groupId).collection('messages').add({
    content: "Hello",
    senderId: user.uid,
    senderName: user.displayName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });