import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';

class Song extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: this.props.match.params.title,
      author: undefined,
      groups: [],
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
        groups: ['Electronic', 'Trap'],
        likes: 142,
        viwes: 2042
      });
    }, 500);
  }

  render() {
    return (
      <div className='page-Song'>
        <p>{this.state.title}</p>
        <p>{this.state.author}</p>
      </div>
    );
  }
}

export default Song;
