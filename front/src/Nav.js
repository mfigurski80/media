import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import { resetNotifications } from './redux/actions/postActions';

import './css/Nav.css';


class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isNotificationOpen: false,
      isProfileOpen: false
    }

    this.toggleNotification = this.toggleNotification.bind(this);
    this.toggleProfile = this.toggleProfile.bind(this);
  }

  render() {

    var windowElem;
    if (this.state.isNotificationOpen) {
      windowElem = (
        <div className="nav__side">
          <div className="nav__side__top">
            <p>Notifications:</p>
            <i className="nav__side__top__exit fas fa-times" onClick={this.toggleNotification}></i>
          </div>

          {this.props.notifications.length === 0 ? (
            <div className="nav__side__notification">
              <p>No new notifications</p>
            </div>
          ) : this.props.notifications.map((note, index) => (
            <div className="nav__side__notification" key={index}>
              <p>{note.message}</p>
            </div>
          ))}
        </div>
      );
    }

    return (
      <nav className="nav">

        <div className="nav__top">
          <Link to="/"><i className="fas fa-home"></i></Link>
          <Link to="/add"><i className="fas fa-plus"></i></Link>
        </div>

        <div className="nav__bottom">
          <i className="fas fa-bell" onClick={this.toggleNotification}></i>
          <img className="nav__bottom__profile" onClick={this.toggleProfile} src="./resources/profile.jpg" alt="profile-img"></img>
        </div>

        {windowElem}

      </nav>
    );
  }


  /* ****
  Custom functions
  **** */

  toggleNotification(e) {
    e.preventDefault();

    if (this.state.isNotificationOpen) { // if being asked to close notifications...
      this.props.resetNotifications(); // redux must reset notifications
    }

    this.setState({
      isNotificationOpen: !this.state.isNotificationOpen,
      isProfileOpen: false
    });
  }

  toggleProfile(e) {
    e.preventDefault();
    this.setState({
      isProfileOpen: !this.state.isProfileOpen,
      isNotificationOpen: false
    });
  }
}



// redux port
const mapStateToProps = (state) => ({
  notifications: state.notifications
});
export default connect(mapStateToProps, { resetNotifications })(Nav);
