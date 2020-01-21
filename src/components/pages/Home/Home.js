import './Home.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import userData from '../../../helpers/data/userData';
import authData from '../../../helpers/data/authData';

class Home extends React.Component {
  state = {
    user: {},
  }

  componentDidMount() {
    const uid = authData.getUid();
    userData.getUserByUid(uid)
      .then((existingUser) => {
        if (existingUser) {
          this.setState({ user: existingUser });
        }
      }).catch((err) => console.error('error getting user by uid from Home', err));
  }

  render() {
    const buildHome = () => {
      const { user } = this.state;
      if (!user.id) {
        return (
          <div className='newUserHome'>
            <h1 className='m-4'>Welcome to <span className='brand'>One Reason</span>!</h1>
            <p>We are so excited to help you get started with your goals!</p>
            <p>First things first. Please, tell us a little about yourself.</p>
            <Link to='/profile' className='btn profileBtn mt-4'>Create Your Profile</Link>
          </div>
        );
      }
      return (
        <div className='currentUserHome'>
          <h1> Welcome, {user.name}!</h1>
        </div>
      );
    };

    return (
      <div className='Home'>
        { buildHome() }
      </div>
    );
  }
}

export default Home;
