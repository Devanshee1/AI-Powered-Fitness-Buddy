import cron from 'node-cron';
import User from '../models/User.js';
import { sendWorkoutReminder, sendDailyMotivation } from '../twilioService.js';

// Store active cron jobs
const cronJobs = new Map();

/**
 * Initialize all scheduled notifications
 * This should be called when the server starts
 */
export const initializeScheduler = async () => {
  console.log('🕐 Initializing notification scheduler...');

  try {
    // Get all users with enabled notifications
    const users = await User.find({
      $or: [
        { 'notificationSettings.workoutReminder.enabled': true },
        { 'notificationSettings.dailyMotivation.enabled': true },
      ],
    });

    console.log(`📱 Found ${users.length} users with enabled notifications`);

    // Schedule notifications for each user
    for (const user of users) {
      scheduleUserNotifications(user);
    }

    console.log('✅ Notification scheduler initialized');
  } catch (error) {
    console.error('❌ Error initializing scheduler:', error.message);
  }
};

/**
 * Schedule notifications for a specific user
 * @param {Object} user - User document from MongoDB
 */
export const scheduleUserNotifications = (user) => {
  const userId = user._id.toString();

  // Clear existing jobs for this user
  clearUserNotifications(userId);

  // Schedule workout reminder
  if (user.notificationSettings?.workoutReminder?.enabled) {
    const { time, days } = user.notificationSettings.workoutReminder;
    const [hour, minute] = time.split(':');

    // Create cron expression
    // Format: minute hour * * dayOfWeek
    const cronExpression = `${minute} ${hour} * * ${days.join(',')}`;

    console.log(`⏰ Scheduling workout reminder for ${user.name} at ${time} on days ${days.join(',')}`);

    const job = cron.schedule(cronExpression, async () => {
      try {
        console.log(`📤 Sending workout reminder to ${user.name} (${user.phoneNumber})`);
        await sendWorkoutReminder(user.phoneNumber, "your workout");
        console.log(`✅ Workout reminder sent to ${user.name}`);
      } catch (error) {
        console.error(`❌ Failed to send workout reminder to ${user.name}:`, error.message);
      }
    }, {
      timezone: 'America/New_York', // Change this to your timezone
    });

    cronJobs.set(`${userId}-workout`, job);
  }

  // Schedule daily motivation
  if (user.notificationSettings?.dailyMotivation?.enabled) {
    const { time } = user.notificationSettings.dailyMotivation;
    const [hour, minute] = time.split(':');

    // Daily cron expression (runs every day)
    const cronExpression = `${minute} ${hour} * * *`;

    console.log(`⏰ Scheduling daily motivation for ${user.name} at ${time}`);

    const job = cron.schedule(cronExpression, async () => {
      try {
        console.log(`📤 Sending daily motivation to ${user.name} (${user.phoneNumber})`);
        await sendDailyMotivation(user.phoneNumber);
        console.log(`✅ Daily motivation sent to ${user.name}`);
      } catch (error) {
        console.error(`❌ Failed to send daily motivation to ${user.name}:`, error.message);
      }
    }, {
      timezone: 'America/New_York', // Change this to your timezone
    });

    cronJobs.set(`${userId}-motivation`, job);
  }
};

/**
 * Clear all scheduled notifications for a user
 * @param {String} userId - User ID
 */
export const clearUserNotifications = (userId) => {
  const workoutJob = cronJobs.get(`${userId}-workout`);
  const motivationJob = cronJobs.get(`${userId}-motivation`);

  if (workoutJob) {
    workoutJob.stop();
    cronJobs.delete(`${userId}-workout`);
    console.log(`🛑 Stopped workout reminder for user ${userId}`);
  }

  if (motivationJob) {
    motivationJob.stop();
    cronJobs.delete(`${userId}-motivation`);
    console.log(`🛑 Stopped daily motivation for user ${userId}`);
  }
};

/**
 * Update scheduled notifications for a user
 * Call this when user updates their notification settings
 * @param {String} userId - User ID
 */
export const updateUserNotifications = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return;
    }

    console.log(`🔄 Updating notifications for ${user.name}`);
    scheduleUserNotifications(user);
  } catch (error) {
    console.error('❌ Error updating user notifications:', error.message);
  }
};

/**
 * Stop all scheduled notifications
 * Call this when shutting down the server
 */
export const stopAllNotifications = () => {
  console.log('🛑 Stopping all scheduled notifications...');

  for (const [key, job] of cronJobs.entries()) {
    job.stop();
    console.log(`🛑 Stopped job: ${key}`);
  }

  cronJobs.clear();
  console.log('✅ All notifications stopped');
};

// Graceful shutdown
process.on('SIGTERM', stopAllNotifications);
process.on('SIGINT', stopAllNotifications);

export default {
  initializeScheduler,
  scheduleUserNotifications,
  clearUserNotifications,
  updateUserNotifications,
  stopAllNotifications,
};
