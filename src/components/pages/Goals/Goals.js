import './Goals.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import goalData from '../../../helpers/data/goalData';
import authData from '../../../helpers/data/authData';
import SingleGoal from '../../shared/SingleGoal/SingleGoal';
import feedData from '../../../helpers/data/feedData';

class Goals extends React.Component {
  state = {
    goals: [],
  }

  setGoals = (uid) => {
    goalData.getGoalsByUid(uid)
      .then((results) => {
        this.setState({ goals: results });
      }).catch((err) => console.error('error from setGoals', err));
  }

  componentDidMount() {
    const uid = authData.getUid();
    this.setGoals(uid);
  }

  updateGoalIdOnPosts = (goalId) => {
    feedData.getPostsByGoalId(goalId)
      .then((goalPosts) => {
        goalPosts.forEach((post) => {
          const updatedPost = post;
          updatedPost.goalId = 'goal0';
          feedData.changePost(post.id, updatedPost);
        });
      }).catch((err) => console.error('error from updateGoalIdOnPosts', err));
  }

  deleteGoal = (goalId) => {
    const uid = authData.getUid();
    goalData.removeGoal(goalId)
      .then(() => {
        this.updateGoalIdOnPosts(goalId);
        this.setGoals(uid);
      }).catch((err) => console.error('error from deleteGoal', err));
  }

  render() {
    const { goals } = this.state;
    const buildGoals = goals.map((goal) => <SingleGoal key={goal.id} goal={goal} deleteGoal={this.deleteGoal} />);
    return (
      <div className='Goals'>
        <h1>Goals</h1>
        <Link className='btn btn-outline-dark' to='goals/new'>New Goal</Link>
        { (goals[0]) ? buildGoals : <h4 className='noGoals pt-4'>You haven't set any goals.</h4> }
      </div>
    );
  }
}

export default Goals;
