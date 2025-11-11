import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Scheduler.css';
import AlarmModal from './AlarmModal'; // <-- 1. IMPORT THE NEW ALARM

const localizer = momentLocalizer(moment);

const Scheduler = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  // --- 2. NEW ALARM STATE ---
  const [activeAlarm, setActiveAlarm] = useState(null); // Holds the event that is ringing
  const [triggeredAlarms, setTriggeredAlarms] = useState([]); // Holds IDs of alarms we've already shown

  // Fetch events on component load
  useEffect(() => {
    fetchEvents();
  }, []);

  // --- 3. NEW ALARM CHECKER ---
  // This interval runs constantly to check for due events
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      for (const event of events) {
        const eventStart = new Date(event.start);
        
        // Check if event is starting now (within the last minute)
        // AND we are not already showing an alarm
        // AND this alarm hasn't been triggered before
        if (
          eventStart <= now && 
          now - eventStart < 60000 && // Event started in the last 60 seconds
          !activeAlarm && 
          !triggeredAlarms.includes(event._id)
        ) {
          console.log("ALARM TRIGGERED:", event.title);
          setActiveAlarm(event); // Trigger the alarm!
          setTriggeredAlarms(prev => [...prev, event._id]); // Mark it as triggered
        }
      }
    };

    const alarmInterval = setInterval(checkAlarms, 15000); // Check every 15 seconds

    return () => clearInterval(alarmInterval);
  }, [events, activeAlarm, triggeredAlarms]); // Re-run if these change

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/events');
      const formattedEvents = res.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Failed to fetch events', err);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!title || !start || !end) {
      alert('Please fill in all fields');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/events', { title, start, end });
      fetchEvents();
      setTitle('');
      setStart('');
      setEnd('');
    } catch (err) {
      console.error('Failed to add event', err);
    }
  };
  
  const handleDeleteEvent = async (eventId) => {
    if(window.confirm("Are you sure you want to delete this event?")){
        try {
            await axios.delete(`http://localhost:5000/api/events/${eventId}`);
            fetchEvents();
        } catch (err) {
            console.error("Failed to delete event", err);
        }
    }
  }

  return (
    <div className="scheduler-container">
      {/* --- 4. RENDER THE ALARM MODAL --- */}
      {activeAlarm && (
        <AlarmModal 
          event={activeAlarm} 
          onDismiss={() => setActiveAlarm(null)} 
        />
      )}

      <h2>Your Day Scheduler</h2>
      <div className="add-event-form">
        <h3>Add New Task</h3>
        <form onSubmit={handleAddEvent}>
          <input type="text" placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} />
          <div>
            <label>Start Time:</label>
            <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <label>End Time:</label>
            <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
          </div>
          <button type="submit">Add Task</button>
        </form>
      </div>
      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }}
          onSelectEvent={event => handleDeleteEvent(event._id)}
        />
      </div>
      <p className="calendar-tip">Click on a task in the calendar to delete it.</p>
    </div>
  );
};

export default Scheduler;