import React from 'react';
import { Activity, Flame, Calendar, Target } from 'lucide-react';

// We will pass workoutHistory and todaySteps as props from App.jsx
const ActivityPage = ({ workoutHistory, todaySteps }) => {
  
  // 1. Create a "steps" activity for today
  const todayStepActivity = {
    type: 'steps',
    name: 'Daily Steps',
    steps: todaySteps,
    date: new Date().toISOString(), // Use today's date
  };

  // 2. Combine step activity with workout history
  // We add 'type' to workout objects to distinguish them
  const combinedActivities = [
    todayStepActivity,
    ...workoutHistory.map(w => ({ ...w, type: 'workout' }))
  ];

  // 3. Sort all activities by date, most recent first
  const sortedActivities = combinedActivities.sort((a, b) => new Date(b.date) - new Date(a.date));

  // Helper function to show the correct icon
  const renderActivityIcon = (type) => {
    if (type === 'workout') {
      return (
        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
          <Activity className="w-5 h-5" />
        </div>
      );
    }
    if (type === 'steps') {
      return (
        <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
          <Target className="w-5 h-5" />
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Your Activity Feed</h1>
      
      {/* Show a message if no activities exist yet */}
      {sortedActivities.length === 1 && sortedActivities[0].steps === 0 ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <p className="text-gray-500">Your activity feed is empty. Complete a workout or add some steps to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <ul className="divide-y divide-gray-100">
            {sortedActivities.map((activity, index) => {
              // Don't show today's steps if they are 0
              if (activity.type === 'steps' && activity.steps === 0 && sortedActivities.length > 1) {
                return null;
              }
              
              return (
                <li key={index} className="py-4 flex items-center space-x-4">
                  {renderActivityIcon(activity.type)}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {/* Display Workout Stats */}
                    {activity.type === 'workout' && (
                      <>
                        <p className="font-medium text-gray-800">{activity.duration} min</p>
                        <p className="text-sm text-orange-600 flex items-center justify-end">
                          <Flame className="w-4 h-4 mr-1" />
                          {activity.calories} cal
                        </p>
                      </>
                    )}
                    {/* Display Step Stats */}
                    {activity.type === 'steps' && (
                      <>
                        <p className="font-medium text-gray-800">{activity.steps.toLocaleString()}</p>
                        <p className="text-sm text-green-600">Steps</p>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivityPage;