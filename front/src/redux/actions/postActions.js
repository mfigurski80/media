import {
  SET_POSTS,
  SET_PLAY,
  SET_QUEUEPOS,
  NEXT_SONG,
  PREV_SONG,
  SET_VOLUME
} from './types';

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

// song position controls
export const setQueuePos = (newPos) => dispatch => {
  dispatch({
    type: SET_QUEUEPOS,
    payload: newPos
  });
}
export const nextSong = () => dispatch => {
  dispatch({
    type: NEXT_SONG,
    payload: undefined
  });
}
export const prevSong = () => dispatch => {
  dispatch({
    type: PREV_SONG,
    payload: undefined
  });
}

export const setVolume = (newVolume) => dispatch => {
  dispatch({
    type: SET_VOLUME,
    payload: newVolume
  });
}
