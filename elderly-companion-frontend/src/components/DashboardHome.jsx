import React from 'react';
import SOSButton from './SOSButton';
import VoiceControl from './VoiceControl';
import RequestHelp from './RequestHelp';
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
    id: 'entertainment',
    title: 'Entertainment',
    image: '/youtube.png', // Using your YouTube image
  },
  {
    id: 'chatbot',
    title: 'AI Companion',
    image: '/chatting.png', 
  },
  {
    id: 'diet',
    title: 'Diet Tracker',
    image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=400',
  },
  {
    id: 'gallery',
    title: 'Photo Gallery',
    // --- THIS IS THE NEW FIX ---
    image: '/photo.png', // A new, reliable image
    // --- END OF FIX ---
  },
];

const DashboardHome = ({ setActiveView, onNavigate }) => {
  return (
    <div className="home-container">
      
      {/* 1. WELCOME HEADER (Stays at the top) */}
      <div className="home-header">
        <h2>Welcome Home!</h2>
        <p>Your safety and connection hub. Access all your tools from the menu on the left.</p>
      </div>

      {/* --- NEW 2-COLUMN LAYOUT --- */}
      <div className="home-layout-grid">
        
        {/* --- MAIN CONTENT (LEFT) --- */}
        <div className="home-main-content">
          <div className="quick-links-section">
            <h3>Quick Links</h3>
            <div className="home-grid">
              {quickLinks.map(link => (
                <div
                  key={link.id}
                  className="home-card"
                  style={{ backgroundImage: `url(${link.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                  onClick={() => setActiveView(link.id)}
                >
                  <div className="home-card-content">
                    <h4>{link.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- SIDEBAR WIDGETS (RIGHT) --- */}
        <div className="home-sidebar-widgets">
          <h3>Priority Actions</h3>
          <div className="home-priority-actions">
            <div className="priority-card sos-card">
              <SOSButton />
            </div>
            <div className="priority-card voice-card">
              <VoiceControl onNavigate={onNavigate} />
            </div>
            <div className="priority-card help-card">
              <RequestHelp />
            </div>
          </div>
        </div>
        
      </div>
      {/* --- END 2-COLUMN LAYOUT --- */}

    </div>
  );
};

export default DashboardHome;