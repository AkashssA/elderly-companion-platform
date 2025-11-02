// src/components/WellnessLibrary.jsx
import React, { useState } from 'react';
import { yogaPoses, prayers } from '../data/wellnessData';
import './WellnessLibrary.css';

// 1. We ONLY import the lightbox, not the carousel
import Lightbox from "yet-another-react-lightbox"; 
import "yet-another-react-lightbox/styles.css";

const WellnessLibrary = () => {
  const [activeTab, setActiveTab] = useState('yoga');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  // This is for the lightbox
  const yogaSlides = yogaPoses.map(pose => ({
    src: pose.imageUrl,
    title: pose.name,
    description: pose.description
  }));

  return (
    <div className="wellness-container">
      <h2>Wellness Library</h2>
      <div className="wellness-tabs">
        <button
          className={activeTab === 'yoga' ? 'active' : ''}
          onClick={() => setActiveTab('yoga')}
        >
          🧘 Yoga Poses
        </button>
        <button
          className={activeTab === 'prayers' ? 'active' : ''}
          onClick={() => setActiveTab('prayers')}
        >
          🙏 Prayers
        </button>
      </div>

      <div className="wellness-content">
        {activeTab === 'yoga' && (
          // 2. THIS IS THE NEW HORIZONTAL SCROLLING CONTAINER
          <div className="yoga-grid-container">
            {yogaPoses.map((pose, index) => (
              <div 
                key={pose.id} 
                className="yoga-card" 
                onClick={() => setLightboxIndex(index)} // Click anywhere on the card to open
              >
                <img 
                  src={pose.imageUrl} 
                  alt={pose.name} 
                />
                <h3>{pose.name}</h3>
                <p>{pose.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'prayers' && (
          // The prayers list remains unchanged
          <div className="prayers-list">
            {prayers.map((prayer) => (
              <div key={prayer.id} className="prayer-card">
                <h3>{prayer.title}</h3>
                <p className="prayer-text"><em>"{prayer.text}"</em></p>
                <p>{prayer.meaning}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3. The Lightbox component is still here and will work */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={yogaSlides}
      />
    </div>
  );
};

export default WellnessLibrary;