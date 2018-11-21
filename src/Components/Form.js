import React, { Component } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import { Section, Field, Input, Button, Container, Columns, Column, Title } from 'bloomer';

import Icon from './LoadingIcon';


class Form extends Component {
  state = {
    url: "",
    file: "",
    isDownloading: false,
    downloadFailed: false,
    isConverting: false,
    conversionFailed: false,
    isComplete: false,
    api: process.env.REACT_APP_API,
    test: process.env.REACT_APP_TEST,
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSubmit = event => {
    event.preventDefault();
    const url = this.state.url
    this.setState({ url: '' })
    if (url)
      this.sendDownloadRequest(url);
  }
  sendDownloadRequest(url) {
    const data = {'url': url}
    this.setState({ isDownloading: true })

    axios.post(`${this.state.api}/download`, data)
      .then(response => {
        const status_url = response.data['status']
        this.checkDownloadStatus(status_url)
      })
      .catch(err => {
        console.log(err)
        this.setState({ isDownloading: false })
      })
  }
  checkDownloadStatus(status_url) {
    axios.get(`${this.state.api}${status_url}`)
      .then(response => {
        const status = response.data['status']
        if (status === 'Complete') {
          this.setState({
            isDownloading: false,
            file: response.data['file']
          })
          this.sendConversionRequest()
        }
        else if (status === 'Failed') {
          this.setState({
            isDownloading: false,
            downloadFailed: true,
          })
          return
        }
        else {
          setTimeout(() => {
            this.checkDownloadStatus(status_url);
          }, 2000)
        }
      })
      .catch(err => {
        this.setState({ isDownloading: false })
      })
  }
  sendConversionRequest() {
    const file = this.state.file
    this.setState({ isConverting: true })

    axios.get(`${this.state.api}/convert/${file}`)
      .then(response => {
        const status_url = response.data['status']
        this.checkConversionStatus(status_url)
      })
      .catch(err => {
        console.log(err)
        this.setState({ isConverting: false })
      })
  }
  checkConversionStatus(status_url) {
    axios.get(`${this.state.api}${status_url}`)
      .then(response => {
        const status = response.data['status']
        if (status === 'Complete') {
          this.setState({
            isConverting: false,
            isComplete: true,
            file: response.data['file']
          })
          this.retrieveFile()
        }
        else if (status === 'Failed') {
          this.setState({
            isConverting: false,
            conversionFailed: true,
          })
        }
        else {
          setTimeout(() => {
            this.checkConversionStatus(status_url)
          }, 2000)
        }
      })
      .catch(err => {
        console.log(err)
        this.setState({ isConverting: false })
      })
  }
  retrieveFile() {
    const file = this.state.file
    axios.get(`${this.state.api}/retrieve/${file}`, {
      responseType: 'blob',
    })
      .then(response => {
        FileSaver.saveAs(new Blob([response.data]), file)
        this.setState({ file: '', url: '' })
      })
      .catch(err => {
        this.setState({ isConverting: false })
        console.log(err)
      })
  }
  displayStatusText() {
    if (this.state.isDownloading)
      return <Title isSize={4}>downloading...</Title>
    else if (this.state.isConverting)
      return <Title isSize={4}>converting...</Title>
    else if (this.state.isComplete)
      return <Title isSize={4}>complete!</Title>
    else if (this.state.downloadFailed)
      return <Title isSize={4}>Error: Unable to download from YouTube</Title>
    else if (this.state.conversionFailed)
      return <Title isSize={4}>Error: Converting audio to mp3 failed</Title>
  }
  displayLoadingIcon() {
    if (this.state.isDownloading || this.state.isConverting) {
      return <Icon />
    }
    else {
      return null
    }
  }
  render() {
    return(
      <Container>
        <Section>
          <Field>
            <Columns isCentered>
              <Column isSize={6}>
                <Input
                  type="text"
                  name="url"
                  placeholder="Please enter a valid URL"
                  value={this.state.url}
                  onChange={this.handleChange}
                  isSize="medium"
                  isColor="primary"
                  hasTextAlign="centered"
                  onClick={() => this.setState({
                    isComplete: false,
                    downloadFailed: false,
                    conversionFailed: false
                  })}
                  />
              </Column>
            </Columns>

            <Button
              onClick={this.handleSubmit}
              isColor="success"
              isOutlined>
                Download
            </Button>
          </Field>
        </Section>
        {this.displayLoadingIcon()}
        {this.displayStatusText()}
      </Container>
    )
  }
}
export default Form;