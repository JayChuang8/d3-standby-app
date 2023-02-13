import { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { observer } from 'mobx-react-lite';
import axios from 'axios';

export const App = observer(() => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:9000/testAPI")
      .then(response => setData(response.data))
  }, [])
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {data}
        </p>
      </header>
    </div>
  );
})