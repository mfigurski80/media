import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Link } from 'react-router-dom'

import Home from './views/Home';
import * as serviceWorker from './serviceWorker';

ReactDOM.render((
  <BrowserRouter>
    <Route exact path="/" component={Home}/>
  </BrowserRouter>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
