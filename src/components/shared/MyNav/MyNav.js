import './MyNav.scss';
import React from 'react';
import {
  Navbar,
  NavbarBrand,
  Collapse,
  Nav,
  NavItem,
  NavbarToggler,
} from 'reactstrap';
import { Link } from 'react-router-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import PropTypes from 'prop-types';

class MyNav extends React.Component {
  state = {
    isOpen: false,
  }

  static propTypes = {
    authed: PropTypes.bool,
    userFoubd: PropTypes.bool,
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
    const { authed, userFound } = this.props;
    const buildNavLinks = () => {
      if (authed) {
        return (
          <Nav className='navbar-nav ml-auto'>
            <NavItem>
              <Link className='nav-link' to='/'>Home</Link>
            </NavItem>
            {
              (userFound) && (
                <Nav>
                  <NavItem>
                    <Link className='nav-link' to='/feed'>Feed</Link>
                  </NavItem>
                  <NavItem>
                    <Link className='nav-link' to='/goals'>Goals</Link>
                  </NavItem>
                </Nav>
              )
            }
            <NavItem>
              <button className='logout btn btn-outline-secondary ml-1 my-2 my-sm-0' onClick={this.logoutEvent}>Log Out</button>
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
          <NavbarBrand className='navBrand' href='/'>One Reason</NavbarBrand>
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
