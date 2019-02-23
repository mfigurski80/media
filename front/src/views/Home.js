import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
import { setSongQueue } from './../redux/actions/postActions';

import './../css/page/Home.css'; // stylesheet import


class Home extends Component {
  render() {
    return (
      <div className="page-Home" background-text="Home.">

        <div className="page-Home__container">
          <h1>Page Home</h1>
        </div>

        <div className="page-Home__container">
          
          {
            this.props.posts.map((post, index) => (

              <div key={index} className="page-Home__container__section">
                <div className="page-Home__container__section__post" onClick={() => this.props.setSongQueue([this.props.posts[index]])}>
                  <div className="page-Home__container__section__post__info">
                    <h2>{post.title}</h2>
                    <p>{post.author}</p>
                  </div>
                </div>
              </div>

            ))
          }

          <p>Note, the pagination here, as well as the content itself, is gonna change dramatically</p>

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
export default connect(mapStateToProps, { setSongQueue })(Home);
