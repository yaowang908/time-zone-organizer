import React from 'react';
import './App.css';
import Homepage from './pages/Homepage.component';

function App() {
  const args = {
    users: [
      {
        id: 0,
        name: 'You',
        timezone: 'America/New_York',
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
