import React, { useState, useEffect } from 'react';
import './ProactiveAssistant.css';

// Helper function to speak text
const speak = (text) => {
  window.speechSynthesis.cancel(); // Stop any previous speech
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN'; // Indian English accent
  utterance.rate = 0.9; // Slightly slower speech
  window.speechSynthesis.speak(utterance);
};

// Function to stop any speech that is currently active
const stopSpeech = () => {
  window.speechSynthesis.cancel();
};

// Function to get the correct greeting based on the time of day
const getGreeting = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 8) {
    return {
      message: "Good morning! Time to wake up and do some light yoga.",
      speak: true
    };
  }
  if (hour >= 8 && hour < 9) {
    return {
      message: "It's breakfast time! I hope you have a healthy and tasty meal.",
      speak: true
    };
  }
  if (hour >= 12 && hour < 13) {
    return {
      message: "It's noon. Don't forget to take your midday medicines if you have any.",
      speak: true
    };
  }
  if (hour >= 13 && hour < 14) {
    return {
      message: "Time for lunch! Enjoy your meal.",
      speak: false // Don't speak every single message
    };
  }
  if (hour >= 19 && hour < 20) {
    return {
      message: "Good evening. Time to prepare for dinner.",
      speak: true
    };
  }
  if (hour >= 21) {
    return {
      message: "It's getting late. Time to wind down and get ready for a good night's sleep.",
      speak: true
    };
  }
  // Default message
  return { message: "Hello! I'm here to help. Have a wonderful day!", speak: false };
};

const ProactiveAssistant = () => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false); // State to control visibility

  useEffect(() => {
    let messageToUse = ''; // Variable to hold the current message for interval check

    // Function to set and speak the message
    const updateMessage = (greeting) => {
      setMessage(greeting.message);
      messageToUse = greeting.message;
      if (greeting.speak) {
        speak(greeting.message);
      }
      setIsVisible(true); // Make the assistant visible when there's a message
    };

    // 1. Set the initial message when the component loads
    const initialGreeting = getGreeting();
    updateMessage(initialGreeting);

    // 2. Set up an interval to check the time every minute
    const interval = setInterval(() => {
      const newGreeting = getGreeting();
      
      // Only update and speak if the message is different
      if (newGreeting.message !== messageToUse) {
        updateMessage(newGreeting);
      }
    }, 60000); // Check every minute (60000 ms)

    // 3. Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Run only once

  // Don't render anything if there's no message
  if (!isVisible) {
    return null;
  }

  return (
    <div className="assistant-container">
      <div className="assistant-icon">🤖</div>
      <div className="assistant-bubble">
        {/* Button to stop speech */}
        <button onClick={stopSpeech} className="stop-speech-btn">X</button>
        {message}
      </div>
    </div>
  );
};

export default ProactiveAssistant;