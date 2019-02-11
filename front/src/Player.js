import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Howl, Howler } from 'howler'; // Howler docs: https://github.com/goldfire/howler.js


import './css/Player.css';

class Player extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlay: false,
      songQueuePos: -1,
      songLoaded: false,
      song: {
        source: undefined,
        title: undefined,
        author: undefined,
        Howl: undefined,
      },
      volume: .75
    }

    this.loadNextSong = this.loadNextSong.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
  }

  componentWillMount() {
    this.loadNextSong()
  }

  render() {
    return (
      <div className="player">
        <p>Player</p>
        <h4 onClick={this.togglePlay}>{this.state.song.title} - {this.state.song.author}</h4>
      </div>
    );
  }



  /* ****
  Custom Functions
  **** */

  loadNextSong() {
    if (this.props.songQueue.length > this.state.songQueuePos) { // if songQueuePos is valid...
      const curSong = this.props.songQueue[this.state.songQueuePos+1]; // load next song
      console.log("Loaded: " + curSong.title + " - " + curSong.author);

      const howl = new Howl({ // form playable audio object
        src: [curSong.source],
        volume: this.state.volume
      });
      // howl.play();

      this.setState({
        songLoaded: true,
        songQueuePos: this.state.songQueuePos + 1,
        song: {
          source: curSong.source,
          title: curSong.title,
          author: curSong.author,
          Howl: howl
        }
      })

    } else {
      // TODO: load some sort of default placeholder?...
    }
  }

  togglePlay() {
    // play/pause howl
    if (this.state.isPlay) {
      this.state.song.Howl.pause()
    } else {
      this.state.song.Howl.play()
    }
    // update state
    this.setState({
      isPlay: !this.state.isPlay
    });
  }

}


Player.proptypes = {
  songQueue: PropTypes.array
}

const mapStateToProps = (state) => ({
  songQueue: state.songQueue
})
export default connect(mapStateToProps, {})(Player)
