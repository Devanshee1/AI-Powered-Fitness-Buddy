import React from 'react';
import { User, Award, Flame, Target, Dumbbell, Activity, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';

// We'll pass the user object, workout history, and steps from App.jsx
const ProfilePage = ({ user, workoutHistory, todaySteps }) => {

  // Calculate total stats from workout history
  const totalWorkouts = workoutHistory.length;
  const totalCalories = workoutHistory.reduce((sum, w) => sum + w.calories, 0);

  // Helper to format the goal/level text
  const formatText = (text = '') => {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (!user) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl shadow-sm">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
          <p className="text-gray-500">Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Key Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
          Lifetime Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Award className="w-6 h-6 mx-auto text-blue-600 mb-1" />
            <p className="text-xl font-bold text-gray-800">{totalWorkouts}</p>
            <p className="text-sm text-gray-500">Workouts</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <Flame className="w-6 h-6 mx-auto text-orange-600 mb-1" />
            <p className="text-xl font-bold text-gray-800">{totalCalories.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Calories</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg col-span-2 md:col-span-1">
            <Target className="w-6 h-6 mx-auto text-green-600 mb-1" />
            <p className="text-xl font-bold text-gray-800">{todaySteps.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Today's Steps</p>
          </div>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2 text-blue-500" />
          Your Details
        </h2>
        <ul className="space-y-3">
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Age</span>
            <span className="font-medium text-gray-800">{user.age}</span>
          </li>
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Weight</span>
            <span className="font-medium text-gray-800">{user.weight} kg</span>
          </li>
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Height</span>
            <span className="font-medium text-gray-800">{user.height} cm</span>
          </li>
          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Fitness Level</span>
            <span className="font-medium text-gray-800 capitalize">{user.fitnessLevel}</span>
          </li>
          <li className="flex items-center justify-between py-2">
            <span className="text-gray-500">Main Goal</span>
            <span className="font-medium text-gray-800">{formatText(user.goal)}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;