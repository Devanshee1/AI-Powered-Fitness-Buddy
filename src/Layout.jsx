import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Dumbbell, Bell, Settings, Home, Activity, TrendingUp, User, LogOut } from 'lucide-react';

// We pass the user object and logout function to the layout
const Layout = ({ user, onLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/login');
  };
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header (from App.jsx) */}
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
          <div className="flex items-center space-x-2">
            <NavLink to="/notifications" className="p-2 hover:bg-gray-100 rounded-lg">
              <Bell className="w-5 h-5 text-gray-600" />
            </NavLink>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Child pages (Dashboard, Progress, etc.) will be rendered here */}
        <Outlet />
      </main>

      {/* Navigation Bar (from App.jsx) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-around">
          
          {/* Use NavLink instead of <button> for automatic active state */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`
            }
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </NavLink>
          
          <NavLink
            to="/activity"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`
            }
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs font-medium">Activity</span>
          </NavLink>
          
          <NavLink
            to="/progress"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`
            }
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs font-medium">Progress</span>
          </NavLink>
          
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center space-y-1 ${isActive ? 'text-blue-600' : 'text-gray-400'}`
            }
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </NavLink>
          
        </div>
      </nav>
    </div>
  );
};

export default Layout;