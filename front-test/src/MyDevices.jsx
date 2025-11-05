import React, { useState, useEffect } from 'react';
import './MyDevices.css';

const API_DEVICE_MANAGEMENT = 'http://device.localhost';

const getAuthToken = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('value='));
  return tokenCookie ? tokenCookie.split('=')[1].trim() : null;
};

const getUserIdFromToken = () => {
  const token = getAuthToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded token payload:', payload);
    return payload.id || null;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

export default function MyDevices() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    const username = getCookie('username');
    const userId = getUserIdFromToken();

    // Fetch user's devices
    useEffect(() => {
        const fetchMyDevices = async () => {
            if (!userId) {
                setError('User ID not found in token. Please log in again.');
                setLoading(false);
                return;
            }

            console.log('Fetching devices for user ID:', userId);

            try {
                const response = await fetch(`${API_DEVICE_MANAGEMENT}/devices/user/${userId}`, {
                    headers: getAuthHeaders(),
                    credentials: 'include'
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Fetched user devices:', data);
                setDevices(data);
            } catch (err) {
                console.error('Error fetching devices:', err);
                setError('Failed to load devices. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyDevices();
    }, [userId]);

    return (
        <div className="my-devices-container">
            <div className="my-devices-header">
                <h1 className="my-devices-title">My Devices</h1>
                <p className="my-devices-welcome">Welcome, {username || 'User'}</p>
            </div>

            {loading && (
                <div className="loading-container">
                    <p className="loading-text">Loading your devices...</p>
                </div>
            )}

            {error && (
                <div className="error-container">
                    <p className="error-text">{error}</p>
                </div>
            )}

            {!loading && !error && devices.length === 0 && (
                <div className="empty-container">
                    <p className="empty-text">You don't have any devices yet.</p>
                </div>
            )}

            {!loading && !error && devices.length > 0 && (
                <div className="devices-grid">
                    {devices.map((device, index) => (
                        <div key={device.device_id || index} className="device-card">
                            <div className="device-header">
                                <h3 className="device-name">{device.name || 'Unnamed Device'}</h3>
                            </div>
                            <div className="device-body">
                                <div className="device-info">
                                    <span className="device-label">Device ID:</span>
                                    <span className="device-value">{device.device_id || 'N/A'}</span>
                                </div>
                                <div className="device-info">
                                    <span className="device-label">Value:</span>
                                    <span className="device-value-highlight">{device.value || 0}</span>
                                </div>
                                <div className="device-info">
                                    <span className="device-label">User ID:</span>
                                    <span className="device-value">{device.user?.id || device.user?.user_id || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
