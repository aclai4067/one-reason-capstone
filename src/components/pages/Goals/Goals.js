import './Goals.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import goalData from '../../../helpers/data/goalData';
import authData from '../../../helpers/data/authData';
import SingleGoal from '../../shared/SingleGoal/SingleGoal';

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

  render() {
    const { goals } = this.state;
    const buildGoals = goals.map((goal) => <SingleGoal key={goal.id} goal={goal} />);
    return (
      <div className='Goals'>
        <h1>Goals</h1>
        <Link className='btn btn-outline-dark' to='goals/new'>New Goal</Link>
        { buildGoals }
      </div>
    );
  }
}

export default Goals;
