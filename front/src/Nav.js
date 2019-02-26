import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './css/Nav.css';
import './css/NavMenus.css';

export default class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHover: -1,
      navOptions: [
        {
          title: 'Home',
          linksTo: '/',
          iconClass: 'fas fa-home',
          submenu: undefined
        },{
          title: 'Music',
          linksTo: '/music',
          iconClass: 'fas fa-compact-disc',
          submenu: (
            <div className='nav-menu'>
              <Link to='/music'><p>My Music</p></Link>
              <Link to='/music/uploaded'><p>Uploaded</p></Link>
            </div>
          )
        },{
          title: 'Groups',
          linksTo: '/groups',
          // iconClass: 'fas fa-list-alt',
          iconClass: 'fas fa-th-list',
          // iconClass: 'fas fa-bars'
          submenu: (
            <div className='nav-menu'>
              <Link to='/groups/a'><p>Group A</p></Link>
            </div>
          )
        },{
          title: 'Upload',
          linksTo: '/upload',
          iconClass: 'fas fa-plus',
          submenu: undefined
        }
      ]
    }
  }

  render() {

    var asidePos = 0;
    if (this.state.currentHover !== -1) {
      asidePos = document.getElementById('navbar-option__' + this.state.navOptions[this.state.currentHover].title).offsetTop;
    }

    return (
      <div className="nav" onMouseLeave={()=>this.setState({currentHover: -1})}>

        { // render aside...
          (this.state.currentHover === -1)
          ? (
            null
          ) : (
            <div className='nav__aside' style={{transform: `translateY(${asidePos}px)`}}>
              <div className='nav__aside__wrapper'>
                <h4 className='nav__aside__wrapper__head'>{this.state.navOptions[this.state.currentHover].title}</h4>
                {this.state.navOptions[this.state.currentHover].submenu}
              </div>
            </div>
          )
        }

        <div className='nav__bar'>{ // render navOptions...
            this.state.navOptions.map((option, index) => (
              <Link to={option.linksTo} key={index}>
                <div className='nav__bar__option' id={'navbar-option__' + option.title} title={option.title} onMouseEnter={()=>this.setState({currentHover: index})}>
                  <i className={option.iconClass}></i>
                </div>
              </Link>
            ))
        }</div>



      </div>
    );
  }
}
