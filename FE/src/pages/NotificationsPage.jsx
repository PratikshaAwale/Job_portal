import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/notifications', {
        withCredentials: true,
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:5001/api/notifications/${id}/read`, {}, {
        withCredentials: true,
      });
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      toast.error('Could not mark as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('http://localhost:5001/api/notifications/read-all', {}, {
        withCredentials: true,
      });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Could not mark all as read');
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ maxWidth: '44rem', margin: '0 auto', textAlign: 'center', padding: '3rem' }}>
        <p className="db-text-muted">Loading notifications...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div style={{ maxWidth: '44rem', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--db-text)', margin: 0 }}>Notifications</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--db-text-muted)', margin: '0.25rem 0 0' }}>
            You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.
          </p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="btn btn-secondary"
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.length === 0 ? (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="metric-card-icon icon-blue" style={{ margin: '0 auto 1rem auto' }}>
              <Bell className="w-6 h-6" />
            </div>
            <p className="db-text-muted">You have no notifications yet.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif._id} 
              className="glass-panel"
              style={{ 
                padding: '1.25rem', 
                borderLeft: notif.isRead ? '4px solid transparent' : '4px solid #3b82f6',
                opacity: notif.isRead ? 0.7 : 1,
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}
            >
              <div className={`metric-card-icon ${notif.isRead ? 'icon-slate' : 'icon-blue'}`} style={{ width: '2.5rem', height: '2.5rem' }}>
                <Bell className="w-4 h-4" />
              </div>
              
              <div style={{ flex: 1 }}>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--db-text)', fontWeight: notif.isRead ? 500 : 700, lineHeight: 1.5 }}>
                  {notif.message}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: 'var(--db-text-muted)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock className="w-3.5 h-3.5" />
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </span>
                  {!notif.isRead && (
                    <button 
                      onClick={() => markAsRead(notif._id)}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', padding: 0 }}
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Mark as read
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
