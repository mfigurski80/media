import { SET_POSTS } from '../actions/types';



export default function(state, action) {
  switch (action.type) {


    case SET_POSTS:
      return {
        ...state,
        posts: action.payload
      }


    default:
      console.log(`[./redux/reducers/root]\nAction type '${action.type}' wasn't found`);
      return state;
  }
}
