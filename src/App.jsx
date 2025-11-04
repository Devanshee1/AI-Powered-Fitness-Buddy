import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, TrendingUp, Target, Award, Calendar, Dumbbell, Flame, User, ChevronRight, Bell, Settings, Home } from 'lucide-react';
import { generateWorkout, getAICoachAdvice } from './services/aiService';

const FitnessBuddy = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [todaySteps, setTodaySteps] = useState(0);
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [aiWorkouts, setAiWorkouts] = useState([]);
const [isGenerating, setIsGenerating] = useState(false);
const [showAICoach, setShowAICoach] = useState(false);
const [coachQuestion, setCoachQuestion] = useState('');
const [coachResponse, setCoachResponse] = useState('');

  // Onboarding form state
  const [onboardingStep, setOnboardingStep] = useState(0);
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: 'male',
    fitnessLevel: 'beginner',
    goal: 'weight_loss',
    equipment: []
  });

  // Workout database
  const workoutDatabase = {
    beginner: {
      weight_loss: [
        { id: 1, name: 'Morning Walk & Stretch', type: 'cardio', duration: 20, calories: 120, exercises: ['Brisk Walk - 15 min', 'Full Body Stretch - 5 min'] },
        { id: 2, name: 'Bodyweight Basics', type: 'strength', duration: 25, calories: 150, exercises: ['Squats - 3x10', 'Push-ups - 3x8', 'Plank - 3x30s'] },
        { id: 3, name: 'Light Cardio Mix', type: 'cardio', duration: 30, calories: 180, exercises: ['Jumping Jacks - 3 min', 'High Knees - 2 min', 'Walk - 15 min'] }
      ],
      muscle_gain: [
        { id: 4, name: 'Upper Body Intro', type: 'strength', duration: 30, calories: 160, exercises: ['Push-ups - 3x10', 'Dips - 3x8', 'Arm Circles - 2 min'] },
        { id: 5, name: 'Lower Body Basics', type: 'strength', duration: 30, calories: 170, exercises: ['Squats - 3x12', 'Lunges - 3x10', 'Calf Raises - 3x15'] }
      ],
      endurance: [
        { id: 6, name: 'Steady State Walk', type: 'cardio', duration: 35, calories: 200, exercises: ['Brisk Walk - 30 min', 'Cool Down Stretch - 5 min'] }
      ]
    },
    intermediate: {
      weight_loss: [
        { id: 7, name: 'HIIT Burn', type: 'cardio', duration: 25, calories: 280, exercises: ['Burpees - 4x12', 'Mountain Climbers - 4x20', 'Jump Squats - 4x15'] },
        { id: 8, name: 'Circuit Training', type: 'mixed', duration: 35, calories: 320, exercises: ['Push-ups - 4x15', 'Squats - 4x20', 'Plank - 4x45s', 'Jumping Jacks - 4x30s'] }
      ],
      muscle_gain: [
        { id: 9, name: 'Push Day', type: 'strength', duration: 40, calories: 220, exercises: ['Push-ups - 4x15', 'Pike Push-ups - 3x12', 'Diamond Push-ups - 3x10'] },
        { id: 10, name: 'Pull Day', type: 'strength', duration: 40, calories: 230, exercises: ['Pull-ups - 4x8', 'Inverted Rows - 4x12', 'Bicep Curls - 3x15'] }
      ],
      endurance: [
        { id: 11, name: 'Tempo Run', type: 'cardio', duration: 45, calories: 400, exercises: ['5 min Warm-up', '30 min Tempo Run', '10 min Cool Down'] }
      ]
    },
    advanced: {
      weight_loss: [
        { id: 12, name: 'Advanced HIIT', type: 'cardio', duration: 30, calories: 380, exercises: ['Burpee Box Jumps - 5x10', 'Sprint Intervals - 10x30s', 'Plyo Lunges - 5x20'] },
        { id: 13, name: 'Metabolic Blast', type: 'mixed', duration: 40, calories: 450, exercises: ['Complex 1 - 5 rounds', 'Complex 2 - 5 rounds', 'Finisher - 3 min'] }
      ],
      muscle_gain: [
        { id: 14, name: 'Heavy Push', type: 'strength', duration: 50, calories: 280, exercises: ['Weighted Push-ups - 5x10', 'Handstand Practice - 15 min', 'Dips - 4x12'] },
        { id: 15, name: 'Heavy Pull', type: 'strength', duration: 50, calories: 290, exercises: ['Weighted Pull-ups - 5x8', 'One-arm Rows - 4x10', 'Hanging Core - 4x20s'] }
      ],
      endurance: [
        { id: 16, name: 'Long Distance Run', type: 'cardio', duration: 60, calories: 550, exercises: ['10 min Warm-up', '45 min Steady Run', '5 min Cool Down'] }
      ]
    }
  };

  // Initialize demo data
  useEffect(() => {
    const savedUser = localStorage.getItem('fitnessUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setShowOnboarding(false);
      
      const savedSteps = localStorage.getItem('todaySteps');
      if (savedSteps) setTodaySteps(parseInt(savedSteps));
      
      const savedHistory = localStorage.getItem('workoutHistory');
      if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save data
  useEffect(() => {
    if (user) {
      localStorage.setItem('fitnessUser', JSON.stringify(user));
      localStorage.setItem('todaySteps', todaySteps.toString());
      localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory));
    }
  }, [user, todaySteps, workoutHistory]);

  const handleOnboardingNext = () => {
    if (onboardingStep < 2) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      const newUser = { ...formData, joinDate: new Date().toISOString() };
      setUser(newUser);
      setShowOnboarding(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
    }
  };

  const getRecommendedWorkouts = () => {
    if (!user) return [];
    return workoutDatabase[user.fitnessLevel][user.goal] || [];
  };

  const startWorkout = (workout) => {
    setCurrentWorkout(workout);
    setCurrentView('workout');
  };

  const completeWorkout = () => {
    const completed = {
      ...currentWorkout,
      date: new Date().toISOString(),
      completed: true
    };
    setWorkoutHistory([completed, ...workoutHistory]);
    setCurrentWorkout(null);
    setCurrentView('dashboard');
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const addSteps = (steps) => {
    setTodaySteps(prev => Math.min(prev + steps, 20000));
  };

  const generateAIWorkouts = async () => {
  setIsGenerating(true);
  try {
    const workouts = await generateWorkout(user);
    setAiWorkouts(workouts);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  } catch (error) {
    console.error('Failed to generate workouts:', error);
  }
  setIsGenerating(false);
};

const askAICoach = async () => {
  if (!coachQuestion.trim()) return;
  setIsGenerating(true);
  try {
    const response = await getAICoachAdvice(coachQuestion, user);
    setCoachResponse(response);
  } catch (error) {
    console.error('Failed to get advice:', error);
    setCoachResponse('Sorry, I encountered an error. Please try again.');
  }
  setIsGenerating(false);
};

  const getWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => ({
      day,
      steps: Math.floor(Math.random() * 8000) + 4000,
      calories: Math.floor(Math.random() * 400) + 200
    }));
  };

  const weeklyData = getWeeklyData();
  const totalCalories = workoutHistory.reduce((sum, w) => sum + w.calories, 0);
  const weeklyWorkouts = workoutHistory.filter(w => {
    const date = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date > weekAgo;
  }).length;

  const goalData = [
    { name: 'Completed', value: todaySteps, color: '#10b981' },
    { name: 'Remaining', value: Math.max(10000 - todaySteps, 0), color: '#e5e7eb' }
  ];

  if (showOnboarding) {
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
              {[0, 1, 2].map(step => (
                <div key={step} className={`h-2 flex-1 mx-1 rounded-full ${step <= onboardingStep ? 'bg-blue-500' : 'bg-gray-200'}`} />
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
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Age"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                />
                <select
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
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
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                />
                <input
                  type="number"
                  placeholder="Height (cm)"
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
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
                  {['beginner', 'intermediate', 'advanced'].map(level => (
                    <button
                      key={level}
                      onClick={() => setFormData({...formData, fitnessLevel: level})}
                      className={`py-3 px-4 rounded-lg border-2 capitalize ${
                        formData.fitnessLevel === level 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 text-gray-600'
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
                    { value: 'weight_loss', label: 'Weight Loss', icon: '🔥' },
                    { value: 'muscle_gain', label: 'Muscle Gain', icon: '💪' },
                    { value: 'endurance', label: 'Endurance', icon: '🏃' }
                  ].map(goal => (
                    <button
                      key={goal.value}
                      onClick={() => setFormData({...formData, goal: goal.value})}
                      className={`w-full py-3 px-4 rounded-lg border-2 flex items-center ${
                        formData.goal === goal.value 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 text-gray-600'
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
              <p className="text-gray-600">
                Your personalized fitness plan is ready. Let's start your journey to a healthier you!
              </p>
            </div>
          )}

          <button
            onClick={handleOnboardingNext}
            disabled={onboardingStep === 0 && (!formData.name || !formData.age || !formData.weight || !formData.height)}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {onboardingStep === 2 ? 'Start My Journey' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center">
            <Award className="w-5 h-5 mr-2" />
            <span className="font-semibold">
  {aiWorkouts.length > 0 ? '🤖 AI Workouts Generated!' : 'Great job! Keep it up!'}
</span>
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Fitness Buddy</h1>
              <p className="text-xs text-gray-500">Hello, {user?.name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Activity className="w-8 h-8" />
                  <button 
                    onClick={() => addSteps(1000)}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-lg text-sm"
                  >
                    +1000
                  </button>
                </div>
                <p className="text-sm opacity-90 mb-1">Today Steps</p>
                <p className="text-3xl font-bold">{todaySteps.toLocaleString()}</p>
                <p className="text-xs mt-2 opacity-75">Goal: 10,000 steps</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                <Flame className="w-8 h-8 mb-4" />
                <p className="text-sm opacity-90 mb-1">Calories Burned</p>
                <p className="text-3xl font-bold">{totalCalories}</p>
                <p className="text-xs mt-2 opacity-75">This week</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                <Activity className="w-8 h-8 mb-4" />
                <p className="text-sm opacity-90 mb-1">Workouts</p>
                <p className="text-3xl font-bold">{weeklyWorkouts}</p>
                <p className="text-xs mt-2 opacity-75">This week</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Target className="w-5 h-5 mr-2 text-blue-500" />
                Daily Step Goal
              </h2>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={goalData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {goalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-blue-600">{Math.round((todaySteps / 10000) * 100)}%</p>
                  <p className="text-sm text-gray-500 mt-1">Complete</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Dumbbell className="w-5 h-5 mr-2 text-blue-500" />
                Recommended for You
              </h2>
              <div className="space-y-3">
                {getRecommendedWorkouts().slice(0, 3).map(workout => (
                  <div
                    key={workout.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition cursor-pointer"
                    onClick={() => startWorkout(workout)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{workout.name}</h3>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Activity className="w-4 h-4 mr-1" />
                            {workout.duration} min
                          </span>
                          <span className="flex items-center">
                            <Flame className="w-4 h-4 mr-1" />
                            {workout.calories} cal
                          </span>
                          <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium capitalize">
                            {workout.type}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
              
              {/* ⬇️⬇️⬇️ ADD THE AI BUTTON HERE ⬇️⬇️⬇️ */}
              <button
                onClick={generateAIWorkouts}
                disabled={isGenerating}
                className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin mr-2">⚡</span>
                    AI Generating Your Perfect Workout...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🤖</span>
                    Generate AI-Powered Workouts
                  </>
                )}
              </button>
              {/* ⬆️⬆️⬆️ AI BUTTON ENDS HERE ⬆️⬆️⬆️ */}
              
            </div>
            
            {/* ⬇️⬇️⬇️ ADD AI WORKOUTS DISPLAY SECTION HERE ⬇️⬇️⬇️ */}
            {aiWorkouts.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2">🤖</span>
                  AI-Generated Custom Workouts
                </h2>
                <div className="space-y-3">
                  {aiWorkouts.map((workout, idx) => (
                    <div
                      key={`ai-${idx}`}
                      className="bg-white border-2 border-purple-200 rounded-xl p-4 hover:border-purple-400 hover:shadow-md transition cursor-pointer"
                      onClick={() => startWorkout({...workout, id: `ai-${idx}`})}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-semibold text-gray-800">{workout.name}</h3>
                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-600 rounded-full text-xs font-medium">
                              AI
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Activity className="w-4 h-4 mr-1" />
                              {workout.duration} min
                            </span>
                            <span className="flex items-center">
                              <Flame className="w-4 h-4 mr-1" />
                              {workout.calories} cal
                            </span>
                            <span className="px-2 py-1 bg-pink-50 text-pink-600 rounded-full text-xs font-medium capitalize">
                              {workout.type}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-purple-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Weekly Steps</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Bar dataKey="steps" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Calories Burned</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" stroke="#888" />
                    <YAxis stroke="#888" />
                    <Tooltip />
                    <Line type="monotone" dataKey="calories" stroke="#f97316" strokeWidth={3} dot={{ fill: '#f97316', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {workoutHistory.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                  Recent Workouts
                </h2>
                <div className="space-y-3">
                  {workoutHistory.slice(0, 5).map((workout, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-800">{workout.name}</p>
                        <p className="text-sm text-gray-500">{new Date(workout.date).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-800">{workout.duration} min</p>
                        <p className="text-xs text-orange-600">{workout.calories} cal</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {currentView === 'workout' && currentWorkout && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="mb-4 text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              ← Back to Dashboard
            </button>
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Dumbbell className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentWorkout.name}</h1>
                <div className="flex items-center justify-center space-x-6 text-gray-600">
                  <span className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    {currentWorkout.duration} minutes
                  </span>
                  <span className="flex items-center">
                    <Flame className="w-5 h-5 mr-2" />
                    {currentWorkout.calories} calories
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <h2 className="text-xl font-semibold text-gray-800">Exercises</h2>
                {currentWorkout.exercises.map((exercise, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 flex-1 pt-1">{exercise}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={completeWorkout}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition"
              >
                Complete Workout
              </button>
            </div>
          </div>
        )}
      </main>
      {/* AI Coach Floating Button */}
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
                <span className="mr-2">🤖</span>
                AI Fitness Coach
              </h2>
              <button
                onClick={() => {
                  setShowAICoach(false);
                  setCoachQuestion('');
                  setCoachResponse('');
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
              placeholder="Example: What should I eat before a workout? How can I improve my running endurance?"
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
                'Ask AI Coach'
              )}
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

      

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col items-center space-y-1 ${currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <Activity className="w-6 h-6" />
            <span className="text-xs font-medium">Activity</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Progress</span>
          </button>
          <button className="flex flex-col items-center space-y-1 text-gray-400">
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default FitnessBuddy;