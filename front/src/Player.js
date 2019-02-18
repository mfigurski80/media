import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import components
import ReactHowler from 'react-howler'; // audio wrapper docs: https://www.npmjs.com/package/react-howler
// import actions
import { nextSong, prevSong } from './redux/actions/postActions';

import './css/Player.css'; // import stylesheet

class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      viewed_width: 0,
      isPlaying: false,
    }
    this.updateInterval = undefined;

    this.loadNextSong = this.loadNextSong.bind(this);
    this.loadPrevSong = this.loadPrevSong.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.playerSeeking = this.playerSeeking.bind(this);
  }

  render() {
    var song = { // song default
      title: "--",
      author: "Please load a collection"
    };
    if (this.props.song) song=this.props.song; // if song exists


    // if is playing, howler exists, but update-interval doesn't...
    if (this.state.isPlaying && this.howler && !this.updateInterval && this.props.song) {
      this.updateInterval = window.setInterval(() => { // create update interval
        if (this.howler) {
          this.setState({
            viewed_width: 100*this.howler.seek()/this.howler.duration()
          });
        }
      }, 500);
    } // else, if is not playing but interval exists...
    else if ((!this.state.isPlaying || !this.props.song) && this.updateInterval) {
      window.clearInterval(this.updateInterval); // clear interval
      this.updateInterval = undefined;
    }


    return (
      <div className="player">

        {this.props.song ? ( // if next song is defined...
          <ReactHowler
            ref={(ref) => (this.howler = ref)}
            src={this.props.song.source}
            playing={this.state.isPlaying}
            preload={true}
            volume={this.props.volume}
            onEnd={this.loadNextSong}
          />
        ) : ( // if undefined, don't render ReactHowler
            null
          )
        }

        <Link to={"/song/" + song.title.replace(' ','-')}>
          <div className="player__meta">
            <h3>{song.title}</h3>
            <h6>{song.author}</h6>
          </div>
        </Link>
        <div className="player__seekBar" onMouseDown={this.playerSeeking}>
          <div className="player__seekBar__viewed" style={{width: this.state.viewed_width + "%"}}></div>
          <div className="player__seekBar__button" onMouseDown={this.playerSeeking}></div>
        </div>
        <div className="player__controls">
          <div className="player__controls__button" onClick={this.loadPrevSong}>
            <i className="fas fa-step-backward"></i>
          </div>
          <div className="player__controls__button" onClick={this.togglePlay}>
            {this.state.isPlaying && this.props.song // play/pause toggle button
              ?
              (<i className="fas fa-pause"></i>)
              :
              <i className="fas fa-play"></i>
            }
          </div>
          <div className="player__controls__button" onClick={this.loadNextSong}>
            <i className="fas fa-step-forward" ></i>
          </div>
        </div>
      </div>
    );
  }



  /* ****
  Custom Functions
  **** */

  loadNextSong(e) {
    if (e) e.preventDefault();
    if (this.howler) this.howler.seek(0);
    this.props.nextSong();
  }
  loadPrevSong(e) {
    if (e) e.preventDefault();
    if (this.howler) this.howler.seek(0);
    this.props.prevSong();
  }


  togglePlay(e) {
    if (e) e.preventDefault();

    var willPlay = false;
    if (this.props.song) { // if song is defined
      willPlay = !this.state.isPlaying;
    }
    this.setState({
      isPlaying: willPlay
    })
  }


  playerSeeking(e) {
    if (e) e.preventDefault();
    if (!this.props.song) return;
    const seek_elem = document.getElementsByClassName('player__seekBar')[0];
    const viewed_elem = document.getElementsByClassName('player__seekBar__viewed')[0];

    this.setState({
      isPlaying: false
    }); // turn off play

    viewed_elem.style.width = ((e.clientX - seek_elem.offsetLeft)/seek_elem.offsetWidth) * 100 + "%";
    window.onmousemove = (e) => {
      viewed_elem.style.width = ((e.clientX - seek_elem.offsetLeft)/seek_elem.offsetWidth) * 100 + "%";
    }
    window.onmouseup = (e) => {
      e.preventDefault();
      window.onmousemove = undefined; // reset listeners
      window.onmouseup = undefined;
      // set seek
      this.howler.seek(((e.clientX - seek_elem.offsetLeft)/seek_elem.offsetWidth) * this.howler.duration());
      this.setState({
        isPlaying: true
      }); // turn on playing
    }
  }

}




Player.propTypes = {
  song: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    source: PropTypes.string,
    id: PropTypes.string
  }),
  volume: PropTypes.number.isRequired,
}

const mapStateToProps = (state) => ({
  song: state.songQueue[state.songQueuePos],
  volume: state.volume,
});
export default connect(mapStateToProps, { nextSong, prevSong })(Player)
