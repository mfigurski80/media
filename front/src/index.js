import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'; // Redux imports
import store from './redux/store';


import App from './App';
import * as serviceWorker from './serviceWorker';

import './css/index.css'; // stylesheet import

ReactDOM.render((
  <Provider store={store}> {/* Redux */}
    <App />
  </Provider>
), document.getElementById('__root__'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
