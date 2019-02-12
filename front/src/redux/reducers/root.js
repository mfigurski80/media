import { SET_POSTS, SET_PLAY, SET_QUEUEPOS, SET_VOLUME } from '../actions/types';



export default function(state, action) {
  switch (action.type) {


    case SET_POSTS:
      return {
        ...state,
        posts: action.payload
      }


    case SET_PLAY:
      if (!state.songQueue[state.songQueuePos]) return { // if invalid song
        ...state,
        isPlaying: false,
      };
      return {
        ...state,
        isPlaying: action.payload,

      }


    case SET_QUEUEPOS:
      if (action.payload >= state.songQueue.length) return { // if pos too high
        ...state,
        songQueuePos: state.songQueue.length, // set to maximum (1 after playlist)
        isPlaying: false
      }
      else if (action.payload < 0) return { // if too low
        ...state,
        songQueuePos: 0,
        isPlaying: false
      }
      return {
        ...state,
        songQueuePos: action.payload,
        isPlaying: true // also immediately play selected song (TODO: make sure its not out of bounds!)
      }


    case SET_VOLUME:
      return {
        ...state,
        volume: action.payload
      }


    default:
      console.log(`[./redux/reducers/root]\nAction type '${action.type}' wasn't found`);
      return state;
  }
}
