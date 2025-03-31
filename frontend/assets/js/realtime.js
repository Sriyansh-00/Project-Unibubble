class RealtimeService {
    constructor() {
      this.socket = new WebSocket('wss://your-api-endpoint.com/realtime');
      this.subscriptions = new Map();
      
      this.socket.onmessage = (event) => {
        const { channel, data } = JSON.parse(event.data);
        if (this.subscriptions.has(channel)) {
          this.subscriptions.get(channel).forEach(callback => callback(data));
        }
      };
    }
    
    subscribe(channel, callback) {
      if (!this.subscriptions.has(channel)) {
        this.subscriptions.set(channel, []);
        this.socket.send(JSON.stringify({ action: 'subscribe', channel }));
      }
      this.subscriptions.get(channel).push(callback);
      
      // Return unsubscribe function
      return () => {
        const listeners = this.subscriptions.get(channel);
        const index = listeners.indexOf(callback);
        if (index > -1) listeners.splice(index, 1);
        
        if (listeners.length === 0) {
          this.socket.send(JSON.stringify({ action: 'unsubscribe', channel }));
          this.subscriptions.delete(channel);
        }
      };
    }
    
    sendMessage(channel, data) {
      this.socket.send(JSON.stringify({ channel, data }));
    }
  }
  
  // Initialize in your main app file
  const realtime = new RealtimeService();
  
  // Example usage in home.js:
  realtime.subscribe('notifications', (notification) => {
    showNotification(notification);
  });
  
  realtime.subscribe('chat:room123', (message) => {
    appendMessage(message);
  });