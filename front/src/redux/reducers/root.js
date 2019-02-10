import { SET_POSTS, RESET_NOTIFICATIONS } from '../actions/types';



export default function(state, action) {
  switch (action.type) {


    case SET_POSTS:
      return {
        ...state,
        posts: action.payload
      }

    case RESET_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      }


    default:
      console.log(`[./redux/reducers/root]\nAction type '${action.type}' wasn't found`);
      return state;
  }
}
