import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Award } from "lucide-react";
import { generateWorkout, getAICoachAdvice } from "./services/aiService";
import { useAuth } from "./context/AuthContext";

// Import components
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import ActivityPage from "./pages/Activity";
import ProfilePage from "./pages/Profile";
import Workout from "./pages/Workout";
import Notifications from "./pages/Notifications";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main App Component
const FitnessBuddy = () => {
  const { user, isAuthenticated, login, signup, logout, token } = useAuth();
  const [todaySteps, setTodaySteps] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [aiWorkouts, setAiWorkouts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [coachQuestion, setCoachQuestion] = useState("");
  const [coachResponse, setCoachResponse] = useState("");

  const navigate = useNavigate();

  // Workout database
  const workoutDatabase = {
    beginner: {
      weight_loss: [
        {
          id: 1,
          name: "Morning Walk & Stretch",
          type: "cardio",
          duration: 20,
          calories: 120,
          exercises: ["Brisk Walk - 15 min", "Full Body Stretch - 5 min"],
        },
        {
          id: 2,
          name: "Bodyweight Basics",
          type: "strength",
          duration: 25,
          calories: 150,
          exercises: ["Squats - 3x10", "Push-ups - 3x8", "Plank - 3x30s"],
        },
        {
          id: 3,
          name: "Light Cardio Mix",
          type: "cardio",
          duration: 30,
          calories: 180,
          exercises: [
            "Jumping Jacks - 3 min",
            "High Knees - 2 min",
            "Walk - 15 min",
          ],
        },
      ],
      muscle_gain: [
        {
          id: 4,
          name: "Upper Body Intro",
          type: "strength",
          duration: 30,
          calories: 160,
          exercises: ["Push-ups - 3x10", "Dips - 3x8", "Arm Circles - 2 min"],
        },
        {
          id: 5,
          name: "Lower Body Basics",
          type: "strength",
          duration: 30,
          calories: 170,
          exercises: ["Squats - 3x12", "Lunges - 3x10", "Calf Raises - 3x15"],
        },
      ],
      endurance: [
        {
          id: 6,
          name: "Steady State Walk",
          type: "cardio",
          duration: 35,
          calories: 200,
          exercises: ["Brisk Walk - 30 min", "Cool Down Stretch - 5 min"],
        },
      ],
    },
    intermediate: {
      weight_loss: [
        {
          id: 7,
          name: "HIIT Burn",
          type: "cardio",
          duration: 25,
          calories: 280,
          exercises: [
            "Burpees - 4x12",
            "Mountain Climbers - 4x20",
            "Jump Squats - 4x15",
          ],
        },
        {
          id: 8,
          name: "Circuit Training",
          type: "mixed",
          duration: 35,
          calories: 320,
          exercises: [
            "Push-ups - 4x15",
            "Squats - 4x20",
            "Plank - 4x45s",
            "Jumping Jacks - 4x30s",
          ],
        },
      ],
      muscle_gain: [
        {
          id: 9,
          name: "Push Day",
          type: "strength",
          duration: 40,
          calories: 220,
          exercises: [
            "Push-ups - 4x15",
            "Pike Push-ups - 3x12",
            "Diamond Push-ups - 3x10",
          ],
        },
        {
          id: 10,
          name: "Pull Day",
          type: "strength",
          duration: 40,
          calories: 230,
          exercises: [
            "Pull-ups - 4x8",
            "Inverted Rows - 4x12",
            "Bicep Curls - 3x15",
          ],
        },
      ],
      endurance: [
        {
          id: 11,
          name: "Tempo Run",
          type: "cardio",
          duration: 45,
          calories: 400,
          exercises: ["5 min Warm-up", "30 min Tempo Run", "10 min Cool Down"],
        },
      ],
    },
    advanced: {
      weight_loss: [
        {
          id: 12,
          name: "Advanced HIIT",
          type: "cardio",
          duration: 30,
          calories: 380,
          exercises: [
            "Burpee Box Jumps - 5x10",
            "Sprint Intervals - 10x30s",
            "Plyo Lunges - 5x20",
          ],
        },
        {
          id: 13,
          name: "Metabolic Blast",
          type: "mixed",
          duration: 40,
          calories: 450,
          exercises: [
            "Complex 1 - 5 rounds",
            "Complex 2 - 5 rounds",
            "Finisher - 3 min",
          ],
        },
      ],
      muscle_gain: [
        {
          id: 14,
          name: "Heavy Push",
          type: "strength",
          duration: 50,
          calories: 280,
          exercises: [
            "Weighted Push-ups - 5x10",
            "Handstand Practice - 15 min",
            "Dips - 4x12",
          ],
        },
        {
          id: 15,
          name: "Heavy Pull",
          type: "strength",
          duration: 50,
          calories: 290,
          exercises: [
            "Weighted Pull-ups - 5x8",
            "One-arm Rows - 4x10",
            "Hanging Core - 4x20s",
          ],
        },
      ],
      endurance: [
        {
          id: 16,
          name: "Long Distance Run",
          type: "cardio",
          duration: 60,
          calories: 550,
          exercises: ["10 min Warm-up", "45 min Steady Run", "5 min Cool Down"],
        },
      ],
    },
  };

  // Load data from localStorage
  useEffect(() => {
    if (isAuthenticated) {
      const savedSteps = localStorage.getItem("todaySteps");
      if (savedSteps) setTodaySteps(parseInt(savedSteps));

      const savedHistory = localStorage.getItem("workoutHistory");
      if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory));
    }
  }, [isAuthenticated]);

  // Save data to localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem("todaySteps", todaySteps.toString());
      localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
    }
  }, [isAuthenticated, user, todaySteps, workoutHistory]);

  // Helper functions
  const showTempNotification = (text) => {
    setNotificationText(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getRecommendedWorkouts = () => {
    if (!user) return [];
    return workoutDatabase[user.fitnessLevel]?.[user.goal] || [];
  };

  const startWorkout = (workout) => {
    setCurrentWorkout(workout);
    navigate("/workout");
  };

  const completeWorkout = async () => {
    if (!currentWorkout || !token) return;

    try {
      const response = await fetch('http://localhost:5001/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: currentWorkout.name,
          type: currentWorkout.type,
          duration: currentWorkout.duration,
          calories: currentWorkout.calories,
          exercises: currentWorkout.exercises || [],
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Workout saved and notification sent automatically!
        setCurrentWorkout(null);
        navigate("/");
        showTempNotification("Workout Complete! Great job!");
      } else {
        console.error('Error saving workout:', data.error);
        showTempNotification("Workout completed but failed to save");
        navigate("/");
      }
    } catch (error) {
      console.error('Failed to save workout:', error);
      showTempNotification("Workout completed but failed to save");
      navigate("/");
    }
  };

  const addSteps = async (steps) => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5001/api/progress/steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ steps }),
      });

      const data = await response.json();

      if (response.ok) {
        setTodaySteps(data.progress.steps);
      }
    } catch (error) {
      console.error('Failed to add steps:', error);
      // Fallback to local state
      setTodaySteps((prev) => Math.min(prev + steps, 20000));
    }
  };

  const generateAIWorkouts = async () => {
    setIsGenerating(true);
    try {
      const workouts = await generateWorkout(user);
      setAiWorkouts(workouts);
      showTempNotification("🤖 AI Workouts Generated!");
    } catch (error) {
      console.error("Failed to generate workouts:", error);
      showTempNotification("Error generating workouts.");
    }
    setIsGenerating(false);
  };

  const askAICoach = async () => {
    if (!coachQuestion.trim()) return;
    setIsGenerating(true);
    setCoachResponse("");
    try {
      const response = await getAICoachAdvice(coachQuestion, user);
      setCoachResponse(response);
    } catch (error) {
      console.error("Failed to get advice:", error);
      setCoachResponse("Sorry, I encountered an error. Please try again.");
    }
    setIsGenerating(false);
  };

  // Data calculations
  const totalCalories = workoutHistory.reduce((sum, w) => sum + w.calories, 0);
  const weeklyWorkouts = workoutHistory.filter((w) => {
    const date = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date > weekAgo;
  }).length;

  const goalData = [
    { name: "Completed", value: todaySteps, color: "#10b981" },
    {
      name: "Remaining",
      value: Math.max(10000 - todaySteps, 0),
      color: "#e5e7eb",
    },
  ];

  return (
    <>
      {/* Global Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            <span className="font-semibold">{notificationText}</span>
          </div>
        </div>
      )}

      {/* AI Coach Modal */}
      {isAuthenticated && (
        <>
          <button
            onClick={() => setShowAICoach(true)}
            className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center z-40"
            title="Ask AI Fitness Coach"
          >
            <span className="text-2xl">🤖</span>
          </button>

          {showAICoach && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <span className="mr-2">🤖</span>
                    AI Fitness Coach
                  </h2>
                  <button
                    onClick={() => {
                      setShowAICoach(false);
                      setCoachQuestion("");
                      setCoachResponse("");
                    }}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Ask me anything about fitness, nutrition, workouts, or health!
                </p>

                <textarea
                  value={coachQuestion}
                  onChange={(e) => setCoachQuestion(e.target.value)}
                  placeholder="Example: What should I eat before a workout?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4 resize-none"
                  rows="4"
                />

                <button
                  onClick={askAICoach}
                  disabled={isGenerating || !coachQuestion.trim()}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin mr-2">⚡</span>
                      AI is thinking...
                    </span>
                  ) : (
                    "Ask AI Coach"
                  )}
                </button>

                {coachResponse && (
                  <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                    <div className="flex items-start">
                      <span className="text-2xl mr-3">💡</span>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Coach's Advice:
                        </h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">
                          {coachResponse}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Routes */}
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Login onLogin={login} />
          }
        />
        <Route
          path="/signup"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <Signup onSignup={signup} />
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={logout} />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Dashboard
                todaySteps={todaySteps}
                addSteps={addSteps}
                totalCalories={totalCalories}
                weeklyWorkouts={weeklyWorkouts}
                goalData={goalData}
                getRecommendedWorkouts={getRecommendedWorkouts}
                startWorkout={startWorkout}
                generateAIWorkouts={generateAIWorkouts}
                isGenerating={isGenerating}
                aiWorkouts={aiWorkouts}
              />
            }
          />
          <Route
            path="progress"
            element={<Progress workoutHistory={workoutHistory} />}
          />
          <Route
            path="activity"
            element={
              <ActivityPage
                workoutHistory={workoutHistory}
                todaySteps={todaySteps}
              />
            }
          />
          <Route
            path="profile"
            element={
              <ProfilePage
                user={user}
                workoutHistory={workoutHistory}
                todaySteps={todaySteps}
              />
            }
          />
          <Route
            path="notifications"
            element={<Notifications userProfile={user} />}
          />
        </Route>

        {/* Workout page - separate from main layout */}
        <Route
          path="/workout"
          element={
            <ProtectedRoute>
              <Workout
                currentWorkout={currentWorkout}
                completeWorkout={completeWorkout}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default FitnessBuddy;
