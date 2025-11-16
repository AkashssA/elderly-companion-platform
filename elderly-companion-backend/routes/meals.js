const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Meal = require('../models/Meal');
const moment = require('moment'); 

// @route   POST api/meals
// @desc    Log a new meal
router.post('/', auth, async (req, res) => {
  const { date, mealType, description } = req.body;
  try {
    // Find and update a meal if it exists for that type and day, or create it if it doesn't.
    const meal = await Meal.findOneAndUpdate(
      { user: req.user.id, date, mealType },
      { description },
      { new: true, upsert: true }
    );
    res.json(meal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/meals/by-date/:date
// @desc    Get all meals for a specific date (YYYY-MM-DD)
router.get('/by-date/:date', auth, async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id, date: req.params.date });
    res.json(meals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/meals/weekly
// @desc    Get meals for the last 7 days AND next 7 days
router.get('/weekly', auth, async (req, res) => {
    try {
        const sevenDaysAgo = moment().subtract(7, 'days').format('YYYY-MM-DD');
        const sevenDaysFromNow = moment().add(7, 'days').format('YYYY-MM-DD');
        
        const meals = await Meal.find({
            user: req.user.id,
            date: { $gte: sevenDaysAgo, $lte: sevenDaysFromNow }
        }).sort({ date: 1 });

        res.json(meals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// --- THIS IS THE DELETE ROUTE ---
// @route   DELETE api/meals/:id
// @desc    Delete a meal by its ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const meal = await Meal.findOne({ _id: req.params.id, user: req.user.id });

        if (!meal) {
            return res.status(404).json({ msg: 'Meal not found or not authorized' });
        }

        await Meal.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Meal removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});
// --- END OF NEW ROUTE ---

module.exports = router;