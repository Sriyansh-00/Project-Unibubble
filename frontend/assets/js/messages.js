// Firebase/WebSocket example
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('messageInput');

// Send message
document.getElementById('sendMessageBtn').addEventListener('click', () => {
  const text = messageInput.value;
  if (text) {
    fetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ text, sender: 'You' })
    });
    messageInput.value = '';
  }
});

// Listen for new messages (Polling/WebSockets)
setInterval(async () => {
  const response = await fetch('/api/messages');
  const messages = await response.json();
  messagesDiv.innerHTML = messages.map(msg => 
    `<p><strong>${msg.sender}:</strong> ${msg.text}</p>`
  ).join('');
}, 1000); // Update every second