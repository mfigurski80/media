import {
  SET_QUEUEPOS,
  NEXT_SONG,
  PREV_SONG,
  SET_VOLUME,
  SET_PLAY,
  SET_LOOP
} from '../actions/types';



export default function(state, action) {
  switch (action.type) {

    // setting queue position
    case SET_QUEUEPOS:
      if (action.payload < 0 || action.payload > state.songQueue.length) return { // if out of bounds
        ...state,
        isPlaying: false,
        songQueuePos: action.payload
      }
      return {
        ...state,
        songQueuePos: action.payload,
        isPlaying: true // also immediately play selected song
      }
    case NEXT_SONG:
      if (state.songQueuePos === state.songQueue.length) return { // if already over...
        ...state,
        isPlaying: false // keep playstate at 'false'
      }
      else if (state.songQueuePos === state.songQueue.length - 1) { // if will be over...
        if (state.isLoop) { // if is looping...
          return {
            ...state,
            songQueuePos: 0
          }
        } else return { // otherwise
          ...state,
          isPlaying: false, // turn playstate to 'false'
          songQueuePos: state.songQueuePos + 1
        }
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

    case SET_PLAY:
      if (state.songQueuePos >= state.songQueue.length || state.songQueuePos < 0) return { // if undefined
        ...state,
        isPlaying: false
      }; // NOTE: at no point should the play state be true if the song isn't defined.
      else return { // if defined, let em do whatever they want
        ...state,
        isPlaying: action.payload
      };

    case SET_LOOP:
      return {
        ...state,
        isLoop: action.payload
      }

    default:
      console.log(`[./redux/reducers/root]\nAction type '${action.type}' wasn't found`);
      return state;
  }
}
