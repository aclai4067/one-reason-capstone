import './Auth.scss';
import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import googleLogo from './googCircleIcon.png';

class Auth extends React.Component {
  loginEvent = (e) => {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  render() {
    return (
      <div className='Auth'>
        <button className='btn btn-light mt-4' onClick={this.loginEvent}><img src={googleLogo} className='googleIcon m-2' alt='google icon' />Sign in With Google</button>
      </div>
    );
  }
}

export default Auth;
