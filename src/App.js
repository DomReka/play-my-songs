import React, { Component } from 'react';
import './scss/App.scss';
import Player  from './components/Player'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Player />
      </div>
    );
  }
}

export default App;
