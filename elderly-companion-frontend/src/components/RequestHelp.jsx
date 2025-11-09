import React, { useState } from 'react';
import axios from 'axios';

const RequestHelp = () => {
    const [feedback, setFeedback] = useState('');
    const handleRequestHelp = async () => {
        if (window.confirm("This will send a non-emergency help request to your family contact. Are you sure?")) {
            try {
                const res = await axios.post('/api/alerts/request-help');
                setFeedback(res.data.msg);
            } catch (err) {
                setFeedback('Could not send request.');
            }
            setTimeout(() => setFeedback(''), 5000);
        }
    };
    return (
        <div style={{ textAlign: 'center', margin: '1rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px' }}>
            <button onClick={handleRequestHelp} style={{ fontSize: '1.2rem', padding: '1rem', cursor: 'pointer', background: '#ffc107', border: 'none', fontWeight: 'bold' }}>
                👋 Request Help
            </button>
            <p style={{marginTop: '10px', fontSize: '0.9rem', color: '#555'}}>For non-emergencies like needing groceries.</p>
            {feedback && <p><strong>{feedback}</strong></p>}
        </div>
    );
};
export default RequestHelp;
