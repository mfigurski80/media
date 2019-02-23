import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import './css/Nav.css';

export default class Nav extends Component {
  render() {
    return (
      <div className="nav">

        <Link to='/'><div className="nav__option" title="Home">
          <i className="fas fa-home"></i>
        </div></Link>
        <div className="nav__option" title="Songs">
          <i className="fas fa-compact-disc"></i>
        </div>
        <div className="nav__option" title="Groups">
          <i className="fas fa-comment-alt"></i>
        </div>

      </div>
    );
  }
}
