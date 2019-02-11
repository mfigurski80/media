import { SET_POSTS } from './types';

export const fetchPosts = () => dispatch => {
  fetch("http://jsonplaceholder.typicode.com/posts") // TODO: once backend is done, replace fetch
    .then(res => res.json())
    .then(data => dispatch({
      type: SET_POSTS,
      payload: data
    }));
}
