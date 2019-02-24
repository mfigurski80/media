import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './css/Nav.css';

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
          open: []
        },{
          title: 'Music',
          linksTo: '/music',
          iconClass: 'fas fa-compact-disc'
        },{
          title: 'Groups',
          linksTo: '/groups',
          // iconClass: 'fas fa-list-alt',
          iconClass: 'fas fa-th-list',
          // iconClass: 'fas fa-bars'
        },{
          title: 'Upload',
          linksTo: '/upload',
          iconClass: 'fas fa-plus'
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

        {
          (this.state.currentHover === -1)
          ? (
            null
          ) : (
            <div className='nav__aside' style={{transform: `translateY(${asidePos}px)`}}>
              <div className='nav__aside__wrapper'>
                <p>{this.state.navOptions[this.state.currentHover].title}</p>
              </div>
            </div>
          )
        }

        <div className='nav__bar'>{
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
