import React, { useEffect } from 'react';
import './AlarmModal.css';

// This is the repeating "speak" function
const speak = (text) => {
  window.speechSynthesis.cancel(); // Stop any previous speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN';
  utterance.rate = 0.9;
  utterance.pitch = 1.1; // Make it a bit higher pitched to get attention
  utterance.volume = 1; // Max volume
  window.speechSynthesis.speak(utterance);
};

const AlarmModal = ({ event, onDismiss }) => {

  const alarmText = `It is time for your event: ${event.title}`;

  // This useEffect hook is the alarm
  useEffect(() => {
    // 1. Speak immediately when the modal opens
    speak(alarmText);

    // 2. Set an interval to repeat the alarm every 10 seconds
    const repeatInterval = setInterval(() => {
      speak(alarmText);
    }, 10000); // 10 seconds

    // 3. Clean up the interval when the modal is closed
    return () => {
      clearInterval(repeatInterval);
    };
  }, [event]); // Re-run if the event changes

  const handleDismiss = () => {
    window.speechSynthesis.cancel(); // Stop all speech
    onDismiss(); // Call the parent function to close the modal
  };

  return (
    <div className="alarm-modal-backdrop">
      <div className="alarm-modal-content">
        <div className="alarm-icon">⏰</div>
        <h2>It's Time!</h2>
        <p className="alarm-event-title">{event.title}</p>
        <p>Your scheduled event is starting now.</p>
        <button className="alarm-dismiss-btn" onClick={handleDismiss}>
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default AlarmModal;