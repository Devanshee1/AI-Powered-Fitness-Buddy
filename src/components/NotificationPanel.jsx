import { useState, useEffect } from "react";
import { Bell, Send, Dumbbell, Trophy, Zap, Clock, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function NotificationPanel({ userProfile }) {
  const { token } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Scheduled notification settings
  const [settings, setSettings] = useState({
    workoutReminder: {
      enabled: false,
      time: "09:00",
      days: [1, 2, 3, 4, 5], // Mon-Fri
    },
    dailyMotivation: {
      enabled: false,
      time: "08:00",
    },
  });
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const API_BASE_URL = "http://localhost:5001";

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Fetch notification settings on mount
  useEffect(() => {
    fetchSettings();
  }, [token]);

  const fetchSettings = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/settings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    }
  };

  const saveSettings = async () => {
    if (!token) {
      setStatus({
        type: "error",
        message: "Please log in to save notification settings",
      });
      return;
    }

    setSettingsLoading(true);
    setSettingsSaved(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/notifications/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (response.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      } else {
        setStatus({
          type: "error",
          message: data.error || "Failed to save settings",
        });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: "Network error: " + error.message,
      });
    } finally {
      setSettingsLoading(false);
    }
  };

  const toggleDay = (day) => {
    setSettings((prev) => ({
      ...prev,
      workoutReminder: {
        ...prev.workoutReminder,
        days: prev.workoutReminder.days.includes(day)
          ? prev.workoutReminder.days.filter((d) => d !== day)
          : [...prev.workoutReminder.days, day].sort(),
      },
    }));
  };

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
    <div className="space-y-6">
      {/* Scheduled Notifications Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Scheduled Reminders</h2>
        </div>

        {/* Workout Reminder Settings */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-orange-500" />
              <h3 className="text-lg font-semibold text-gray-800">Workout Reminder</h3>
            </div>
            <button
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  workoutReminder: {
                    ...prev.workoutReminder,
                    enabled: !prev.workoutReminder.enabled,
                  },
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.workoutReminder.enabled ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.workoutReminder.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {settings.workoutReminder.enabled && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={settings.workoutReminder.time}
                  onChange={(e) =>
                    setSettings((prev) => ({
                      ...prev,
                      workoutReminder: {
                        ...prev.workoutReminder,
                        time: e.target.value,
                      },
                    }))
                  }
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Days
                </label>
                <div className="flex gap-2 flex-wrap">
                  {dayNames.map((day, index) => (
                    <button
                      key={index}
                      onClick={() => toggleDay(index)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        settings.workoutReminder.days.includes(index)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Daily Motivation Settings */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-gray-800">Daily Motivation</h3>
            </div>
            <button
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  dailyMotivation: {
                    ...prev.dailyMotivation,
                    enabled: !prev.dailyMotivation.enabled,
                  },
                }))
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.dailyMotivation.enabled ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dailyMotivation.enabled ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {settings.dailyMotivation.enabled && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <input
                type="time"
                value={settings.dailyMotivation.time}
                onChange={(e) =>
                  setSettings((prev) => ({
                    ...prev,
                    dailyMotivation: {
                      ...prev.dailyMotivation,
                      time: e.target.value,
                    },
                  }))
                }
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Save Settings Button */}
        <button
          onClick={saveSettings}
          disabled={settingsLoading}
          className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          {settingsLoading ? "Saving..." : settingsSaved ? "Saved!" : "Save Schedule Settings"}
        </button>
      </div>

      {/* Manual Notifications Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">Manual Notifications</h2>
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
    </div>
  );
}
