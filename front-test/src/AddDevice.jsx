import React, { useState, useEffect } from 'react';
import './AddDevice.css';

const API_USER_MANAGEMENT = 'http://user.localhost';
const API_DEVICE_MANAGEMENT = 'http://device.localhost';

// Helper function to get JWT token from cookies
const getAuthToken = () => {
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('value='));
  return tokenCookie ? tokenCookie.split('=')[1].trim() : null;
};

// Helper function to create headers with Authorization token
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

export default function AddDevice() {
  const [fieldName, setFieldName] = useState('');
  const [fieldValue, setFieldValue] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  // Fetch devices
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch(`${API_DEVICE_MANAGEMENT}/devices`, {
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        const data = await response.json();
        console.log('Fetched devices:', data);
        setDevices(data);
      } catch (err) {
        console.error('Error fetching devices:', err);
        alert('An error occurred while fetching devices.');
      }
    };
    fetchDevices();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_USER_MANAGEMENT}/users`, {
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        const data = await response.json();
        console.log('Fetched users:', data);
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        alert('An error occurred while fetching users.');
      }
    };
    fetchUsers();
  }, []);

  // POST - Create device
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fieldName || !fieldValue || !selectedUser) {
      alert('Please fill in all fields: Name, Value, and User');
      return;
    }

    const payload = {
      name: fieldName,
      value: parseFloat(fieldValue),
      user: { id: selectedUser },
    };

    console.log('Sending payload:', JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(`${API_DEVICE_MANAGEMENT}/devices`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        alert(`Failed to create device: ${res.status} ${text}`);
        return;
      }

      const created = await res.json().catch(() => null);
      console.log('Created device:', created);
      
      if (created) {
        setDevices((prev) => [...prev, created]);
      }

      alert('Device created successfully!');
      setFieldName('');
      setFieldValue('');
      setSelectedUser('');
    } catch (err) {
      console.error('Error creating device:', err);
      alert('An error occurred while creating the device.');
    }
  };

  // DELETE device
  const handleDelete = async () => {
    if (!selectedDevice) {
      alert('Please select a device to delete.');
      return;
    }

    try {
      const res = await fetch(`${API_DEVICE_MANAGEMENT}/devices/${selectedDevice}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!res.ok) {
        alert('Failed to delete device.');
        return;
      }

      alert('Device deleted successfully!');
      setDevices((prev) => prev.filter((d) => String(d.device_id) !== String(selectedDevice)));
      setSelectedDevice('');
    } catch (err) {
      console.error('Error deleting device:', err);
      alert('An error occurred while deleting the device.');
    }
  };

  // PUT - Update device
  const handleUpdate = async () => {
    if (!selectedDevice) {
      alert('Please select a device to update.');
      return;
    }




    const deviceObj = devices.find(d => String(d.device_id) === String(selectedDevice));
    const payload = {};

    payload.name = fieldName || deviceObj.name;
    payload.value = parseFloat(fieldValue) || deviceObj.value;
    payload.user = { id: selectedUser || deviceObj.user.id };


    console.log(JSON.stringify(payload, null, 2));

    console.log('Updating device with payload:', JSON.stringify(payload, null, 2));

    try {
      const res = await fetch(`${API_DEVICE_MANAGEMENT}/devices/${selectedDevice}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        alert(`Failed to update device: ${res.status} ${text}`);
        return;
      }

      const updated = await res.json().catch(() => null);
      console.log('Updated device:', updated);
      
      if (updated) {
        setDevices((prev) =>
          prev.map((d) => (d.device_id === updated.device_id ? updated : d))
        );
      }

      alert('Device updated successfully!');
      setFieldName('');
      setFieldValue('');
      setSelectedUser('');
      setSelectedDevice('');
    } catch (err) {
      console.error('Error updating device:', err);
      alert('An error occurred while updating the device.');
    }
  };

  return (
    <div className="add-device">
      <div className="form-container">
        <h2>Add Device / Property</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Name
              <input
                className="full-width"
                value={fieldName}
                onChange={(e) => setFieldName(e.target.value)}
                placeholder="Enter name"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              Value
              <input
                className="full-width"
                type="number"
                step="any"
                value={fieldValue}
                onChange={(e) => setFieldValue(e.target.value)}
                placeholder="Enter value"
              />
            </label>
          </div>

          <div className="form-group">
            <label>
              User
              <select
                className="full-width"
                value={selectedUser}
                onChange={(e) => {
                  console.log("Selected user ID:", e.target.value);
                  setSelectedUser(e.target.value);
                }}
              >
                <option value="">Select a user</option>
                {users.map((u, idx) => (
                  <option key={u.user_id || u.id || idx} value={u.user_id || u.id}>
                    {u.name} (ID: {u.user_id || u.id})
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button className="submit-btn" type="submit">Submit</button>
        </form>

        <hr style={{ margin: '24px 0' }} />

        <h3>Manage Devices</h3>
        <div className="form-group">
          <label>
            Select Device
            <select
              className="full-width"
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
            >
              <option value="">Select a device</option>
              {devices.map((d, idx) => (
                <option key={d.device_id || idx} value={d.device_id}>
                  {d.name} (ID: {d.device_id})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="submit-btn" onClick={handleUpdate}>Update Device</button>
          <button className="submit-btn delete-btn" onClick={handleDelete}>Delete Device</button>
        </div>
      </div>

      <aside className="sidebar">
        <h3>All Devices</h3>
        {devices.length === 0 ? (
          <p>No devices available.</p>
        ) : (
          <ul>
            {devices.map((d, idx) => (
              <li key={d.device_id || idx}>
                <strong>{d.name}</strong>
                <br />
                Device ID: {d.device_id || 'N/A'}
                <br />
                Value: {d.value || 'N/A'}
                <br />
                User ID: {d.user?.user_id || d.user?.id || 'N/A'}
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
