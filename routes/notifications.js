import express from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';
import { updateUserNotifications } from '../services/notificationScheduler.js';

const router = express.Router();

// @route   GET /api/notifications/settings
// @desc    Get user's notification settings
// @access  Private
router.get('/settings', protect, async (req, res) => {
  console.log('🎯 /api/notifications/settings GET endpoint hit!');

  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      settings: user.notificationSettings,
    });
  } catch (error) {
    console.error('❌ Get Notification Settings Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error fetching notification settings',
    });
  }
});

// @route   PUT /api/notifications/settings
// @desc    Update user's notification settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
  console.log('🎯 /api/notifications/settings PUT endpoint hit!');

  const { workoutReminder, dailyMotivation } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    // Update workout reminder settings
    if (workoutReminder !== undefined) {
      if (workoutReminder.enabled !== undefined) {
        user.notificationSettings.workoutReminder.enabled = workoutReminder.enabled;
      }
      if (workoutReminder.time) {
        // Validate time format (HH:MM)
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(workoutReminder.time)) {
          return res.status(400).json({
            error: 'Invalid time format. Use HH:MM (24-hour format)',
          });
        }
        user.notificationSettings.workoutReminder.time = workoutReminder.time;
      }
      if (workoutReminder.days) {
        // Validate days (0-6)
        if (!Array.isArray(workoutReminder.days) ||
            !workoutReminder.days.every(day => day >= 0 && day <= 6)) {
          return res.status(400).json({
            error: 'Invalid days. Use array of numbers 0-6 (0=Sunday, 6=Saturday)',
          });
        }
        user.notificationSettings.workoutReminder.days = workoutReminder.days;
      }
    }

    // Update daily motivation settings
    if (dailyMotivation !== undefined) {
      if (dailyMotivation.enabled !== undefined) {
        user.notificationSettings.dailyMotivation.enabled = dailyMotivation.enabled;
      }
      if (dailyMotivation.time) {
        // Validate time format (HH:MM)
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(dailyMotivation.time)) {
          return res.status(400).json({
            error: 'Invalid time format. Use HH:MM (24-hour format)',
          });
        }
        user.notificationSettings.dailyMotivation.time = dailyMotivation.time;
      }
    }

    await user.save();

    // Update scheduled notifications
    await updateUserNotifications(user._id.toString());

    console.log('✅ Notification settings updated successfully!');

    res.json({
      success: true,
      settings: user.notificationSettings,
      message: 'Notification settings updated successfully',
    });
  } catch (error) {
    console.error('❌ Update Notification Settings Error:', error.message);
    res.status(500).json({
      error: error.message || 'Server error updating notification settings',
    });
  }
});

// @route   POST /api/notifications/test
// @desc    Send a test notification to the user
// @access  Private
router.post('/test', protect, async (req, res) => {
  console.log('🎯 /api/notifications/test endpoint hit!');

  const { type } = req.body; // 'workout' or 'motivation'

  try {
    const { sendWorkoutReminder, sendDailyMotivation } = await import('../twilioService.js');

    if (type === 'workout') {
      await sendWorkoutReminder(req.user.phoneNumber, 'your test workout');
      console.log('✅ Test workout reminder sent!');
    } else if (type === 'motivation') {
      await sendDailyMotivation(req.user.phoneNumber);
      console.log('✅ Test motivation sent!');
    } else {
      return res.status(400).json({
        error: 'Invalid type. Use "workout" or "motivation"',
      });
    }

    res.json({
      success: true,
      message: `Test ${type} notification sent to ${req.user.phoneNumber}`,
    });
  } catch (error) {
    console.error('❌ Send Test Notification Error:', error.message);
    res.status(500).json({
      error: error.message || 'Failed to send test notification',
    });
  }
});

export default router;
