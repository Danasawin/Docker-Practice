import reactLogo from './assets/react.svg'
const viteLogo = "/vite.svg";
import './App.css'
import React, { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [dbStatus, setDbStatus] = useState(null);

  useEffect(() => {
    fetch('http://35.247.160.122:3000/check-db')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setDbStatus({
            message: data.message,
            userName: data.userName,
          });
        } else {
          setDbStatus({
            message: 'Connection failed',
            userName: null,
          });
        }
      })
      .catch((err) => {
        console.error('Failed to fetch DB status:', err);
        setDbStatus({
          message: 'Connection error',
          userName: null,
        });
      });
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
      <h1>Test docker and Jenkins in GCP with Docker Compose</h1>
      <h1>TDG's Intern</h1>
      <h1>test split pipeline TDG</h1>
      <h1>PostgreSQL DB Connection Check</h1>

      {dbStatus && (
        <div>
          <p><strong>Status:</strong> {dbStatus.message}</p>
          {dbStatus.userName && <p><strong>DB Time:</strong> {dbStatus.userName}</p>}
        </div>
      )}

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
  );
}

export default App;
