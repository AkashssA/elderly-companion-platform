// src/utils/subscribeUser.js
import axios from 'axios';
import setAuthToken from './setAuthToken'; // <-- 1. IMPORT THE UTILITY

// This is your VAPID public key
const vapidPublicKey = 'BF_i7vtJmzWL71ktB0IME12QEDARu3r94T9tuVeqeobBwr7OnbpvuN12_UmK2uyvdCr9HZfqOU2rIb5_V0re0vs'; 

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeUser() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker Registered.');

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });
      console.log('User is subscribed.');

      // --- 2. THIS IS THE FIX ---
      // Get the token from storage and add it to the request headers
      setAuthToken(localStorage.getItem('token'));
      // --- END OF FIX ---

      // Send subscription to the backend (this will now be authorized)
      await axios.post('http://localhost:5000/api/notifications/subscribe', subscription);
      console.log('Subscription sent to server.');

    } catch (err) {
      console.error('Failed to subscribe the user: ', err);
    }
  }
}