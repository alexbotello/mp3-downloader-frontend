import React, { Component } from 'react';
import FileSaver from 'file-saver';
import axios from 'axios';
import './App.css';

require("dotenv").config()

class App extends Component {
  state = {
    api: process.env.REACT_APP_API,
    token: process.env.REACT_APP_TOKEN,
    url: 'http://127.0.0.1:8000',
    link: '',
    file: '',
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSubmit = event => {
    event.preventDefault();
    const url = this.state.link
    this.setState({ link: '' })
    this.sendDownloadRequest(url)
  }
  sendDownloadRequest(url) {
    axios.get(`${this.state.api}/download?url=${url}`, {
      headers: {'Authorization': this.state.token}
    })
      .then(response => {
        this.setState({ file: response.data['file'] })
        this.retrieveAudioFile()
      })
      .catch(err => {
        console.log(err)
      })
  }
  retrieveAudioFile() {
    axios.get(`${this.state.api}/convert/${this.state.file}`, {
      responseType: 'blob',
      timeout: 300000,
      headers: {'Authorization': this.state.token}
    })
      .then(response => {
        const filename = response.headers['content-disposition'].split('filename=')[1]
        FileSaver.saveAs(new Blob([response.data]), filename)
      })
      .catch(err => {
        console.log(err)
      })
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p>Enter a Youtube URL</p>
        <form onSubmit={this.handleSubmit}>
          <input
            name="link"
            value={this.state.link}
            placeholder="YouTube Url please"
            onChange={this.handleChange}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
