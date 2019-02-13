import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // React-Router docs: https://reacttraining.com/react-router/web/guides/basic-components

// import some paths
import Home from './views/Home';
import Profile from './views/Profile';
// import components
import Player from './Player';
import ReactHowler from 'react-howler'; // audio wrapper docs: https://www.npmjs.com/package/react-howler

// import actions
import { nextSong } from './redux/actions/postActions';

import './css/App.css'; // stylesheet import



/**
 * General component to contain entire app. Functions as a router
 */
class App extends Component {
  render() {
    return (
      <Router>
        <div className="app"> {/* Router can only have one child, so need this to wrap */}

          <div className="app__page">
            <Switch> {/* Render only first match */}
              <Route exact path="/" component={Home}/>
              <Route path="/profile" component={Profile} />
            </Switch>
          </div>

          <Player />

          {this.props.sourceList[this.props.sourceListPos]
            ? ( // if next song is defined...
              <ReactHowler
                src={this.props.sourceList[this.props.sourceListPos]}
                playing={this.props.isPlaying}
                preload={true}
                volume={this.props.volume}
                onEnd={this.props.nextSong}
                onLoadError={this.props.nextSong}
              />
          ) : ( // if undefined, don't render ReactHowler
              null
            )
          }


        </div>
      </Router>
    );
  }
}


App.propTypes = {
  nextSong: PropTypes.func.isRequired,
  sourceList: PropTypes.array.isRequired,
  sourceListPos: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  volume: PropTypes.number.isRequired
}

const mapStateToProps = (state) => ({
  sourceList: state.songQueue.map(song => song.source),
  sourceListPos: state.songQueuePos,
  isPlaying: state.isPlaying,
  volume: state.volume,
});
export default connect(mapStateToProps,{ nextSong })(App);
