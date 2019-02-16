import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root';


const initialState = {
  songQueue: [{ // this is what a song object will look like roughly.
    title: "Miracle",
    author: "Caravan Palace",
    source: './resources/Miracle.mp3',
    id: '1'
  }],
  songQueuePos: 0, // position in songQueue
  songPos: 0,     // how much of song has been played (s)
  isSeeking: false, // determines whether songPos is descriptive or prescriptive
  isPlaying: false, // if is playing
  volume: .75     // volume
};

const middleware = [thunk];
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
