import React from 'react';
import './App.css';
import Homepage from './pages/Homepage.component';

function App() {
  const args = {
    time: '20:08',
    date: '2-2-2021',
    users: [
      {
        name: 'Andrew Lee',
        time: '20:08',
        date: '2-2-2021',
        timezone: 'America/New_York',
      },
      {
        name: 'Tyrik Celia',
        time: '23:30',
        date: '2-3-2021',
        timezone: 'Asia/Jerusalem',
      },
      {
        name: 'Henricus Peter',
        time: '0:00',
        date: '2-2-2021',
        timezone: 'Australia/Adelaide',
      },
    ],
    elementWidth: 70,
  };
  return (
    <div className="App">
      <Homepage {...args} />
    </div>
  );
}

export default App;
