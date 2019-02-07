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
    this.state = {
      posts: [{"content":"This post is passed to the Profile page from the App's centeral state"}]
    }
  }

  render() {
    return (
      <Router>
        <div> {/* Router can only have one child, so need this to wrap */}
          <nav> {/* Rudimentary demo nav: TODO replace it */}
            <p>Navigation</p>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/profile">Profile</Link></li>
            </ul>
          </nav>

          <Switch> {/* Render only first match */}

            <Route exact path="/" render={(props) =>
              <Home {...props} posts={this.state.posts}/>
            }/>
            <Route path="/profile" component={Profile} />

          </Switch>
        </div>
      </Router>
    );
  }
}
