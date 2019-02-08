import { FETCH_POSTS } from '../actions/types';

const initialState = {
  posts: []
}

export default function(state = initialState, action) {
  switch (action.type) {


    case FETCH_POSTS:
      console.log(action)
      return {
        ...state,
        posts: action.payload
      }


    default:
      console.log(`[./redux/reducers/root]\nAction type '${action.type}' wasn't found`);
      return state;
  }
}
