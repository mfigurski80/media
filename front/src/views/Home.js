import React, { Component } from 'react';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [{"title":"no posts yet"}]
    }
  }

  componentDidMount() {
    fetch('/posts')
      .then(res => res.json())
      .then(posts => this.setState({ posts }))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <h1>Home</h1>
        <p>Posts:</p>
        <ul>
          {this.state.posts.map((post) =>
            <li>{post.title}</li>
          )}
        </ul>
      </div>
    );
  }
};
