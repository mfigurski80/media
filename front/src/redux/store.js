import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root';


const initialState = {
  posts: [], // to delete once you remove Home page
  user: { // user object?
    name: 'Johnny B', // username
    likedSongs: ["1"], // likes
    likedCollections: ["1"],
    collectionReps: [{"1":15}] // reputation
  },
  songQueue: [{ // this is what a song object will look like roughly.
    title: "Miracle",
    author: "Caravan Palace",
    source: './resources/Miracle.mp3',
    id: '1'
  }],
  songQueuePos: 0,
  isPlaying: false,
  volume: .75
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
