const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); 
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Conversation = require('../models/Conversation');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/chat', auth, async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;

  if (!message) {
    return res.status(400).json({ msg: 'Message is required' });
  }

  try {
    // --- THIS IS THE FINAL FIX ---
    // Using the latest model: gemini-2.5-flash-preview-09-2025
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-09-2025' });
    // --- END OF FIX ---

    const chatPrompt = `You are a kind, patient, and empathetic AI companion for a senior citizen. 
      Your name is "Asha". 
      Your purpose is to provide cheerful conversation, answer questions gently, and offer encouragement. 
      Keep your answers friendly and relatively brief.
      
      User: ${message}`;
    
    const result = await model.generateContent(chatPrompt);
    const response = await result.response;
    const botReply = response.text();

    const userMessage = { sender: 'user', text: message };
    const botMessage = { sender: 'bot', text: botReply };

    await Conversation.findOneAndUpdate(
      { user: userId },
      { $push: { messages: { $each: [userMessage, botMessage] } } },
      { upsert: true, new: true } 
    );

    res.json({ reply: botReply });

  } catch (err) {
    console.error('Gemini API or DB Error:', err);
    res.status(500).json({ reply: 'Sorry, my AI brain is taking a nap. Please try again in a moment.' });
  }
});

module.exports = router;