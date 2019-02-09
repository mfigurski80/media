import React, { Component } from 'react';
// React-Router -- docs: https://reacttraining.com/react-router/web/guides/basic-components
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

// import some paths
import Home from './views/Home';
import Profile from './views/Profile';

import './css/App.css'; // stylesheet import

/**
 * General component to contain entire app. Also functions as a router
 */
export default class App extends Component {
  render() {

    // navigation bar elem
    const nav_elem = (
      <nav className="app__nav">

        <div className="app__nav__top">
          <Link to="/"><i className="fas fa-home"></i></Link>
        </div>

        <div className="app__nav__bottom">
          <i className="fas fa-bell"></i>
          <Link to="/profile"><img className="app__nav__bottom__profile" src="./resources/profile.jpg" alt="profile-img"></img></Link>
        </div>

      </nav>
    );

    // COMPOSE APP
    return (
      <Router>
        <div className="app"> {/* Router can only have one child, so need this to wrap */}

          {nav_elem}

          <div className="app__page">
            <Switch> {/* Render only first match */}
              <Route exact path="/" component={Home}/>
              <Route path="/profile" component={Profile} />
            </Switch>
          </div>

        </div>
      </Router>
    );
  }

}
