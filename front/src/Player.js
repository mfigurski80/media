import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import actions
import { setPlay, setQueuePos } from './redux/actions/postActions';

import './css/Player.css'; // import stylesheet

class Player extends Component {
  constructor(props) {
    super(props);
    this.loadNextSong = this.loadNextSong.bind(this);
    this.loadPrevSong = this.loadPrevSong.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  render() {
    var song = { // song default
      id: "-",
      title: "None",
      author: "Please load a collection"
    };
    if (this.props.song) song=this.props.song;

    return (
      <div className="player">
        <Link to={"/song/" + song.id}><div className="player__meta">
          <h3>{song.title}</h3>
          <h6>{song.author}</h6>
        </div></Link>
        <div className="player__controls">
          <i className="fas fa-step-backward" onClick={this.loadPrevSong}></i>
          {this.props.isPlaying // play/pause toggle button
            ?
            (<i className="fas fa-pause" onClick={this.togglePlay}></i>)
            :
            <i className="fas fa-play" onClick={this.togglePlay}></i>
          }
          <i className="fas fa-step-forward" onClick={this.loadNextSong}></i>
        </div>
      </div>
    );
  }



  /* ****
  Custom Functions
  **** */

  loadNextSong() {
    this.props.setQueuePos(this.props.songQueuePos + 1);
  }
  loadPrevSong() {
    this.props.setQueuePos(this.props.songQueuePos - 1);
  }


  togglePlay() {
    // if current song is defined, set global state to play!
    if (this.props.song) this.props.setPlay(!this.props.isPlaying);
  }

}




Player.proptypes = {
  song: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    source: PropTypes.string,
    id: PropTypes.string
  }),
  songQueuePos: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  volume: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  song: state.songQueue[state.songQueuePos],
  songQueuePos: state.songQueuePos,
  isPlaying: state.isPlaying,
  volume: state.volume
})
export default connect(mapStateToProps, { setPlay, setQueuePos })(Player)
