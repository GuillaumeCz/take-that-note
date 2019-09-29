import React, { Component } from "react";
import ipfsClient from "ipfs-http-client";
import CryptoJs from "crypto-js";

const Buffer = require("buffer/").Buffer;

export default class Get extends Component {
  constructor(props) {
    super(props);

    const ipfs = ipfsClient("localhost", "5001", { protocol: "http" });

    this.state = {
      hash: "",
      key: "",
      result: "",
      ipfs: ipfs
    };

    this.handleChangeHash = this.handleChangeHash.bind(this);
    this.handleChangeKey = this.handleChangeKey.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleChangeHash(event) {
    this.setState({ hash: event.target.value });
  }
  handleChangeKey(event) {
    this.setState({ key: event.target.value });
  }

  handleClick(event) {
    this.state.ipfs.get(this.state.hash).then(res => {
      const buff = Buffer.from(res[0].content).toString();
      const encryptedNote = JSON.parse(buff).content;

      const bytes = CryptoJs.AES.decrypt(encryptedNote, this.state.key);
      const final = bytes.toString(CryptoJs.enc.Utf8);
      this.setState({
        result: final
      });
    });
  }

  render() {
    return (
      <div>
        <h1> GET </h1>
        <div>
          {" "}
          Hash{" "}
          <input
            type="text"
            value={this.state.hash}
            onChange={this.handleChangeHash}
          />{" "}
        </div>
        <div>
          {" "}
          Key{" "}
          <input
            type="text"
            value={this.state.key}
            onChange={this.handleChangeKey}
          />{" "}
        </div>
        <div>
          <button onClick={this.handleClick}> Click ! </button>{" "}
        </div>
        <div>{this.state.result}</div>
      </div>
    );
  }
}
