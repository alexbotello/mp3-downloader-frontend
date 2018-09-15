import React, { Component } from 'react';
import { Section, Field, Input, Button, Container, Columns, Column, Title } from 'bloomer';
import FileSaver from 'file-saver';
import axios from 'axios';

import Icon from './LoadingIcon';

require("dotenv").config()


class Form extends Component {
  state = {
    url: "",
    file: "",
    isDownloading: false,
    downloadFailed: false,
    isConverting: false,
    conversionFailed: false,
    api: process.env.REACT_APP_API,
    test: process.env.REACT_APP_TEST,
    token: process.env.REACT_APP_TOKEN,
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
    axios.post(`${this.state.api}/download`, data, {
      headers: {'Authorization': this.state.token}
    })
      .then(response => {
        // console.log(response)
        const status_url = response.data['Location']
        this.checkDownloadStatus(status_url)
      })
      .catch(err => {
        console.log(err)
        this.setState({ isDownloading: false })
      })
  }
  checkDownloadStatus(status_url) {
    axios.get(`${this.state.api}${status_url}`, {
      headers: {'Authorization': this.state.token},
    })
      .then(response => {
        // console.log(response)
        const status = response.data['status']
        if (status === 'SUCCESS') {
          this.setState({
            isDownloading: false,
            file: response.data['file']
          })
          this.sendConversionRequest()
        }
        else if (status === 'FAILED') {
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
    axios.get(`${this.state.api}/convert/${file}`, {
      headers: {'Authorization': this.state.token}
    })
      .then(response => {
        // console.log(response)
        const status_url = response.data['Location']
        this.checkConversionStatus(status_url)
      })
      .catch(err => {
        console.log(err)
        this.setState({ isConverting: false })
      })
  }
  checkConversionStatus(status_url) {
    axios.get(`${this.state.api}${status_url}`, {
      headers: {'Authorization': this.state.token},
    })
      .then(response => {
        // console.log(response)
        const status = response.data['status']
        if (status === 'SUCCESS') {
          const download_link = response.data['url']
          this.setState({
            isConverting: false,
            file: response.data['file']
          })
          this.retrieveFile(download_link)
        }
        else if (status === 'FAILED') {
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
  retrieveFile(url) {
    const file = this.state.file
    axios.get(url, {
      responseType: 'blob',
    })
      .then(response => {
        // console.log(response)
        FileSaver.saveAs(new Blob([response.data]), file)
        this.deleteFromS3()
        this.setState({
          file: '',
          url: ''
        })
      })
      .catch(err => {
        this.setState({ isConverting: false })
        console.log(err)
      })
  }
  deleteFromS3() {
    axios.get(`${this.state.api}/delete`, {
      headers: {'Authorization': this.state.token},
    })
      .then(response => {
        console.log(response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }
  displayLoadingText() {
    if (this.state.isDownloading)
      return <Title isSize={4}>downloading...</Title>
    else if (this.state.isConverting)
      return <Title isSize={4}>converting...</Title>
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
        {this.displayLoadingText()}
      </Container>
    )
  }
}
export default Form;