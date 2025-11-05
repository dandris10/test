import React, { useState,useEffect } from 'react';

const API_USER_MANAGEMENT = 'http://user.localhost';
const API_AUTH_MANAGEMENT = 'http://auth.localhost/api/auth/register';

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


export default function AddUser() {
    
  //for post request
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  //for get request
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  //for get request. useEffect runs code on component load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_USER_MANAGEMENT}/users`, {
          headers: getAuthHeaders(),
          credentials: 'include'
        });
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        alert('An error occurred while fetching users.');
      }
    };

    fetchUsers();
  }, []);


  console.log("COOKIE::" ,document.cookie);
  //for post request
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First POST request - User Profile Data
      const profilePayload = { name, age: Number(age), address };
      const profileRes = await fetch(`${API_USER_MANAGEMENT}/users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(profilePayload),
      });

      if (!profileRes.ok) {
        const text = await profileRes.text().catch(() => profileRes.statusText);
        alert(`Failed to create user profile: ${profileRes.status} ${text}`);
        return;
      }

      const createdUser = await profileRes.json().catch(() => null);
      if (createdUser) {
        setUsers(prev => [...prev, createdUser]);
      }

      console.log('Created user profile:', createdUser);

      const id = createdUser.id;

      // Second POST request - Authentication Data
      const authPayload = { email, username, password, id };
      const authRes = await fetch(`${API_AUTH_MANAGEMENT}`, {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(authPayload),
      });

      if (!authRes.ok) {
        const text = await authRes.text().catch(() => authRes.statusText);
        alert(`User profile created but failed to create auth credentials: ${authRes.status} ${text}`);
        return;
      }

      alert('User profile and authentication credentials created successfully!');
      setName('');
      setAge('');
      setAddress('');
      setEmail('');
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Error creating user:', err);
      alert('An error occurred while creating the user.');
    }
  };

  //delete request 
  const handleDelete = async () => {
    if (!selectedUser) {
      alert('Please select a user to delete.');
      return;
    }
    try {
      const res = await fetch(`${API_USER_MANAGEMENT}/users/${selectedUser}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (!res.ok) {
        alert("Failed to delete user from the user management service.");
        return;
      }

      alert('User deleted successfully from the user management service!');
      setSelectedUser(null);
      setUsers(prev => prev.filter(user => String(user.id) !== String(selectedUser)));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('An error occurred while deleting the user.');
    } 
  };

  //update request
  const handleUpdate = async (e) => {
    e.preventDefault();
    if(!selectedUser) {
      alert('Please select a user to update.');
      return;
    }

    const userObj = users.find(user => String(user.id) === String(selectedUser));

    if (!userObj) {
    alert('Selected user not found.');
    return;
   }

    const payload = {};
    payload.name = name || userObj.name;
    payload.age = age ? Number(age) : userObj.age;
    payload.address = address || userObj.address;
    payload.email = email || userObj.email;
    payload.username = username || userObj.username;
    payload.password = password || userObj.password;
    
    try {
      const res = await fetch(`${API_USER_MANAGEMENT}/users/${selectedUser}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) {
        alert("Failed to update user on the user management service.");
        return;
      }
      setUsers(prev => prev.map(user => 
        String(user.id) === String(selectedUser) ? { ...user, ...payload } : user
      ));
      alert('User updated successfully on the user management service!');
    } catch (err) {
      console.error('Error updating user:', err);
      alert('An error occurred while updating the user.');
    }
  };



  return (
    <div>
      <h2>Add User Page</h2>


        <form onSubmit={handleSubmit}>
            <label> Name:
                <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)}/>
            </label>
            <br />
            <label> Age:
                <input type="number" name="age" value={age} onChange={(e) => setAge(e.target.value)}/>
            </label>
            <br />
            <label> Address:
                <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)}/>
            </label>
            <br />
            <label> Email:
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <br />
            <label> Username:
                <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)}/>
            </label>
            <br />
            <label> Password:
                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>


        <select
          value={selectedUser || ''}
          onChange={(e) => setSelectedUser(e.target.value)
          }>
          <option>Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} (ID: {user.id})
            </option>
          ))}
        </select>


        <button onClick={handleDelete}>Delete user</button>


        <button onClick={handleUpdate}>Update user</button>


    </div>
  );

}
