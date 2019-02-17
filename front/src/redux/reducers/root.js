import {
  SET_QUEUEPOS,
  NEXT_SONG,
  PREV_SONG,
  SET_VOLUME,
} from '../actions/types';



export default function(state, action) {
  switch (action.type) {

    // setting queue position
    case SET_QUEUEPOS:
      if (action.payload < 0 || action.payload > state.songQueue.length) return { // if out of bounds
        ...state,
        isPlaying: false
      }
      return {
        ...state,
        songQueuePos: action.payload,
        isPlaying: true // also immediately play selected song
      }
    case NEXT_SONG:
      if (state.songQueuePos === state.songQueue.length) return { // if already over...
        ...state,
        isPlaying: false
      };
      else if (state.songQueuePos === state.songQueue.length - 1) return { // if will be over...
        ...state,
        isPlaying: false,
        songQueuePos: state.songQueuePos + 1
      }
      return {
        ...state,
        songQueuePos: state.songQueuePos + 1
      }
    case PREV_SONG:
      if (state.songQueuePos === 0) return {
        ...state,
        isPlaying: false
      }
      return {
        ...state,
        songQueuePos: state.songQueuePos - 1
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
