import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Activity, Target, Dumbbell, Flame, ChevronRight } from 'lucide-react';

// All state (e.g., todaySteps) and functions (e.g., addSteps)
// are passed as props from the new App.jsx
const Dashboard = ({
  todaySteps,
  addSteps,
  totalCalories,
  weeklyWorkouts,
  goalData,
  getRecommendedWorkouts,
  startWorkout,
  generateAIWorkouts,
  isGenerating,
  aiWorkouts,
}) => {
  
  return (
    <div className="space-y-6">
      {/* Feature 2: Step Counter & Calorie Tracking */}
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

      {/* Feature 4: Goal Setting (Visualization) */}
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

      {/* Feature 1: Workout Recommendation */}
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
      </div>
      
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
    </div>
  );
};

export default Dashboard;