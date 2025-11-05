import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import AddUser from './AddUser';
import AddDevice from './AddDevice';
import Login from './Login';
import MyDevices from './MyDevices';

function Main() {
  const navigate = useNavigate();

  const goToAddUser = () => {
    navigate('/add-user');
  }

  return (
    <>
    <div>
      <h1>Test</h1>
      <button type="button" onClick={goToAddUser}>Click here to add user</button>
    </div>
      </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mydevices" element={<MyDevices />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/add-device" element={<AddDevice />} />
    </Routes>
  </BrowserRouter>
)
}

export default App
