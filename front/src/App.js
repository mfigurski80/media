import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// import some paths
import Home from './views/Home';
// import components
import Player from './Player';

import './css/App.css'; // stylesheet import



/**
 * General component to contain entire app.
 */
class App extends Component {
  render() {
    return (
      <div className="app">

        <div className="app__view">

          <div className="app__view__page">
            <Home />
          </div>

        </div>

        <Player />

      </div>
    );
  }
}



App.propTypes = {
  sourceList: PropTypes.array.isRequired,
  sourceListPos: PropTypes.number.isRequired,
}

const mapStateToProps = (state) => ({
  sourceList: state.songQueue.map(song => song.source),
  sourceListPos: state.songQueuePos,
});
export default connect(mapStateToProps,{})(App);
