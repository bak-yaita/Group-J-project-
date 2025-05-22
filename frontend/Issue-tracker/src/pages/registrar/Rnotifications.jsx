import API from "../../API";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const Rnotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get("/api/notifications/");
        const notificationsData = Array.isArray(response.data)
          ? response.data
          : response.data.notifications || [];
        setNotifications(response.data);
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  if (loading) return <WrapL>Loading notifications...</WrapL>;
  if (error) return <WrapL>Error: {error}</WrapL>;

    return (
        <div>
            <div className="flex items-center space-x-4">
        <div className="relative">
          <Link to="/regdash">
            <button className="p-2 bg-blue-950 rounded-full hover:bg-blue-700 transition duration-300 ease-in-out">
              <span className="sr-only"></span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#e3e3e3"
              >
                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
      <h2 className="text-2xl font-bold text-white mb-6">Your Notifications</h2>
      {Array.isArray(notifications) && notifications.length > 0 ? (
        <ul className="space-y-4">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="bg-blue-900 text-white p-4 rounded-lg shadow-md hover:bg-blue-800 transition-colors duration-200"
            >
              <p className="text-lg">{notification.message}</p>
              <small className="text-gray-300 block mt-2">
                {new Date(notification.created_at).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white text-center py-4">No notifications found</p>
      )}
            <ToastContainer />
            </div>
  );
};

export default Rnotifications;