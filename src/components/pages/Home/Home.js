import './Home.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import userData from '../../../helpers/data/userData';
import authData from '../../../helpers/data/authData';
import goalData from '../../../helpers/data/goalData';
import feedData from '../../../helpers/data/feedData';
import Post from '../../shared/Post/Post';
import ReasonForm from '../../shared/ReasonForm/ReasonForm';

class Home extends React.Component {
  state = {
    user: {},
    goalsMet: 0,
    userFeed: [],
    selectedUserFeed: [],
    goals: [],
  }

  static propTypes = {
    setUser: PropTypes.func,
  }

  getGoalCount = (uid) => {
    goalData.getGoalsByUid(uid)
      .then((results) => {
        const metGoals = results.filter((x) => x.isMet === true);
        this.setState({ goalsMet: metGoals.length, goals: results });
      }).catch((err) => console.error('error from getGoalCount', err));
  }

  setUserFeed = (uid) => {
    feedData.getFeedByUid(uid)
      .then((results) => {
        const sortFeed = results.sort((a, b) => moment(b.date) - moment(a.date));
        this.setState({ userFeed: sortFeed, selectedUserFeed: sortFeed });
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

  savePost = (uid, postObj) => {
    feedData.createPost(postObj)
      .then(() => {
        this.setUserFeed(uid);
      }).catch((err) => console.error('error from savePostEvent', err));
  }

  deletePost = (feedId) => {
    const uid = authData.getUid();
    feedData.removePost(feedId)
      .then(() => {
        this.setUserFeed(uid);
      }).catch((err) => console.error('error from deletePost', err));
  }

  editPost = (feedId, postObj) => {
    const uid = authData.getUid();
    feedData.changePost(feedId, postObj)
      .then(() => {
        this.setUserFeed(uid);
        this.props.history.push('/');
      }).catch((err) => console.error('error from editPost', err));
  }

  render() {
    const { goals, userFeed } = this.state;
    const { feedId } = this.props.match.params;
    const { path } = this.props.computedMatch;
    const buildHome = () => {
      const { user, goalsMet, selectedUserFeed } = this.state;
      const buildFeed = selectedUserFeed.map((post) => <Post key={post.id} post={post} homeView={true} deletePost={this.deletePost} path={path} />);
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
              <p>Member Since {moment(user.memberSince).format('ll')}</p>
              <p>{goalsMet} Goals Met</p>
            </div>
            <img className='profilePic' src={user.imageUrl} alt={user.name} />
          </div>
          <h1> Welcome Back, {user.name}!</h1>
          <h2 className='reasonPrompt'>What is one reason you want to work toward your goal today?</h2>
          <ReasonForm goals={goals} userFeed={userFeed} savePost={this.savePost} editPost={this.editPost} feedId={feedId} />
          <h2 className='historyHeader'>History</h2>
          <div className='historyLog'>
            { (selectedUserFeed[0]) ? buildFeed : <h4 className='noPosts mt-3'>You haven't made any posts yet</h4> }
          </div>
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
