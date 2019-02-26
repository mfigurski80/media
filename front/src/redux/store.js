import {
  createStore, applyMiddleware, compose
}
from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/root';


const initialState = {
  posts: [
    {title: "Miracle",author: "Caravan Palace",source: "../resources/Miracle.mp3"},
    {title: "Jungle",author: "Hurley Mower",source: "../resources/Jungle.mp3"},
    {title: "Miracle",author: "Caravan Palace",source: "../resources/Miracle.mp3"},
    {title: "Jungle",author: "Hurley Mower",source: "../resources/Jungle.mp3"},
    {title: "Miracle",author: "Caravan Palace",source: "../resources/Miracle.mp3"},
    {title: "Jungle",author: "Hurley Mower",source: "../resources/Jungle.mp3"},
    {title: "Miracle",author: "Caravan Palace",source: "../resources/Miracle.mp3"},
    {title: "Jungle",author: "Hurley Mower",source: "../resources/Jungle.mp3"},
    {title: "Miracle",author: "Caravan Palace",source: "../resources/Miracle.mp3"},
    {title: "Jungle",author: "Hurley Mower",source: "../resources/Jungle.mp3"},
    {title: "Miracle",author: "Caravan Palace",source: "../resources/Miracle.mp3"},
  ],
  songQueue: [{ // this is what a song object will look like roughly.
    title: "Jungle",
    author: "Hurley Mower",
    source: '../resources/Jungle.mp3'
  }],
  songQueuePos: 0, // position in songQueue
  isPlaying: false,
  volume: .75 // volume
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
