import React from "react";
import { Outlet, Link } from "react-router-dom";

const Layout = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold">Fitness Buddy</h1>
        <div>
          <Link to="/" className="mr-4">Dashboard</Link>
          <Link to="/progress" className="mr-4">Progress</Link>
          <Link to="/activity" className="mr-4">Activity</Link>
          <Link to="/profile" className="mr-4">Profile</Link>
          <button onClick={onLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        </div>
      </header>

      <main className="flex-1 p-4 bg-gray-100">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
