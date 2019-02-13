import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import actions
import { setPlay, nextSong, prevSong } from './redux/actions/postActions';

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
      id: "--",
      title: "--",
      author: "Please load a collection"
    };
    if (this.props.song) song=this.props.song;

    return (
      <div className="player">
        <Link to={"/song/" + song.id}>
          <div className="player__meta">
            <h3>{song.title}</h3>
            <h6>{song.author}</h6>
          </div>
        </Link>
        <div className="player__seekBar" onMouseDown={this.playerSeeking}>
          <div className="player__seekBar__viewed"></div>
          <div className="player__seekBar__button"></div>
        </div>
        <div className="player__controls">
          <div className="player__controls__button"><i className="fas fa-step-backward" onClick={this.loadPrevSong}></i></div>
          <div className="player__controls__button">
            {this.props.isPlaying // play/pause toggle button
              ?
              (<i className="fas fa-pause" onClick={this.togglePlay}></i>)
              :
              <i className="fas fa-play" onClick={this.togglePlay}></i>
            }
          </div>
          <div className="player__controls__button"><i className="fas fa-step-forward" onClick={this.loadNextSong}></i></div>
        </div>
      </div>
    );
  }



  /* ****
  Custom Functions
  **** */

  loadNextSong(e) {
    if (e) e.preventDefault();
    this.props.nextSong();
  }
  loadPrevSong(e) {
    if (e) e.preventDefault();
    this.props.prevSong();
  }


  togglePlay(e) {
    if (e) e.preventDefault();
    // set global state to play! redux will figure out if song is defined
    this.props.setPlay(!this.props.isPlaying);
  }


  playerSeeking(e) {
    if (e) e.preventDefault();
    const viewed_elem = document.getElementsByClassName('player__seekBar__viewed')[0];
    // console.log(e.clientX);
    // console.log(e.target.offsetLeft);
    // console.log(e.target.offsetWidth);
    console.log(((e.clientX - e.target.offsetLeft)/e.target.offsetWidth) * 100);
    viewed_elem.style.width = ((e.clientX - e.target.offsetLeft)/e.target.offsetWidth) * 100 + "%";
  }

}




Player.propTypes = {
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
export default connect(mapStateToProps, { setPlay, nextSong, prevSong })(Player)
