import React from 'react';
import logo from './logo.svg';
import './App.css';
import makeStyles from '@mui/styles/makeStyles';
import { observer } from 'mobx-react-lite';

export const App = observer(() => {return (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Hello there.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);})
