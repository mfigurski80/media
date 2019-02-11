import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'; // React-Router docs: https://reacttraining.com/react-router/web/guides/basic-components
import { Howl, Howler } from 'howler'; // Howler docs: https://github.com/goldfire/howler.js

// import some paths
import Home from './views/Home';
import Profile from './views/Profile';
// import components
import Player from './Player';

import './css/App.css'; // stylesheet import



/**
 * General component to contain entire app. Functions as a router
 */
export default class App extends Component {
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

        </div>
      </Router>
    );
  }
}
