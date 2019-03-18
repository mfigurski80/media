import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

import './../css/page/Song.css'; // import stylesheet

class Song extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.match.params.title,
      author: undefined,
      groups: [],
      comments: [],
      likes: 0,
      views: 0
    }

  }

  componentWillMount() {
    // pretend get info
    window.setTimeout(() => {
      console.log('update');
      this.setState({
        author: 'Hurley Mower',
        groups: ['Electronic', 'Funk'],
        comments: [
          {
            author: 'somedude',
            content: 'Great song here',
            timestamp: 100000
          }, {
            author: 'notherDude',
            content: '@somedude true',
            timestamp: 11000000
          }
        ],
        likes: 142,
        viwes: 2042
      });
    }, 500);
  }

  render() {
    return (
      <div className='page-Song'>
        <div className='page-Song__container'>

          <div className='page-Song__container__title'>
            {/*Basic info on song*/}
            <h1>{this.state.title}</h1>
            <h2>{this.state.author}</h2>
          </div>

          <div className='page-Song__container__actions'>
            {/*TODO: Actions user can take (liking, playing, etc)*/}
          </div>

          <div className='page-Song__container__comments'>
            {/*TODO: Comments section*/}
          </div>

          <div className='page-Song__container__info'>
            {/*TODO: Aside for displaying statistics*/}
          </div>

        </div>
      </div>
    );
  }
}

export default Song;
