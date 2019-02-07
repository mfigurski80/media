import React, { Component } from 'react';

export default class App extends Component {
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
