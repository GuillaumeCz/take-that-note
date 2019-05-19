import React, { Component } from 'react';
import ipfsClient from 'ipfs-http-client';
import CryptoJs from 'crypto-js';

const Buffer = require('buffer/').Buffer;

export default class Form extends Component {

  constructor(props) {
    super(props);

    const ipfs = ipfsClient('localhost', '5001', { protocol: 'http' });

    this.state = { 
      value: '',
      ipfs: ipfs,
      saved: '',
      key: ''
    };

    this.handleChangeKey = this.handleChangeKey.bind(this);
    this.handleChangeValue = this.handleChangeValue.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeValue(event) {
    this.setState({ value: event.target.value });
  }
  
  handleChangeKey(event) {
    this.setState({ key: event.target.value });
  }

  getPayload(_path, _note) {
    return {
      path: _path,
      content: Buffer.from(JSON.stringify(_note))
    };
  };

  handleSubmit(event) {
    const cipheredNote = CryptoJs.AES.encrypt(this.state.value, this.state.key).toString();
    const note = {
      content: cipheredNote
    };
    
    const payload = this.getPayload('test.json', note);

    this.state.ipfs
      .add(payload)
      .then(res => {
        this.setState({
          saved: res[0].hash
        });
      });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <div>
          <label>
            Note:
            <input type="text" value={this.state.value} onChange={this.handleChangeValue} />
          </label>
        </div>
        <div>
          <label>
            Key:
            <input type="text" value={this.state.key} onChange={this.handleChangeKey} />
          </label>
        </div>
        <div>
          <button onClick={this.handleSubmit}> Go ! </button>
        </div>
        
      { this.state.saved ? `http://127.0.0.1:8080/ipfs/${this.state.saved}` : null }
      </div>
    );
  }
};
