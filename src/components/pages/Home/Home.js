import './Home.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import userData from '../../../helpers/data/userData';
import authData from '../../../helpers/data/authData';
import goalData from '../../../helpers/data/goalData';
import feedData from '../../../helpers/data/feedData';

class Home extends React.Component {
  state = {
    user: {},
    goalsMet: 0,
    userFeed: [],
    selectedUserFeed: [],
  }

  static propTypes = {
    setUser: PropTypes.func,
  }

  getGoalCount = (uid) => {
    goalData.getGoalsByUid(uid)
      .then((results) => {
        const metGoals = results.filter((x) => x.isMet === true);
        this.setState({ goalsMet: metGoals.length });
      }).catch((err) => console.error('error from getGoalCount', err));
  }

  setUserFeed = (uid) => {
    feedData.getFeedByUid(uid)
      .then((results) => {
        this.setState({ userFeed: results, selectedUserFeed: results });
      }).catch((err) => console.error('error from getUserFeed', err));
  }

  componentDidMount() {
    const uid = authData.getUid();
    userData.getUserByUid(uid)
      .then((existingUser) => {
        if (existingUser) {
          this.setState({ user: existingUser });
          this.props.setUser(true);
          this.getGoalCount(uid);
          this.setUserFeed(uid);
        }
      }).catch((err) => console.error('error getting user by uid from Home', err));
  }

  render() {
    const buildHome = () => {
      const { user, goalsMet } = this.state;
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
          <div className='profileDisplay d-flex justify-content-end'>
            <div className='pt-4'>
              <p>Member Since {user.memberSince}</p>
              <p>{goalsMet} Goals Met</p>
            </div>
            <img className='profilePic' src={user.imageUrl} alt={user.name} />
          </div>
          <h1> Welcome Back, {user.name}!</h1>
          <h2>History</h2>
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
