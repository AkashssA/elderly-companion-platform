const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const HealthMetric = require('../models/HealthMetric');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const moment = require('moment');

// --- THIS IS THE FIX ---
// We are now using your FIRST, WORKING key and model
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-preview-09-2025' });
// --- END OF FIX ---


// @route   POST api/health
// @desc    Add a new health metric reading
router.post('/', auth, async (req, res) => {
  const { metricType, value1, value2, date } = req.body;
  try {
    const newMetric = new HealthMetric({
      user: req.user.id,
      metricType,
      value1,
      value2,
      date: date || new Date(),
    });
    const metric = await newMetric.save();
    res.json(metric);
  } catch (err)
 {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/health/:metricType
// @desc    Get all readings for a specific metric
router.get('/:metricType', auth, async (req, res) => {
  try {
    const metrics = await HealthMetric.find({
      user: req.user.id,
      metricType: req.params.metricType,
    }).sort({ date: 1 });
    res.json(metrics);
  } catch (err)
 {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// --- THIS IS THE AI SUMMARY ROUTE ---
// @route   POST api/health/ai-summary
// @desc    Generate a smart health summary using Gemini AI
router.post('/ai-summary', auth, async (req, res) => {
  const { height, allReadings } = req.body; // Get data from frontend

  if (!height) {
    return res.status(400).json({ summary: "Please enter your height to calculate BMI." });
  }

  // 1. Get latest readings
  const latestWeight = allReadings.weight.length > 0 ? allReadings.weight[0].value1 : null;
  const latestBP = allReadings.bp.length > 0 ? { systolic: allReadings.bp[0].value1, diastolic: allReadings.bp[0].value2 } : null;
  const latestSugar = allReadings.sugar.length > 0 ? allReadings.sugar[0].value1 : null;
  const latestHR = allReadings.hr.length > 0 ? allReadings.hr[0].value1 : null;
  
  // 2. Calculate BMI
  const heightInMeters = height / 100;
  let bmi = null;
  let bmiStatus = "N/A";
  if (latestWeight) {
    bmi = (latestWeight / (heightInMeters * heightInMeters)).toFixed(1);
    if (bmi < 18.5) bmiStatus = "Underweight";
    else if (bmi < 24.9) bmiStatus = "Healthy Weight";
    else if (bmi < 29.9) bmiStatus = "Overweight";
    else bmiStatus = "Obese";
  }

  // 3. Format the data for the AI
  const healthDataString = `
    - Height: ${height} cm
    - Latest Weight: ${latestWeight ? latestWeight + ' kg' : 'N/A'}
    - Calculated BMI: ${bmi ? `${bmi} (${bmiStatus})` : 'N/A'}
    - Latest Blood Pressure: ${latestBP ? `${latestBP.systolic}/${latestBP.diastolic} mmHg` : 'N/A'}
    - Latest Blood Sugar: ${latestSugar ? latestSugar + ' mg/dL' : 'N/A'}
    - Latest Heart Rate: ${latestHR ? latestHR + ' bpm' : 'N/A'}
  `;

  // 4. Create the prompt for Gemini
  const prompt = `
    You are a kind and caring health assistant for an elderly person.
    A user has provided their latest health data:
    ${healthDataString}

    Please analyze this data and provide a simple, 4-point health summary.
    1.  **Overall Health:** Give a one-sentence summary (e.g., "Your health looks stable," or "Your blood pressure is a bit high.").
    2.  **Your BMI:** State their BMI and what it means (e.g., "Your BMI is ${bmi}, which is in the '${bmiStatus}' range.").
    3.  **What to Watch:** Point out the most important thing to monitor (e..g., "Your blood sugar is in a good range, but your blood pressure is high.").
    4.  **Healthy Tip:** Give one simple, actionable piece of advice (e.g., "Try to reduce salt in your food to help with your blood pressure.").

    Be gentle, positive, and keep the language very simple.
  `;

  try {
    // 5. Call the AI
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summaryText = response.text();
    
    res.json({ summary: summaryText });

  } catch (err) {
    console.error("AI Summary Error:", err);
    // This will now send the real Google error to the frontend
    if (err.message && err.message.includes('404 Not Found')) {
        return res.status(500).json({ summary: "AI Summary Failed: The Google AI model was not found. Please check your Google Cloud project settings and enable the 'Vertex AI API'." });
    }
    res.status(500).json({ summary: "Sorry, I couldn't connect to the AI at this time. Please check the backend server." });
  }
});

// --- THIS IS THE NEW DELETE ROUTE ---
// @route   DELETE api/health/:id
// @desc    Delete a specific health metric by its ID
router.delete('/:id', auth, async (req, res) => {
  try {
    const metric = await HealthMetric.findOne({ _id: req.params.id, user: req.user.id });

    if (!metric) {
      return res.status(44).json({ msg: 'Metric not found or not authorized' });
    }

    await HealthMetric.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Metric deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
// --- END OF NEW ROUTE ---

module.exports = router;