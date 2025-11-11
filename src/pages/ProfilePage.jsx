import React, { useState, useEffect } from "react";
import { User, Award, Flame, Target, BarChart3, Edit2, CheckCircle, XCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProfilePage = ({ user, workoutHistory = [], todaySteps = 0, setUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  useEffect(() => {
    setEditedUser(user);
  }, [user]);

  const handleSave = () => {
    setUser(editedUser);
    localStorage.setItem("fitnessUser", JSON.stringify(editedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleLogout = () => {
    localStorage.removeItem("fitnessUser");
    localStorage.removeItem("todaySteps");
    localStorage.removeItem("workoutHistory");
    setUser(null);
    navigate("/");
  };

  const formatText = (text = "") =>
    text.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const totalWorkouts = workoutHistory.length;
  const totalCalories = workoutHistory.reduce((sum, w) => sum + (w.calories || 0), 0);
  const fitnessLevels = ["beginner", "intermediate", "advanced"];
  const goals = ["weight_loss", "build_muscle", "stay_fit"];

  return (
    <div className="space-y-6 p-4">
      {/* Header + Logout */}
      <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{user.name}</h1>
            <p className="text-gray-500">Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 text-red-600 hover:text-red-800"
        >
          <LogOut className="w-5 h-5" /> <span>Logout</span>
        </button>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-blue-500" /> Lifetime Stats
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <Award className="w-6 h-6 mx-auto text-blue-600 mb-1" />
            <p className="text-xl font-bold text-gray-800">{totalWorkouts}</p>
            <p className="text-sm text-gray-500">Workouts</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <Flame className="w-6 h-6 mx-auto text-orange-600 mb-1" />
            <p className="text-xl font-bold text-gray-800">{totalCalories}</p>
            <p className="text-sm text-gray-500">Calories</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg col-span-2 md:col-span-1">
            <Target className="w-6 h-6 mx-auto text-green-600 mb-1" />
            <p className="text-xl font-bold text-gray-800">{todaySteps}</p>
            <p className="text-sm text-gray-500">Today's Steps</p>
          </div>
        </div>
      </div>

      {/* Editable Details */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-500" /> Your Details
          </h2>

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)} className="text-blue-600 hover:text-blue-800 flex items-center">
              <Edit2 className="w-4 h-4 mr-1" /> Edit
            </button>
          ) : (
            <div className="flex space-x-2">
              <button onClick={handleSave} className="text-green-600 hover:text-green-800 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" /> Save
              </button>
              <button onClick={handleCancel} className="text-red-600 hover:text-red-800 flex items-center">
                <XCircle className="w-4 h-4 mr-1" /> Cancel
              </button>
            </div>
          )}
        </div>

        <ul className="space-y-3">
          {["age", "weight", "height"].map((field) => (
            <li key={field} className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-gray-500">{field.charAt(0).toUpperCase() + field.slice(1)}</span>
              {isEditing ? (
                <input
                  type="number"
                  name={field}
                  value={editedUser[field]}
                  onChange={handleChange}
                  className="border rounded-lg p-1 text-sm text-gray-800 w-28 text-right focus:outline-none focus:ring focus:ring-blue-100"
                />
              ) : (
                <span className="font-medium text-gray-800">
                  {user[field]}{field === "weight" ? " kg" : field === "height" ? " cm" : ""}
                </span>
              )}
            </li>
          ))}

          <li className="flex items-center justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Fitness Level</span>
            {isEditing ? (
              <select
                name="fitnessLevel"
                value={editedUser.fitnessLevel}
                onChange={handleChange}
                className="border rounded-lg p-1 text-sm text-gray-800 w-32 text-right focus:outline-none focus:ring focus:ring-blue-100"
              >
                {fitnessLevels.map((level) => (
                  <option key={level} value={level}>{formatText(level)}</option>
                ))}
              </select>
            ) : (
              <span className="font-medium text-gray-800 capitalize">{formatText(user.fitnessLevel)}</span>
            )}
          </li>

          <li className="flex items-center justify-between py-2">
            <span className="text-gray-500">Main Goal</span>
            {isEditing ? (
              <select
                name="goal"
                value={editedUser.goal}
                onChange={handleChange}
                className="border rounded-lg p-1 text-sm text-gray-800 w-40 text-right focus:outline-none focus:ring focus:ring-blue-100"
              >
                {goals.map((goal) => (
                  <option key={goal} value={goal}>{formatText(goal)}</option>
                ))}
              </select>
            ) : (
              <span className="font-medium text-gray-800">{formatText(user.goal)}</span>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfilePage;
