// backend/routes/communityEvents.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const CommunityEvent = require('../models/CommunityEvent');

// @route   GET api/community-events
// @desc    Get all upcoming community events (for regular users)
// @access  Private (Users must be logged in to see events)
router.get('/', auth, async (req, res) => {
  try {
    // Find events that are scheduled for today or in the future, and sort them
    const events = await CommunityEvent.find({ eventDate: { $gte: new Date() } }).sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/community-events/admin/post
// @desc    ADMIN ONLY: Post a new community event
// @access  Restricted (We will add a simple secret key check)
router.post('/admin/post', async (req, res) => {
    const { title, description, eventType, link, eventDate, adminSecret } = req.body;

    // Simple security: Check for a secret key.
    if(adminSecret !== process.env.ADMIN_SECRET_KEY) {
        return res.status(401).json({ msg: 'Unauthorized: Admin access required.' });
    }

    try {
        const newEvent = new CommunityEvent({ title, description, eventType, link, eventDate });
        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;