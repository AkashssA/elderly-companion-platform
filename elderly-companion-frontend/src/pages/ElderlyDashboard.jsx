import React, { useState, useEffect } from 'react';
import './ElderlyDashboard.css';

// Import all your components
import Sidebar from '../components/Sidebar';
import DashboardHome from '../components/DashboardHome';
import HealthMonitor from '../components/HealthMonitor';
import DietTracker from '../components/DietTracker';
import Scheduler from '../components/Scheduler';
import PhotoGallery from '../components/PhotoGallery';
import Entertainment from '../components/Entertainment';
import WellnessLibrary from '../components/WellnessLibrary';
import MemoryGame from '../components/MemoryGame';
import CommunityEvents from '../components/CommunityEvents';
import Chatbot from '../components/Chatbot';
import ProactiveAssistant from '../components/ProactiveAssistant';
import { subscribeUser } from '../utils/subscribeUser';

const ElderlyDashboard = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // This hook runs once to set up notifications
  useEffect(() => {
    if (Notification.permission === 'granted') {
        subscribeUser();
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                subscribeUser();
            }
        });
    }
  }, []);

  const handleVoiceNavigation = (section) => {
    setActiveView(section);
  };

  const viewTitles = {
    home: 'Home Dashboard',
    health: 'Health Monitor',
    diet: 'Diet Tracker',
    scheduler: 'My Schedule',
    gallery: 'Photo Gallery',
    entertainment: 'Entertainment',
    wellness: 'Wellness Library',
    game: 'Memory Game',
    events: 'Community Events',
    chatbot: 'AI Companion'
  };

  // --- THIS IS THE CORRECTED RENDER FUNCTION ---
  const renderView = () => {
    // The "Home" component has its own centering, so it does NOT get the wrapper.
    if (activeView === 'home') {
      return <DashboardHome setActiveView={setActiveView} onNavigate={handleVoiceNavigation} />;
    }

    // All other components will be wrapped in our new "page-wrapper" class
    let componentToRender;
    switch (activeView) {
      case 'health':
        componentToRender = <HealthMonitor />;
        break;
      case 'diet':
        componentToRender = <DietTracker />;
        break;
      case 'scheduler':
        componentToRender = <Scheduler />;
        break;
      case 'gallery':
        componentToRender = <PhotoGallery />;
        break;
      case 'entertainment':
        componentToRender = <Entertainment onClose={() => setActiveView('home')} />;
        break;
      case 'wellness':
        componentToRender = <WellnessLibrary />;
        break;
      case 'game':
        componentToRender = <MemoryGame />;
        break;
      case 'events':
        componentToRender = <CommunityEvents />;
        break;
      case 'chatbot':
        componentToRender = <Chatbot />;
        break;
      default:
        return <DashboardHome setActiveView={setActiveView} onNavigate={handleVoiceNavigation} />;
    }

    // This wrapper is what fixes your alignment
    return (
      <div className="page-wrapper">
        {componentToRender}
      </div>
    );
  };

  return (
    <div className={`dashboard-layout ${isSidebarOpen ? '' : 'sidebar-collapsed'}`}> 
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        activeView={activeView} 
        setActiveView={setActiveView} 
      />
      <div className="dashboard-content">
        <div className="content-header">
          <h2>{viewTitles[activeView] || 'Dashboard'}</h2>
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
        <div className="content-main">
          {renderView()}
        </div>
      </div>
      <ProactiveAssistant />
    </div>
  );
};

export default ElderlyDashboard;