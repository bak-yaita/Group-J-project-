import {
  Bell,
  ArrowLeft,
  Check,
  Clock,
  AlertCircle,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";

const Rnotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get("/api/notifications/");
                const notificationsData = Array.isArray(response.data)
                  ? response.data
                  : response.data.notifications || [];
                setNotifications(response.data);
        toast.success("Notifications loaded successfully!");
      } catch (err) {
        setError(err.message);
        toast.error("Failed to load notifications");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case "in_progress":
        return <AlertCircle className="w-5 h-5 text-violet-400" />;
      case "assigned":
        return <AlertCircle className="w-5 h-5 text-pink-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getNotificationBorderColor = (type) => {
    switch (type) {
      case "resolved":
        return "border-l-emerald-500";
      case "in_progress":
        return "border-l-violet-400";
      case "assigned":
        return "border-l-pink-400";
      default:
        return "border-l-blue-500";
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
    toast.success("Notification marked as read");
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
    toast.success("Notification deleted");
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read;
    if (filter === "read") return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-950"></div>
            <span className="ml-4 text-blue-950 text-lg font-medium">
              Loading notifications...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              Error Loading Notifications
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/regdash">
              <button className="p-3 bg-white hover:bg-gray-50 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-sm border border-gray-200">
                <ArrowLeft className="w-5 h-5 text-blue-950" />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-blue-950 flex items-center gap-3">
                <Bell className="w-8 h-8 text-blue-950" />
                Notifications
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                Stay updated with your latest activities
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          {["all", "unread", "read"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-6 py-3 rounded-md text-sm font-medium transition-all duration-200 capitalize ${
                filter === filterType
                  ? "bg-blue-950 text-white shadow-lg"
                  : "text-gray-600 hover:text-blue-950 hover:bg-gray-50"
              }`}
            >
              {filterType}
              {filterType === "unread" && unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-4">
            {filteredNotifications.map((notification, index) => (
              <div
                key={notification.id}
                className={`group relative bg-blue-950 border ${getNotificationBorderColor(
                  notification.type
                )} border-l-4 rounded-lg p-6 hover:shadow-md transition-all duration-300 ease-in-out shadow-sm ${
                  !notification.read ? "ring-1 ring-blue-200" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Unread indicator */}
                {!notification.read && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                )}

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-lg leading-relaxed ${
                        notification.read
                          ? "text-gray-100"
                          : "text-gray-50 font-medium"
                      }`}
                    >
                      {notification.message}
                    </p>

                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(notification.created_at).toLocaleString()}
                      </div>

                      {!notification.read && (
                        <span className="px-3 py-1 bg-blue-100 text-blue-950 text-xs font-medium rounded-full border border-blue-200">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex-shrink-0 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 border border-transparent hover:border-green-200"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200 border border-transparent hover:border-red-200"
                      title="Delete notification"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-200">
              <Bell className="w-12 h-12 text-gray-400 " />
            </div>
            <h3 className="text-xl font-semibold text-blue-950 mb-2">
              {filter === "unread"
                ? "No unread notifications"
                : filter === "read"
                ? "No read notifications"
                : "No notifications found"}
            </h3>
            <p className="text-gray-600">
              {filter === "all"
                ? "You're all caught up! New notifications will appear here."
                : `Switch to a different filter to see ${
                    filter === "unread" ? "read" : "unread"
                  } notifications.`}
            </p>
          </div>
        )}

        {/* Quick Actions */}
        {notifications.length > 0 && unreadCount > 0 && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                setNotifications((prev) =>
                  prev.map((n) => ({ ...n, read: true }))
                );
                toast.success(`${unreadCount} notifications marked as read`);
              }}
              className="px-8 py-3 bg-blue-950 hover:bg-blue-900 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Mark All as Read ({unreadCount})
            </button>
          </div>
        )}

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default Rnotifications;
