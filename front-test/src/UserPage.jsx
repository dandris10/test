import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const API_USER_MANAGEMENT = 'http://user.localhost';
const API_DEVICE_MANAGEMENT = 'http://device.localhost';

export default function UserPage(){
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('user_id');
    const [userDevices, setUserDevices] = useState([]);

    console.log(userId);

    return(
        <div>
            <h1>User Page for: {userId}</h1>
            <h2>Devices:</h2>
            <ul>
                {userDevices.map(device => (
                    <li key={device.device_id}>{device.name}</li>
                ))}
            </ul>
        </div>
    )

}