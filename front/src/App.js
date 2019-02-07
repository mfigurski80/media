import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
// ^^ React-Router docs: https://reacttraining.com/react-router/web/guides/basic-components

// import some paths
import Home from './views/Home';
import Profile from './views/Profile';


/**
 * General component to contain entire app. Also functions as a router
 */
export default class App extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <div> {/* Router can only have one child, so need this to wrap */}
          <Switch> {/* Render only first match */}

            <Route exact path="/" component={Home} />
            <Route path="/profile" component={Profile} />

          </Switch>
        </div>
      </Router>
    );
  }
}
