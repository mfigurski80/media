import React, { Component } from 'react';

export default class Home extends Component {
  /* React lifecycle methods */
  constructor(props) {
    super(props);
    this.state = {
      posts: []
    }
  }

  componentWillMount() {
    this.getPosts()
      .then(res => {
        this.setState({
          posts: res
        });
      })
      .catch(err => console.log(err));
  }

  render() {
    const postItems = this.state.posts.map(post =>
      <div key={post}>
        <h3>{post.title}</h3>
        <p>{post.body}</p>
      </div>
    );

    return (
      <div>
        <h1>Home</h1>
        {postItems}
      </div>
    );
  }


  /* Custom Methods */
  getPosts() {
    return fetch("http://jsonplaceholder.typicode.com/posts") // TODO: once backend is done, replace fetch
      .then(res => res.json())
  }
}
