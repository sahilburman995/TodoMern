const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required:'true',
    }
});

const Message = mongoose.model('Message', messageSchema);

// MongoDB Connection
const MONGO_URI = 'mongodb://localhost:27017/test';
const options = { useNewUrlParser: true, useUnifiedTopology: true };
mongoose.connect(MONGO_URI, options);
const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// API endpoint to get all messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await Message.find();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// API endpoint to delete a message
app.delete('/api/messages/:id', async (req, res) => {
    const messageId = req.params.id;

    try {
        // Remove the message from the database by its ID
        await Message.findByIdAndDelete(messageId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// API endpoint to save a new message
app.post('/api/messages', async (req, res) => {
    console.log('Received request body:', req.body);
    const { message } = req.body;

    try {
        // Create a new message instance
        const newMessage = new Message({
            text: message,
        });

        // Save the message to the database
        const savedMessage = await newMessage.save();

        console.log('Message saved:', {
            text: savedMessage.text,
        });

        res.json({ status: 'Message saved successfully' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
