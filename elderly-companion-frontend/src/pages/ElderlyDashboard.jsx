// src/pages/ElderlyDashboard.jsx
import React, { useState, useEffect } from 'react'; // Added useEffect
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
import { subscribeUser } from '../utils/subscribeUser'; // Import for notifications

const ElderlyDashboard = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar toggle

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

  // This function will now be passed to VoiceControl
  const handleVoiceNavigation = (section) => {
    setActiveView(section);
  };

  const renderView = () => {
    switch (activeView) {
      case 'home':
        // **THE FIX IS HERE**: We now pass both functions down as props
        return <DashboardHome setActiveView={setActiveView} onNavigate={handleVoiceNavigation} />;
      case 'health':
        return <HealthMonitor />;
      case 'diet':
        return <DietTracker />;
      case 'scheduler':
        return <Scheduler />;
      case 'gallery':
        return <PhotoGallery />;
      case 'entertainment':
        return <Entertainment onClose={() => setActiveView('home')} />;
      case 'wellness':
        return <WellnessLibrary />;
      case 'game':
        return <MemoryGame />;
      case 'events':
        return <CommunityEvents />;
      default:
        return <DashboardHome setActiveView={setActiveView} onNavigate={handleVoiceNavigation} />;
    }
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
          <h2> Elderly Companion 👵❤️</h2> {/* <-- ADD THIS LINE BACK */}
          <button onClick={onLogout} className="logout-button">Logout</button>
        </div>
        <div className="content-main">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default ElderlyDashboard;