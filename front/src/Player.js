import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// import components
import ReactHowler from 'react-howler'; // audio wrapper docs: https://www.npmjs.com/package/react-howler
// import actions
import { nextSong, prevSong, setVolume, setPlay } from './redux/actions/postActions';

import './css/Player.css'; // import stylesheet


class Player extends Component {
  constructor(props) {
    super(props);

    this.state = {
      percentViewed: 0,
      isInterrupted: false,
    }
    this.updateInterval = undefined;

    this.loadNextSong = this.loadNextSong.bind(this);
    this.loadPrevSong = this.loadPrevSong.bind(this);
    this.togglePlay = this.togglePlay.bind(this);
    this.playerSeeking = this.playerSeeking.bind(this);
    this.updatePercent = this.updatePercent.bind(this);
  }

  componentDidUpdate() {
    if (this.props.isPlaying && !this.updateInterval) {
      this.updateInterval = window.setInterval(this.updatePercent, 500);
    }
  }

  render() {
    // set default song (in case isn't defined)
    var song = {title:"-",author:"-"};
    if (this.props.song) song = this.props.song;


    return (
      <div className="player">

        {song.source ? ( // if song is defined...
          <ReactHowler
            ref={(ref) => (this.howler = ref)}
            src={song.source}
            playing={(this.props.isPlaying && !this.state.isInterrupted)}
            preload={true}
            volume={this.props.volume}
            onEnd={this.loadNextSong}
          />
        ) : ( // if undefined, don't render ReactHowler
            null
          )
        }

        <Link to={"song/" + song.title}><div className="player__meta">
          <h3>{song.title}</h3>
          <p>{song.author}</p>
        </div></Link>
        <div className="player__seekBar" onMouseDown={this.playerSeeking}>
          <div className="player__seekBar__viewed" style={{width: this.state.percentViewed + "%"}}></div>
          <div className="player__seekBar__button" onMouseDown={this.playerSeeking}></div>
        </div>
        <div className="player__controls">
          <div className="player__controls__button" onClick={this.loadPrevSong}>
            <i className="fas fa-step-backward"></i>
          </div>
          <div className="player__controls__button" onClick={this.togglePlay}>
            {(this.props.isPlaying && !this.state.isInterrupted)
              ?
              <i className="fas fa-pause"></i>
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

  /**
   * Loads next song and resets Howler Object
   */
  loadNextSong() {
    this.props.nextSong();
    if (this.howler) {
      this.howler.seek(0);
      this.setState({
        percentViewed: 0
      });
    }
  }
  /**
   * Loads previous song and resets Howler Object
   */
  loadPrevSong() {
    this.props.prevSong();
    if (this.howler) {
      this.howler.seek(0);
      this.setState({
        percentViewed: 0
      });
    }
  }


  /**
   * Toggles the play state
   */
  togglePlay() {
    this.props.setPlay(!this.props.isPlaying);
  }


  /**
   * Adjusts viewedPercent bar in response to mouse movements
   * @param  {Event Object} e event from mouseclick
   */
  playerSeeking(e) {
    if (!this.props.song) return; // if song is undefined, leave it
    // setup elems we will need!
    const seek_elem = document.getElementsByClassName('player__seekBar')[0];

    this.setState({
      percentViewed: ((e.clientX - seek_elem.offsetLeft)/seek_elem.offsetWidth) * 100,
      isInterrupted: true
    });

    // viewed_elem.style.width = ((e.clientX - seek_elem.offsetLeft)/seek_elem.offsetWidth) * 100 + "%";
    window.onmousemove = (e) => {
      this.setState({
        percentViewed: ((e.clientX - seek_elem.offsetLeft)/seek_elem.offsetWidth) * 100
      });
    }
    window.onmouseup = (e) => {
      window.onmousemove = undefined; // reset listeners
      window.onmouseup = undefined;
      // set seek
      this.howler.seek(((e.clientX - seek_elem.offsetLeft)/seek_elem.offsetWidth) * this.howler.duration());
      this.setState({
        isInterrupted: false
      }); // turn on playing
    }
  }


  /**
   * Updates the percentViewed bar. Built to be run repeatedly, on an interval
   */
  updatePercent() {
    if ((!this.props.isPlaying || this.state.isInterrupted) && this.updateInterval) { // if shouldn't be update but is...
      window.clearInterval(this.updateInterval);
      this.updateInterval = undefined;
      return;
    }
    // find new percent viewed
    let new_percentViewed = 100*this.howler.seek()/this.howler.duration();
    this.setState({
      percentViewed: new_percentViewed
    });
  }

}



Player.propTypes = {
  song: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    source: PropTypes.string
  }),
  volume: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,

  nextSong: PropTypes.func.isRequired,
  prevSong: PropTypes.func.isRequired,
  setVolume: PropTypes.func.isRequired,
  setPlay: PropTypes.func.isRequired
}

const mapStateToProps = (state) => ({
  song: state.songQueue[state.songQueuePos],
  volume: state.volume,
  isPlaying: state.isPlaying
});
export default connect(mapStateToProps, { nextSong, prevSong, setVolume, setPlay })(Player)
