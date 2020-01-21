import './MyNav.scss';
import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Collapse,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
} from 'reactstrap';
import firebase from 'firebase/app';
import 'firebase/auth';
import PropTypes from 'prop-types';

class MyNav extends React.Component {
  state = {
    isOpen: false,
  }

  static propTypes = {
    authed: PropTypes.bool,
  }

  toggleNav = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }

  logoutEvent = (e) => {
    e.preventDefault();
    firebase.auth().signOut();
  }

  render() {
    const { isOpen } = this.state;
    const { authed } = this.props;
    const buildNavLinks = () => {
      if (authed) {
        return (
          <Nav className='navbar-nav ml-auto'>
            <NavItem>
              <NavLink href='/home'>Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/feed'>Feed</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href='/goals'>Goals</NavLink>
            </NavItem>
            <NavItem>
              <button className='logout btn btn-outline-warning ml-1 my-2 my-sm-0' onClick={this.logoutEvent}>Log Out</button>
            </NavItem>
          </Nav>
        );
      }
      return (
        <Nav className='navbar-nav ml-auto'></Nav>
      );
    };

    return (
      <div className='MyNav'>
        <Navbar className='navbar navbar-expand-lg navbar-light bg-light'>
          <NavbarBrand className='navBrand' href='#'>One Reason</NavbarBrand>
          { (authed) && (<NavbarToggler onClick={this.toggleNav} />) }
          <Collapse isOpen={isOpen} navbar>
              { buildNavLinks() }
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default MyNav;
