import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchPosts } from '../redux/actions/postActions';

class Home extends Component {
  componentWillMount() {
    this.props.fetchPosts();
  }

  render() {

    const postItems = this.props.posts.map(post =>
      <div key={post.id}>
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

}

// Prop Types check
Home.propTypes = {
  fetchPosts: PropTypes.func.isRequired,
  posts: PropTypes.array.isRequired
}

const mapStateToProps = state => ({ // given entire state, what do you want as props for Home
  posts: state.posts
});
export default connect(mapStateToProps, { fetchPosts })(Home);
