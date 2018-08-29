import React, { Component, Fragment } from 'react';
import { Section, Field, Label, Input, Button, Columns, Column } from 'bloomer';
import FileSaver from 'file-saver';
import axios from 'axios';

require("dotenv").config()


class Form extends Component {
  state = {
    link: "",
    file: "",
    api: process.env.REACT_APP_API,
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
    return(
      <Fragment>
        <Section>
          <Field>
            <Columns isCentered>
              <Column isSize={4}>
                <Input
                  type="text"
                  name="link"
                  placeholder="Please enter a valid URL"
                  value={this.state.link}
                  onChange={this.handleChange}
                  isSize="medium"
                  isColor="primary"
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
      </Fragment>
    )
  }
}
export default Form;