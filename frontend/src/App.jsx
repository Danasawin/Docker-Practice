import reactLogo from './assets/react.svg'
import React from 'react';
const viteLogo = "/vite.svg";
import './App.css'
import React, { useState, useEffect } from 'react';
function App() {
  const [count, setCount] = useState(0)
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetch('http://35.198.234.59/check-db')  // Or use your backend container IP if not on localhost
      .then((res) => res.json())
      .then((data) => {
        if (data.name) {
          setUserName(data.name);
        }
      })
      .catch((err) => console.error('Failed to fetch user:', err));
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <h1>Test docker and jenkins in GCPs with docker compose3</h1>
      <h1>TDGs intern</h1>
      <h1>Postgresql check connection</h1>
        <h2>{userName ? `Hi, ${userName}!` : 'Loading user...'}</h2>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
