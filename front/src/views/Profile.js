import React, { Component } from 'react';

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: 'default'
      }
    }

  }

  render() {
    return (
      <div>
        <h1>Profile</h1>
      </div>
    );
  }
}
