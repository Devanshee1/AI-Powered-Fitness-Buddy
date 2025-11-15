import NotificationPanel from "../components/NotificationPanel";

const Notifications = ({ userProfile }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            SMS Notifications
          </h1>
          <p className="text-gray-600">
            Stay motivated with personalized workout reminders and updates via SMS
          </p>
        </div>

        <NotificationPanel userProfile={userProfile} />
      </div>
    </div>
  );
};

export default Notifications;
