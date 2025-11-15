import express from 'express';
import Workout from '../models/Workout.js';
import Progress from '../models/Progress.js';
import { protect } from '../middleware/auth.js';
import { sendWorkoutComplete } from '../twilioService.js';

const router = express.Router();

// @route   POST /api/workouts
// @desc    Create a new workout (when user completes one)
// @access  Private
router.post('/', protect, async (req, res) => {
  console.log('🎯 /api/workouts POST endpoint hit!');

  const { name, type, duration, calories, exercises } = req.body;

  try {
    // Validation
    if (!name || !type || !duration || !calories) {
      return res.status(400).json({
        error: 'Please provide all required fields: name, type, duration, calories',
      });
    }

    // Create workout
    const workout = await Workout.create({
      userId: req.user._id,
      name,
      type,
      duration,
      calories,
      exercises: exercises || [],
      completed: true,
      completedAt: new Date(),
    });

    // Update today's progress
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await Progress.findOneAndUpdate(
      {
        userId: req.user._id,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      {
        $inc: {
          caloriesBurned: calories,
          workoutsCompleted: 1,
        },
      },
      { upsert: true, new: true }
    );

    console.log('✅ Workout created successfully!');

    // Send workout completion notification
    if (req.user.phoneNumber) {
      try {
        await sendWorkoutComplete(req.user.phoneNumber, name, calories);
        console.log('✅ Workout completion notification sent!');
      } catch (notifError) {
        console.error('⚠️ Failed to send notification:', notifError.message);
        // Don't fail the request if notification fails
      }
    }

    res.status(201).json({
      success: true,
      workout,
    });
  } catch (error) {
    console.error('❌ Create Workout Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error creating workout',
    });
  }
});

// @route   GET /api/workouts
// @desc    Get all workouts for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  console.log('🎯 /api/workouts GET endpoint hit!');

  try {
    const { limit = 50, skip = 0 } = req.query;

    const workouts = await Workout.find({ userId: req.user._id })
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await Workout.countDocuments({ userId: req.user._id });

    res.json({
      success: true,
      workouts,
      total,
    });
  } catch (error) {
    console.error('❌ Get Workouts Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error fetching workouts',
    });
  }
});

// @route   GET /api/workouts/stats
// @desc    Get workout statistics for the logged-in user
// @access  Private
router.get('/stats', protect, async (req, res) => {
  console.log('🎯 /api/workouts/stats endpoint hit!');

  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days));

    const workouts = await Workout.find({
      userId: req.user._id,
      completedAt: { $gte: daysAgo },
    });

    const totalWorkouts = workouts.length;
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);

    res.json({
      success: true,
      stats: {
        totalWorkouts,
        totalCalories,
        totalDuration,
        period: `Last ${days} days`,
      },
    });
  } catch (error) {
    console.error('❌ Get Workout Stats Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error fetching workout stats',
    });
  }
});

export default router;
