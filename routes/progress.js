import express from 'express';
import Progress from '../models/Progress.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/progress
// @desc    Update today's progress (steps, calories, weight)
// @access  Private
router.post('/', protect, async (req, res) => {
  console.log('🎯 /api/progress POST endpoint hit!');

  const { steps, caloriesBurned, weight } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const updateData = {};
    if (steps !== undefined) updateData.steps = steps;
    if (caloriesBurned !== undefined) updateData.caloriesBurned = caloriesBurned;
    if (weight !== undefined) updateData.weight = weight;

    const progress = await Progress.findOneAndUpdate(
      {
        userId: req.user._id,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        ...updateData,
        userId: req.user._id,
        date: today,
      },
      { upsert: true, new: true }
    );

    console.log('✅ Progress updated successfully!');

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error('❌ Update Progress Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error updating progress',
    });
  }
});

// @route   POST /api/progress/steps
// @desc    Add steps to today's progress
// @access  Private
router.post('/steps', protect, async (req, res) => {
  console.log('🎯 /api/progress/steps endpoint hit!');

  const { steps } = req.body;

  try {
    if (!steps || steps < 0) {
      return res.status(400).json({
        error: 'Please provide a valid number of steps',
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const progress = await Progress.findOneAndUpdate(
      {
        userId: req.user._id,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        $inc: { steps: steps },
        $setOnInsert: {
          userId: req.user._id,
          date: today,
        },
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Added ${steps} steps to progress!`);

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error('❌ Add Steps Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error adding steps',
    });
  }
});

// @route   GET /api/progress
// @desc    Get progress for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  console.log('🎯 /api/progress GET endpoint hit!');

  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));
    daysAgo.setHours(0, 0, 0, 0);

    const progressData = await Progress.find({
      userId: req.user._id,
      date: { $gte: daysAgo },
    }).sort({ date: 1 });

    res.json({
      success: true,
      progress: progressData,
    });
  } catch (error) {
    console.error('❌ Get Progress Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error fetching progress',
    });
  }
});

// @route   GET /api/progress/today
// @desc    Get today's progress
// @access  Private
router.get('/today', protect, async (req, res) => {
  console.log('🎯 /api/progress/today endpoint hit!');

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let progress = await Progress.findOne({
      userId: req.user._id,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    // If no progress for today, create a new entry
    if (!progress) {
      progress = await Progress.create({
        userId: req.user._id,
        date: today,
        steps: 0,
        caloriesBurned: 0,
        workoutsCompleted: 0,
      });
    }

    res.json({
      success: true,
      progress,
    });
  } catch (error) {
    console.error('❌ Get Today Progress Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error fetching today\'s progress',
    });
  }
});

// @route   GET /api/progress/weekly
// @desc    Get weekly aggregated progress data
// @access  Private
router.get('/weekly', protect, async (req, res) => {
  console.log('🎯 /api/progress/weekly endpoint hit!');

  try {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    weekAgo.setHours(0, 0, 0, 0);

    const progressData = await Progress.find({
      userId: req.user._id,
      date: { $gte: weekAgo },
    }).sort({ date: 1 });

    // Format data for charts
    const weeklyData = progressData.map((day) => ({
      day: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
      date: day.date,
      steps: day.steps,
      calories: day.caloriesBurned,
      workouts: day.workoutsCompleted,
    }));

    res.json({
      success: true,
      weeklyData,
    });
  } catch (error) {
    console.error('❌ Get Weekly Progress Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error fetching weekly progress',
    });
  }
});

export default router;
