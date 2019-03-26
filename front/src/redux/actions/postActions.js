import {
  SET_QUEUEPOS,
  NEXT_SONG,
  PREV_SONG,
  SET_VOLUME,
  SET_PLAY,
  SET_LOOP
} from './types';

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

export const setPlay = (newPlay) => dispatch => {
  dispatch({
    type: SET_PLAY,
    payload: newPlay
  });
}

export const setLoop = (newIsLoop) => dispatch => {
  dispatch({
    type: SET_LOOP,
    payload: newIsLoop
  });
}
