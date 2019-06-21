import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const fetchWrapper = (url, options, timeout = 3000) =>
  new Promise((resolve, reject) => {
    fetch(url, options).then(resolve, reject);

    if (timeout) {
      const e = new Error('Connection timed out');
      setTimeout(reject, timeout, e);
    }
  });

class App extends Component {
  state = {
    counter: 0,
  };

  componentDidMount() {
    this.getApiCounter();
  }

  getApi = () => {
    const apiUrl = `/api/healthcheck`;
    fetch(`${apiUrl}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        alert(JSON.stringify(response));
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
  };

  getApiCounter = () => {
    const apiUrl = `/api/counter`;
    fetchWrapper(`${apiUrl}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    })
      .then(response => response.json())
      .then(response => {
        this.setState({ counter: response.value });
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
  };

  setApiCounter = value => {
    const apiUrl = `/api/counter`;
    console.log('POST ', JSON.stringify({ value }));
    fetchWrapper(`${apiUrl}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 5000,
      body: JSON.stringify({ value }),
    })
      .then(response => {
        console.log('Update Api Counter: ', response);
        this.getApiCounter();
      })
      .catch(err => {
        console.log(err);
        alert(err);
      });
  };

  incrementApiCounter = () => {
    const { counter } = this.state;
    const value = counter + 1;
    this.setApiCounter(value);
  };

  decrementApiCounter = () => {
    const { counter } = this.state;
    const value = counter <= 0 ? 0 : counter - 1;
    this.setApiCounter(value);
  };

  render() {
    const { counter } = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          <button type="button" onClick={this.getApi}>
            Get API health check data!
          </button>
        </p>
        <br />
        <br />
        <h3>Database Counter Demo</h3>
        <p>
          <button type="button" onClick={this.getApiCounter}>
            Get data!
          </button>
          &nbsp;
          <button type="button" onClick={this.incrementApiCounter}>
            +
          </button>
          <button type="button" onClick={this.decrementApiCounter}>
            -
          </button>
          &nbsp;Counter =<strong> {counter}</strong>
        </p>
      </div>
    );
  }
}

export default App;
