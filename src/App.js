import React, { Component } from 'react';

import Banner from './Components/Banner';
import Form from './Components/Form';
import Message from './Components/Message';
import Foot from './Components/Footer';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Banner />
        <Form />
        <Message />
        <Foot />
      </div>
    );
  }
}

export default App;
