import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import Button from '@mui/material/Button';

export const App = observer(() => {
  const [testData, setTestData] = useState([]);
  const [sshData, setSshData] = useState([]);

  useEffect(() => {
    axios.get("https://d3-standby-server.vercel.app/testAPI")
      .then(response => setTestData(response.data))
  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {testData}
        </p>
        <Button variant="contained" onClick={() => {
          axios.get("https://d3-standby-server.vercel.app/sshConn")
          .then(response => setSshData(response.data))
        }}>Connect to d3 through SSH</Button>
        <p>
          The ssh response is: {sshData}
        </p>
      </header>
    </div>
  );
})