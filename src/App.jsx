// src/App.jsx
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Activity, Award, Dumbbell, Flame } from "lucide-react";
import { generateWorkout, getAICoachAdvice } from "./services/aiService";

// Firebase
import { auth, googleProvider } from "./firebaseConfig";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from "firebase/auth";

// Import the app pages / layout
import Layout from "./Layout"; // main layout (Header + Nav)
// import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import ActivityPage from "./pages/Activity";
import ProfilePage from "./pages/Profile";
import Workout from "./pages/Workout";
import Login from "./pages/Login"; // login page (you should have this)
import Signup from "./pages/Signup"; // if you use Signup page (note: filename in repo was Sigup.jsx)

// ------------------- Onboarding component (same as friend's) -------------------
const Onboarding = ({ onComplete }) => {
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "male",
    fitnessLevel: "beginner",
    goal: "weight_loss",
    equipment: [],
  });

  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      const newUser = { ...formData, joinDate: new Date().toISOString() };
      onComplete(newUser); // Pass the new user up to App
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">AI Fitness Buddy</h1>
          <p className="text-gray-600">Your personal workout companion</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[0, 1, 2].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 mx-1 rounded-full ${
                  step <= onboardingStep ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {onboardingStep === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Age"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
              <select
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Weight (kg)"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
              <input
                type="number"
                placeholder="Height (cm)"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
          </div>
        )}

        {onboardingStep === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fitness Profile</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fitness Level</label>
              <div className="grid grid-cols-3 gap-2">
                {["beginner", "intermediate", "advanced"].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFormData({ ...formData, fitnessLevel: level })}
                    className={`py-3 px-4 rounded-lg border-2 capitalize ${
                      formData.fitnessLevel === level ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Goal</label>
              <div className="space-y-2">
                {[
                  { value: "weight_loss", label: "Weight Loss", icon: "🔥" },
                  { value: "muscle_gain", label: "Muscle Gain", icon: "💪" },
                  { value: "endurance", label: "Endurance", icon: "🏃" },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => setFormData({ ...formData, goal: goal.value })}
                    className={`w-full py-3 px-4 rounded-lg border-2 flex items-center ${
                      formData.goal === goal.value ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600"
                    }`}
                  >
                    <span className="text-2xl mr-3">{goal.icon}</span>
                    <span className="font-medium">{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {onboardingStep === 2 && (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto">
              <Award className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">All Set!</h2>
            <p className="text-gray-600">Your personalized fitness plan is ready. Let's start your journey to a healthier you!</p>
          </div>
        )}

        <button
          onClick={handleOnboardingNext}
          disabled={
            onboardingStep === 0 &&
            (!formData.name || !formData.age || !formData.weight || !formData.height)
          }
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {onboardingStep === 2 ? "Start My Journey" : "Continue"}
        </button>
      </div>
    </div>
  );
};

// ------------------- Main App component -------------------
const FitnessBuddy = () => {
  // state
  const [user, setUser] = useState(null); // firebase user object (or custom)
  const [showOnboarding, setShowOnboarding] = useState(true);
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

  // Workout DB (same as friend's)
  const workoutDatabase = {
    beginner: {
      weight_loss: [
        { id: 1, name: "Morning Walk & Stretch", type: "cardio", duration: 20, calories: 120, exercises: ["Brisk Walk - 15 min", "Full Body Stretch - 5 min"] },
        { id: 2, name: "Bodyweight Basics", type: "strength", duration: 25, calories: 150, exercises: ["Squats - 3x10", "Push-ups - 3x8", "Plank - 3x30s"] },
        { id: 3, name: "Light Cardio Mix", type: "cardio", duration: 30, calories: 180, exercises: ["Jumping Jacks - 3 min", "High Knees - 2 min", "Walk - 15 min"] },
      ],
      muscle_gain: [
        { id: 4, name: "Upper Body Intro", type: "strength", duration: 30, calories: 160, exercises: ["Push-ups - 3x10", "Dips - 3x8", "Arm Circles - 2 min"] },
        { id: 5, name: "Lower Body Basics", type: "strength", duration: 30, calories: 170, exercises: ["Squats - 3x12", "Lunges - 3x10", "Calf Raises - 3x15"] },
      ],
      endurance: [{ id: 6, name: "Steady State Walk", type: "cardio", duration: 35, calories: 200, exercises: ["Brisk Walk - 30 min", "Cool Down Stretch - 5 min"] }],
    },
    intermediate: {
      weight_loss: [
        { id: 7, name: "HIIT Burn", type: "cardio", duration: 25, calories: 280, exercises: ["Burpees - 4x12", "Mountain Climbers - 4x20", "Jump Squats - 4x15"] },
        { id: 8, name: "Circuit Training", type: "mixed", duration: 35, calories: 320, exercises: ["Push-ups - 4x15", "Squats - 4x20", "Plank - 4x45s", "Jumping Jacks - 4x30s"] },
      ],
      muscle_gain: [
        { id: 9, name: "Push Day", type: "strength", duration: 40, calories: 220, exercises: ["Push-ups - 4x15", "Pike Push-ups - 3x12", "Diamond Push-ups - 3x10"] },
        { id: 10, name: "Pull Day", type: "strength", duration: 40, calories: 230, exercises: ["Pull-ups - 4x8", "Inverted Rows - 4x12", "Bicep Curls - 3x15"] },
      ],
      endurance: [{ id: 11, name: "Tempo Run", type: "cardio", duration: 45, calories: 400, exercises: ["5 min Warm-up", "30 min Tempo Run", "10 min Cool Down"] }],
    },
    advanced: {
      weight_loss: [
        { id: 12, name: "Advanced HIIT", type: "cardio", duration: 30, calories: 380, exercises: ["Burpee Box Jumps - 5x10", "Sprint Intervals - 10x30s", "Plyo Lunges - 5x20"] },
        { id: 13, name: "Metabolic Blast", type: "mixed", duration: 40, calories: 450, exercises: ["Complex 1 - 5 rounds", "Complex 2 - 5 rounds", "Finisher - 3 min"] },
      ],
      muscle_gain: [
        { id: 14, name: "Heavy Push", type: "strength", duration: 50, calories: 280, exercises: ["Weighted Push-ups - 5x10", "Handstand Practice - 15 min", "Dips - 4x12"] },
        { id: 15, name: "Heavy Pull", type: "strength", duration: 50, calories: 290, exercises: ["Weighted Pull-ups - 5x8", "One-arm Rows - 4x10", "Hanging Core - 4x20s"] },
      ],
      endurance: [{ id: 16, name: "Long Distance Run", type: "cardio", duration: 60, calories: 550, exercises: ["10 min Warm-up", "45 min Steady Run", "5 min Cool Down"] }],
    },
  };

  // ---------- Local storage load/save ----------
  useEffect(() => {
    const savedUser = localStorage.getItem("fitnessUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setShowOnboarding(false);
    }

    const savedSteps = localStorage.getItem("todaySteps");
    if (savedSteps) setTodaySteps(parseInt(savedSteps || "0", 10));

    const savedHistory = localStorage.getItem("workoutHistory");
    if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory || "[]"));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("fitnessUser", JSON.stringify(user));
      localStorage.setItem("todaySteps", todaySteps.toString());
      localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
    }
  }, [user, todaySteps, workoutHistory]);

  // ---------- Firebase auth listener ----------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        // Map firebase user to app user shape (keep fields you need)
        const mapped = {
          uid: fbUser.uid,
          name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
          email: fbUser.email,
          photoURL: fbUser.photoURL || null,
        };
        setUser(mapped);
        setShowOnboarding(false);
      } else {
        setUser(null);
        setShowOnboarding(true); // show onboarding or login depending on flow
      }
    });
    return () => unsub();
  }, []);

  // ---------- Helpers ----------
  const showTempNotification = (text) => {
    setNotificationText(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleOnboardingComplete = (newUser) => {
    // merge any additional fields and persist
    setUser((prev) => ({ ...(prev || {}), ...newUser }));
    setShowOnboarding(false);
    showTempNotification("Welcome! Your journey starts now!");
  };

  const getRecommendedWorkouts = () => {
    if (!user) return [];
    return workoutDatabase[user.fitnessLevel] ? workoutDatabase[user.fitnessLevel][user.goal] || [] : [];
  };

  const startWorkout = (workout) => {
    setCurrentWorkout(workout);
    navigate("/workout");
  };

  const completeWorkout = () => {
    if (!currentWorkout) return;
    const completed = { ...currentWorkout, date: new Date().toISOString(), completed: true };
    setWorkoutHistory((prev) => [completed, ...prev]);
    setCurrentWorkout(null);
    navigate("/");
    showTempNotification("Workout Complete! Great job!");
  };

  const addSteps = (steps) => setTodaySteps((prev) => Math.min(prev + steps, 20000));

  const generateAIWorkouts = async () => {
    setIsGenerating(true);
    try {
      const workouts = await generateWorkout(user);
      setAiWorkouts(workouts);
      showTempNotification("🤖 AI Workouts Generated!");
    } catch (err) {
      console.error(err);
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
    } catch (err) {
      console.error(err);
      setCoachResponse("Sorry, I encountered an error. Please try again.");
    }
    setIsGenerating(false);
  };

  // Data calculations
  const totalCalories = workoutHistory.reduce((sum, w) => sum + (w.calories || 0), 0);
  const weeklyWorkouts = workoutHistory.filter((w) => new Date(w.date) > (function(){ const d=new Date(); d.setDate(d.getDate()-7); return d; })()).length;

  const goalData = [
    { name: "Completed", value: todaySteps, color: "#10b981" },
    { name: "Remaining", value: Math.max(10000 - todaySteps, 0), color: "#e5e7eb" },
  ];

  // Auth: logout
  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setShowOnboarding(true);
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      showTempNotification("Logout failed");
    }
  };

  // If not signed in -> show Login page (you must have Login page that calls onLoginSuccess)
  if (!user) {
    return (
      <Login
        onLoginSuccess={(fbUser) => {
          const mapped = {
            uid: fbUser.uid,
            name: fbUser.displayName || fbUser.email?.split("@")[0] || "User",
            email: fbUser.email,
            photoURL: fbUser.photoURL || null,
          };
          setUser(mapped);
          setShowOnboarding(false);
        }}
      />
    );
  }

  // Show onboarding if required
  if (showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  // Main app router
  return (
    <>
      {/* Global notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            <span className="font-semibold">{notificationText}</span>
          </div>
        </div>
      )}

      {/* AI Coach FAB */}
      <button
        onClick={() => setShowAICoach(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center z-40"
        title="Ask AI Fitness Coach"
      >
        <span className="text-2xl">🤖</span>
      </button>

      {/* AI Coach Modal */}
      {showAICoach && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className="mr-2">🤖</span> AI Fitness Coach
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
              {isGenerating ? "AI is thinking..." : "Ask AI Coach"}
            </button>

            {coachResponse && (
              <div className="mt-6 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                <div className="flex items-start">
                  <span className="text-2xl mr-3">💡</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-2">Coach's Advice:</h3>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{coachResponse}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* App routes (Layout wraps main pages) */}
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
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

          <Route path="progress" element={<Progress workoutHistory={workoutHistory} />} />

          <Route path="activity" element={<ActivityPage workoutHistory={workoutHistory} todaySteps={todaySteps} />} />

          <Route
            path="profile"
            element={<ProfilePage user={user} workoutHistory={workoutHistory} todaySteps={todaySteps} />}
          />
        </Route>

        <Route path="/workout" element={<Workout currentWorkout={currentWorkout} completeWorkout={completeWorkout} />} />
      </Routes>
    </>
  );
};

export default FitnessBuddy;

