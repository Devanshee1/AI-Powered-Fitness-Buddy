import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/Dashboard";
import Progress from "./pages/Progress";
import ActivityPage from "./pages/Activity";
import ProfilePage from "./pages/ProfilePage";
import Workout from "./pages/Workout";
import Login from "./pages/Login";
import OnboardingPage from "./pages/OnboardingPage";

// ---------------- Main App ----------------
const FitnessBuddy = () => {
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [todaySteps, setTodaySteps] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [aiWorkouts, setAiWorkouts] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Load current logged in user
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser) {
      setUser(savedUser);
      setShowOnboarding(false);
    }

    const savedSteps = localStorage.getItem("todaySteps");
    if (savedSteps) setTodaySteps(parseInt(savedSteps || "0", 10));

    const savedHistory = localStorage.getItem("workoutHistory");
    if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory || "[]"));
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      localStorage.setItem("todaySteps", todaySteps.toString());
      localStorage.setItem("workoutHistory", JSON.stringify(workoutHistory));
    }
  }, [user, todaySteps, workoutHistory]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
    setShowOnboarding(false);
    navigate("/");
  };

  // AI workouts function
  const generateAIWorkouts = async () => {
    setIsGenerating(true);
    try {
      // keep your friend's AI service code intact
      const workouts = await generateWorkout(user);
      setAiWorkouts(workouts);
    } catch (err) {
      console.error(err);
    }
    setIsGenerating(false);
  };

  if (!user) {
    return <Login onLoginSuccess={(u) => { setUser(u); setShowOnboarding(true); }} />;
  }

  if (showOnboarding) {
    return <OnboardingPage currentUser={user} onComplete={(newUser) => { setUser(newUser); setShowOnboarding(false); }} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
        <Route
          index
          element={
            <Dashboard
              todaySteps={todaySteps}
              addSteps={(steps) => setTodaySteps(prev => Math.min(prev + steps, 20000))}
              totalCalories={workoutHistory.reduce((sum, w) => sum + (w.calories || 0), 0)}
              weeklyWorkouts={workoutHistory.filter((w) => new Date(w.date) > new Date(new Date().setDate(new Date().getDate() - 7))).length}
              goalData={[
                { name: "Completed", value: todaySteps, color: "#10b981" },
                { name: "Remaining", value: Math.max(10000 - todaySteps, 0), color: "#e5e7eb" },
              ]}
              getRecommendedWorkouts={() => workoutHistory}
              startWorkout={(w) => setCurrentWorkout(w)}
              generateAIWorkouts={generateAIWorkouts}
              isGenerating={isGenerating}
              aiWorkouts={aiWorkouts}
            />
          }
        />
        <Route path="progress" element={<Progress workoutHistory={workoutHistory} />} />
        <Route path="activity" element={<ActivityPage workoutHistory={workoutHistory} todaySteps={todaySteps} />} />
        <Route path="profile" element={<ProfilePage user={user} workoutHistory={workoutHistory} todaySteps={todaySteps} />} />
      </Route>
      <Route path="/workout" element={<Workout currentWorkout={currentWorkout} completeWorkout={() => {}} />} />
    </Routes>
  );
};

export default FitnessBuddy;

