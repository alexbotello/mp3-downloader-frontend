import React, { Component } from 'react';
import { Section, Field, Input, Button, Container, Columns, Column, Title } from 'bloomer';
import FileSaver from 'file-saver';
import axios from 'axios';

import Icon from './LoadingIcon';

require("dotenv").config()


class Form extends Component {
  state = {
    link: "",
    isDownloading: false,
    isConverting: false,
    api: process.env.REACT_APP_API,
    test: process.env.REACT_APP_TEST,
    token: process.env.REACT_APP_TOKEN,
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }
  handleSubmit = event => {
    event.preventDefault();
    const url = this.state.link
    this.setState({ link: '' })
    if (url)
      this.sendDownloadRequest(url)
  }
  sendDownloadRequest(url) {
    this.setState({ isDownloading: true })
    axios.get(`${this.state.api}/download?url=${url}`, {
      headers: {'Authorization': this.state.token}
    })
      .then(response => {
        this.setState({
          isDownloading: false,
          isConverting: true,
        })
        const file = String(response.data['file'])
        this.retrieveAudioFile(file)
      })
      .catch(err => {
        this.setState({ isDownloading: false })
        console.log(err)
      })
  }
  retrieveAudioFile(file) {
    axios.get(`${this.state.api}/convert/${file}`, {
      responseType: 'blob',
      timeout: 300000,
      headers: {'Authorization': this.state.token}
    })
      .then(response => {
        this.setState({ isConverting: false })
        const filename = response.headers['content-disposition'].split('filename=')[1]
        FileSaver.saveAs(new Blob([response.data]), filename)
      })
      .catch(err => {
        this.setState({ isConverting: false })
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
                  name="link"
                  placeholder="Please enter a valid URL"
                  value={this.state.link}
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