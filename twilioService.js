import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send SMS notification using Twilio
 * @param {string} to - Recipient phone number (E.164 format: +1234567890)
 * @param {string} message - Message to send
 * @returns {Promise} - Twilio message response
 */
export async function sendSMS(to, message) {
  try {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error("Twilio credentials not configured");
    }

    if (!process.env.TWILIO_PHONE_NUMBER) {
      throw new Error("Twilio phone number not configured");
    }

    const messageResponse = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log(`✅ SMS sent successfully! SID: ${messageResponse.sid}`);
    return {
      success: true,
      messageSid: messageResponse.sid,
      status: messageResponse.status,
    };
  } catch (error) {
    console.error("❌ Error sending SMS:", error.message);
    throw error;
  }
}

/**
 * Send workout reminder notification
 * @param {string} to - Recipient phone number
 * @param {string} workoutName - Name of the workout
 * @returns {Promise}
 */
export async function sendWorkoutReminder(to, workoutName) {
  const message = `🏋️ Fitness Buddy Reminder!\n\nTime for your "${workoutName}" workout! Stay consistent and crush your goals! 💪`;
  return sendSMS(to, message);
}

/**
 * Send workout completion congratulations
 * @param {string} to - Recipient phone number
 * @param {string} workoutName - Name of the completed workout
 * @param {number} calories - Calories burned
 * @returns {Promise}
 */
export async function sendWorkoutComplete(to, workoutName, calories) {
  const message = `🎉 Great job!\n\nYou completed "${workoutName}" and burned ${calories} calories! Keep up the amazing work! 🔥`;
  return sendSMS(to, message);
}

/**
 * Send daily motivation message
 * @param {string} to - Recipient phone number
 * @returns {Promise}
 */
export async function sendDailyMotivation(to) {
  const motivationalMessages = [
    "💪 Your only limit is you! Make today count!",
    "🔥 Success starts with self-discipline. Let's workout!",
    "⚡ The body achieves what the mind believes!",
    "🏆 Every workout is progress. Keep going!",
    "💯 Your future self will thank you for working out today!",
  ];

  const randomMessage =
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  return sendSMS(to, randomMessage);
}

/**
 * Validate phone number format (basic validation)
 * @param {string} phoneNumber - Phone number to validate
 * @returns {boolean}
 */
export function isValidPhoneNumber(phoneNumber) {
  // E.164 format: +[country code][number]
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phoneNumber);
}
