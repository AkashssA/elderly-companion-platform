// src/components/DashboardHome.jsx
import React from 'react';
import SOSButton from './SOSButton';
import VoiceControl from './VoiceControl';
import './DashboardHome.css';

// This list of items now uses your local images from the /public folder
const quickLinks = [
  {
    id: 'health',
    title: 'Health Monitor',
    image: '/sos.png', // Using your SOS image for health/safety
  },
  {
    id: 'game',
    title: 'Memory Game',
    image: '/puzzel.png', // Using your puzzle image
  },
  {
    id: 'scheduler',
    title: 'My Schedule',
    image: 'schedule.png', // Kept as an example
  },
  {
    id: 'entertainment',
    title: 'Entertainment',
    image: '/youtube.png', // Using your YouTube image
  },
  {
    id: 'events',
    title: 'Community Events',
    image: '/chatting.png', // Using your chatting image
  },
  {
    id: 'diet',
    title: 'Diet Tracker',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400', // Kept as an example
  },
];

const DashboardHome = ({ setActiveView, onNavigate }) => {
  return (
    <div>
      <SOSButton />
      <VoiceControl onNavigate={onNavigate} />

      <div className="home-grid">
        {quickLinks.map(link => (
          <div
            key={link.id}
            className="home-card"
            style={{ backgroundImage: `url(${link.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            onClick={() => setActiveView(link.id)}
          >
            <div className="home-card-content">
              <h3>{link.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;