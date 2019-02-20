import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

import './../css/page/Home.css'; // stylesheet import


class Home extends Component {
  render() {
    return (
      <div className="page-Home">
        <h2>Home</h2>
        <div className="page-Home__container">

          {
            this.props.posts.map(post => (

              <div className="page-Home__container__section">
                <div className="page-Home__container__section__post">
                  <div className="page-Home__container__section__post__info">
                    <h2>{post.title}</h2>
                    <p>{post.author}</p>
                  </div>
                </div>
              </div>

            ))
          }

        </div>
      </div>
    );
  }
}


Home.propTypes = {
  posts: PropTypes.array
}

const mapStateToProps = (state) => ({
  posts: state.posts
});
export default connect(mapStateToProps, {})(Home);
