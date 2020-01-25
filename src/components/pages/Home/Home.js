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

class Home extends React.Component {
  state = {
    user: {},
    goalsMet: 0,
    userFeed: [],
    selectedUserFeed: [],
    goals: [],
    postMessage: '',
    postGoalId: '',
    postIsAnonymous: false,
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

  savePostEvent = (e) => {
    e.preventDefault();
    const uid = authData.getUid();
    const newReason = {
      post: this.state.postMessage,
      date: new Date(),
      likes: 0,
      isAnonymous: this.state.postIsAnonymous,
      goalId: this.state.postGoalId,
      uid,
    };
    feedData.createPost(newReason)
      .then(() => {
        this.setUserFeed(uid);
        this.setState({ postMessage: '', postIsAnonymous: false, postGoalId: '' });
      }).catch((err) => console.error('error from savePostEvent', err));
  }

  deletePost = (feedId) => {
    const uid = authData.getUid();
    feedData.removePost(feedId)
      .then(() => {
        this.setUserFeed(uid);
      }).catch((err) => console.error('error from deletePost', err));
  }

  changePost = (e) => {
    e.preventDefault();
    this.setState({ postMessage: e.target.value });
  }

  changeGoalRelation = (e) => {
    e.preventDefault();
    this.setState({ postGoalId: e.target.value });
  }

  changeAnon= (e) => {
    this.setState({ postIsAnonymous: e.target.checked });
  }

  render() {
    const {
      goals,
      postMessage,
      postGoalId,
      postIsAnonymous,
    } = this.state;
    const buildGoalDropDown = goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.name}</option>);
    const buildHome = () => {
      const { user, goalsMet, selectedUserFeed } = this.state;
      const buildFeed = selectedUserFeed.map((post) => <Post key={post.id} post={post} homeView={true} deletePost={this.deletePost} />);
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
          <h2 className='reasonPrompt'>What is one reason you want to work toward your goal today?</h2>
          <form>
            <div className='d-flex'>
             <input type='text' className='reasonTextbox col-9' placeholder='I want to reach this goal because...' onChange={this.changePost} value={postMessage} />
             <button className='btn postReasonBtn col-sm-2 ml-sm-4' onClick={this.savePostEvent}>Post</button>
            </div>
            <div className='d-flex col-sm-8 offset-1 mt-1 justify-content-between flex-wrap'>
              <div className='form-group d-flex'>
                <input id='annoymousCheck' className='annoymousCheckbox' type='checkbox' onChange={this.changeAnon} checked={postIsAnonymous} />
                <label className='annoymousCheckLabel pl-2' htmlFor='annoymousCheck'>Anonymous</label>
              </div>
              <div className='form-group d-flex'>
                <label htmlFor='goalSelection' className='goalDropdownLabel'>Related Goal</label>
                <select className='form-control' id='goalSelection' onChange={this.changeGoalRelation} value={postGoalId}>
                  <option value='goal0'>General/Multiple</option>
                  {buildGoalDropDown}
                </select>
              </div>
            </div>
          </form>
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
