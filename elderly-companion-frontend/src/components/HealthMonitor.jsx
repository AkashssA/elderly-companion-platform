import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { healthTips } from '../data/healthTips';
import './HealthMonitor.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- HELPER FUNCTION (unchanged) ---
const formatActivity = (metric) => {
  const date = new Date(metric.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  switch (metric.metricType) {
    case 'bloodPressure':
      return `BP: ${metric.value1}/${metric.value2} mmHg`;
    case 'bloodSugar':
      return `Sugar: ${metric.value1} mg/dL`;
    case 'weight':
      return `Weight: ${metric.value1} kg`;
    case 'heartRate':
      return `Heart Rate: ${metric.value1} bpm`;
    default:
      return 'New Reading';
  }
};

const HealthMonitor = () => {
  const [metricType, setMetricType] = useState('bloodPressure');
  const [data, setData] = useState([]);
  const [formValues, setFormValues] = useState({ value1: '', value2: '' });
  const [showTips, setShowTips] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);
  
  // This hook handles tab changes for the chart.
  useEffect(() => {
    fetchData();
    setShowTips(false);
  }, [metricType]);

  // This hook runs ONLY ONCE to get the activity list.
  useEffect(() => {
    fetchRecentActivity();
  }, []); // The empty array [] means "run once on mount"

  const fetchData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/health/${metricType}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch health data", err);
    }
  };

  const fetchRecentActivity = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/health/recent`);
      setRecentActivity(res.data);
    } catch (err) {
      console.error("Failed to fetch recent activity", err);
    }
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  
  const checkNormalRange = () => {
    const { value1, value2 } = formValues;
    const v1 = parseFloat(value1);
    const v2 = parseFloat(value2);
    if (metricType === 'bloodPressure' && (v1 > 140 || v2 > 90)) {
        alert('Warning: Blood Pressure reading is high. Please consult a doctor.');
    }
    if (metricType === 'bloodSugar' && v1 > 180) {
        alert('Warning: Blood Sugar reading is high. Please consult a doctor.');
    }
    if (metricType === 'heartRate' && (v1 < 60 || v1 > 100)) {
        alert('Warning: Heart Rate is outside the normal range (60-100 bpm). Please consult a doctor.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    checkNormalRange();
    try {
      await axios.post('http://localhost:5000/api/health', { ...formValues, metricType });
      fetchData(); // Refresh chart
      fetchRecentActivity(); // <-- REFRESH activity list
      setFormValues({ value1: '', value2: '' }); // Clear form
    } catch (err) {
      console.error("Failed to add health data", err);
    }
  };
  
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString("en-IN")),
    datasets: [
      {
        label: metricType === 'bloodPressure' ? 'Systolic (High)' : metricType.replace(/([A-Z])/g, ' $1').toUpperCase(),
        data: data.map(d => d.value1),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      ...(metricType === 'bloodPressure' ? [{
        label: 'Diastolic (Low)',
        data: data.map(d => d.value2),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }] : [])
    ],
  };

  return (
    <div className="health-container">
      <h2>Health Monitor</h2>
      {/* --- THIS IS THE FIX for the typo --- */}
      <div className="health-tabs">
        <button onClick={() => setMetricType('bloodPressure')} className={metricType === 'bloodPressure' ? 'active' : ''}>Blood Pressure</button>
        <button onClick={() => setMetricType('bloodSugar')} className={metricType === 'bloodSugar' ? 'active' : ''}>Blood Sugar</button>
        <button onClick={() => setMetricType('weight')} className={metricType === 'weight' ? 'active' : ''}>Weight</button>
        <button onClick={() => setMetricType('heartRate')} className={metricType === 'heartRate' ? 'active' : ''}>Heart Rate</button>
      </div>

      <div className="health-content">
        <div className="health-form">
          <h3>Add New Reading</h3>
          <form onSubmit={handleSubmit}>
            {metricType === 'bloodPressure' ? (
              <>
                <input name="value1" type="number" placeholder="Systolic (e.g., 120)" value={formValues.value1} onChange={handleInputChange} required />
                <input name="value2" type="number" placeholder="Diastolic (e.g., 80)" value={formValues.value2} onChange={handleInputChange} required />
              </>
            ) : (
              <input name="value1" type="number" placeholder={`Enter ${metricType === 'bloodSugar' ? 'Sugar (mg/dL)' : metricType === 'weight' ? 'Weight (kg)' : 'Rate (bpm)'}`} value={formValues.value1} onChange={handleInputChange} required />
            )}
            <button type="submit">Add Reading</button>
          </form>

          <div className="tips-section">
            <button onClick={() => setShowTips(!showTips)} className="tips-toggle">
              {showTips ? 'Hide' : 'Show'} Care Tips ▼
            </button>
            {showTips && (
              <div className="tips-content">
                <h4>Normal Range:</h4>
                <p>{healthTips[metricType].normalRange}</p>
                <h4>How to Take Care:</h4>
                <ul>
                  {healthTips[metricType].careTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="health-chart-and-activity">
          <div className="health-chart">
            <h3>Your Progress: {metricType.replace(/([A-Z])/g, ' $1')}</h3>
            {data.length > 0 ? <Line data={chartData} /> : <p>No data recorded for this metric yet.</p>}
          </div>

          <div className="recent-activity-container">
            <h3>Your Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <p>No recent activity. Add a reading to get started!</p>
            ) : (
              <ul className="recent-activity-list">
                {recentActivity.map(metric => (
                  <li key={metric._id}>
                    <span className="activity-date">{new Date(metric.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <span className="activity-text">{formatActivity(metric)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthMonitor;