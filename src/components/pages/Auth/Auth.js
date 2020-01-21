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
        <h1 className='m-4'>Welcome to <span className='brand'>One Reason</span>!</h1>
        <p><span className='brand'>One Reason</span> is an application designed to help you acheive your goals through practicing mindfulness.</p>
        <p>The concept is simple.  Just commit to taking the time every day to log one reason why you want to work toward your goal.</p>
        <button className='btn btn-light mt-4' onClick={this.loginEvent}><img src={googleLogo} className='googleIcon m-2' alt='google icon' />Sign in With Google</button>
      </div>
    );
  }
}

export default Auth;
