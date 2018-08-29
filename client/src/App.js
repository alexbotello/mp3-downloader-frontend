import React, { Component } from 'react';

import Banner from './Components/Banner'
import Form from './Components/Form'
import Foot from './Components/Footer'
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Banner />
        <Form />
        <Foot />
      </div>
    );
  }
}

export default App;
