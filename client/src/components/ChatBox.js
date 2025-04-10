import React, { useState } from 'react';
import axios from 'axios';

function ChatBox({ token, setProducts }) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSend = async () => {
    try {
      const response = await axios.post(`${API_URL}/api/ai/chat`, { message }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory([...history, { user: message, ai: response.data.reply }]);
      setProducts(response.data.products);
      setMessage('');
    } catch (error) {
      console.error('Chat error:', error);
    }
  };

  return (
    <div className="chat-box">
      <h2>Chat with AI</h2>
      <div className="chat-display">
        {history.map((entry, index) => (
          <div key={index}>
            <p><strong>You:</strong> {entry.user}</p>
            <p><strong>AI:</strong> {entry.ai}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about products..."
          style={{ flex: 1 }}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default ChatBox;