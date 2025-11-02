// backend/models/CommunityEvent.js
const mongoose = require('mongoose');

const CommunityEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  eventType: {
    type: String,
    enum: ['Yoga', 'Bhajan', 'Game', 'Storytelling', 'General'],
    default: 'General',
  },
  link: { // e.g., a Google Meet or Zoom link
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('communityEvent', CommunityEventSchema);