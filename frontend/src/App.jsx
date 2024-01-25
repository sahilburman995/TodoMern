import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'
const MessageForm = ({ onSubmit }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to your backend
      const response = await axios.post('http://localhost:3000/api/messages', {
        message: message
      });

      // Handle the response from the backend
      console.log('Backend response:', response.data);
      fetchMessages();
      setMessage('');

      // Do any additional handling or update UI as needed
      onSubmit(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      // Make a DELETE request to your backend
      const response = await axios.delete(`http://localhost:3000/api/messages/${messageId}`);
      console.log('Delete response:', response.data);
      fetchMessages(); // Refresh the messages after deletion
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      // Fetch messages from the backend
      const response = await axios.get('http://localhost:3000/api/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    // Fetch messages from the backend when the component mounts
    fetchMessages();
  }, [message]);

  return (
    <>
<div className="todo-container">
      <form onSubmit={handleSubmit} className="message-form">
        <label>
          New Task:
          <input type="text" value={message} onChange={handleInputChange} />
        </label>
        <button type="submit" className="submit-button">Add Task</button>
      </form>

      <div className="message-list">
        <h2>Task List</h2>
        <ul>
          {messages.map((message) => (
            <li key={message._id} className="message-item">
              {message.text} 
              <button onClick={() => handleDelete(message._id)} className="delete-button">Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  );
};

export default MessageForm;
