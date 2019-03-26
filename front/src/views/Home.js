import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setQueuePos } from './../redux/actions/postActions';

import './../css/page/Home.css'; // stylesheet import


class Home extends Component {
  render() {
    return (
      <div className="page-Home">

        <h3 className="page-Home__header">Song Queue</h3>

        {
          this.props.songQueue.map((post, index) => (

              <div key={index} className={"page-Home__post " + (this.props.songQueuePos === index ? "--selected" : "")} onClick={() => this.props.setQueuePos(index)}>
                <div className="page-Home__post__info">
                  <h2>{post.title}</h2>
                  <p>{post.author}</p>
                </div>
              </div>

          ))
        }

      </div>
    );
  }
}


Home.propTypes = {
  songQueue: PropTypes.array.isRequired,
  songQueuePos: PropTypes.number.isRequired,

  setQueuePos: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  songQueue: state.songQueue,
  songQueuePos: state.songQueuePos
});
export default connect(mapStateToProps, { setQueuePos })(Home);
