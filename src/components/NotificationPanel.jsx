import { useState } from "react";
import { Bell, Send, Dumbbell, Trophy, Zap } from "lucide-react";

export default function NotificationPanel({ userProfile }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const API_BASE_URL = "http://localhost:5001";

  const handleSendNotification = async (endpoint, body) => {
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: data.message || "Notification sent successfully!",
        });
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to send notification",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error: " + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const sendCustomNotification = () => {
    if (!phoneNumber || !customMessage) {
      setStatus({
        type: "error",
        message: "Please enter both phone number and message",
      });
      return;
    }

    handleSendNotification("/api/send-notification", {
      phoneNumber,
      message: customMessage,
    });
  };

  const sendWorkoutReminder = () => {
    if (!phoneNumber) {
      setStatus({
        type: "error",
        message: "Please enter a phone number",
      });
      return;
    }

    handleSendNotification("/api/send-workout-reminder", {
      phoneNumber,
      workoutName: "Full Body Workout",
    });
  };

  const sendWorkoutComplete = () => {
    if (!phoneNumber) {
      setStatus({
        type: "error",
        message: "Please enter a phone number",
      });
      return;
    }

    handleSendNotification("/api/send-workout-complete", {
      phoneNumber,
      workoutName: "Morning Cardio",
      calories: 250,
    });
  };

  const sendDailyMotivation = () => {
    if (!phoneNumber) {
      setStatus({
        type: "error",
        message: "Please enter a phone number",
      });
      return;
    }

    handleSendNotification("/api/send-motivation", {
      phoneNumber,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-6 h-6 text-blue-500" />
        <h2 className="text-2xl font-bold text-gray-800">SMS Notifications</h2>
      </div>

      {/* Phone Number Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number (E.164 format)
        </label>
        <input
          type="tel"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          Format: +[country code][number] (e.g., +12025551234)
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Quick Notifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={sendWorkoutReminder}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Dumbbell className="w-5 h-5" />
            Workout Reminder
          </button>

          <button
            onClick={sendWorkoutComplete}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Trophy className="w-5 h-5" />
            Workout Complete
          </button>

          <button
            onClick={sendDailyMotivation}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Zap className="w-5 h-5" />
            Daily Motivation
          </button>
        </div>
      </div>

      {/* Custom Message */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          Custom Message
        </h3>
        <textarea
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
          placeholder="Enter your custom notification message..."
          rows="4"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <button
          onClick={sendCustomNotification}
          disabled={loading}
          className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
          {loading ? "Sending..." : "Send Custom Notification"}
        </button>
      </div>

      {/* Status Message */}
      {status.message && (
        <div
          className={`p-4 rounded-lg ${
            status.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          <p className="font-medium">{status.message}</p>
        </div>
      )}

      {/* Info Section */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-2">
          Notification Types:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            <strong>Workout Reminder:</strong> Motivates you to start your
            workout
          </li>
          <li>
            <strong>Workout Complete:</strong> Celebrates your workout completion
          </li>
          <li>
            <strong>Daily Motivation:</strong> Sends a random motivational
            message
          </li>
          <li>
            <strong>Custom Message:</strong> Send any message you want
          </li>
        </ul>
      </div>
    </div>
  );
}
