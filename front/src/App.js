import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // React-Router docs: https://reacttraining.com/react-router/web/guides/basic-components

// import some paths
import Home from './views/Home';
import Profile from './views/Profile';
import Song from './views/Song';
// import components
import Player from './Player';
import Nav from './Nav';

import './css/App.css'; // stylesheet import



/**
 * General component to contain entire app. Functions as a router
 */
class App extends Component {
  render() {
    return (
      <Router>
        <div className="app"> {/* Router can only have one child, so need this to wrap */}

          <div className="app__view">

            <Nav />

            <div className="app__view__page">
              <Switch> {/* Render only first match of pages */}
                <Route exact path="/" component={Home}/>
                <Route path="/profile" component={Profile} />
                <Route path="/song/:title" component={Song}/>
              </Switch>
            </div>

          </div>

          <Player />

        </div>
      </Router>
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
