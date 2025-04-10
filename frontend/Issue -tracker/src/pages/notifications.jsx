import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Wrapper from '../components/wrapper';
import { ToastContainer } from 'react-toastify';
import API from '../API';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get('/api/notifications/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
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

  if (loading) return <Wrapper>Loading notifications...</Wrapper>;
  if (error) return <Wrapper>Error: {error}</Wrapper>;

  return (
    <Wrapper>
      <h2>Your Notifications</h2>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map(notification => (
            <li key={notification.id}>
              <p>{notification.message}</p>
              <small>{new Date(notification.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No notifications found</p>
      )}
      <ToastContainer />
    </Wrapper>
  );
};

export default Notifications;
