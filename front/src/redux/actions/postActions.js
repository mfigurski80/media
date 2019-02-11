import { SET_POSTS, SET_PLAY, SET_QUEUEPOS, SET_VOLUME } from './types';

export const fetchPosts = () => dispatch => {
  fetch("http://jsonplaceholder.typicode.com/posts") // TODO: once backend is done, replace fetch
    .then(res => res.json())
    .then(data => dispatch({
      type: SET_POSTS,
      payload: data
    }));
}

export const setPlay = (play) => dispatch => {
  dispatch({
    type: SET_PLAY,
    payload: play
  });
}

export const setQueuePos = (newPos) => dispatch => {
  dispatch({
    type: SET_QUEUEPOS,
    payload: newPos
  })
}

export const setVolume = (newVolume) => dispatch => {
  dispatch({
    type: SET_VOLUME,
    payload: newVolume
  })
}
