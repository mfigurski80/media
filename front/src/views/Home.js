import React, { Component } from 'react';

export default class Home extends Component {
  render() {
    return (
      <div>
        <h1>Home</h1>
        <p>Posts:</p>
        <ul>
          {this.props.posts.map((post, index) =>
            <li key={index}>{post.content}</li>
          )}
        </ul>
      </div>
    );
  }
};
