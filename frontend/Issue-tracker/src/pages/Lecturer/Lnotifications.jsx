import API from "../../API";
import WrapL from "../../components/WrapL";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const Notifications = () => {
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
    <WrapL>
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
    </WrapL>
  );
};

export default Notifications;