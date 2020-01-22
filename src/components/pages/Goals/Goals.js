import './Goals.scss';
import React from 'react';
import { Link } from 'react-router-dom';

class Goals extends React.Component {
  render() {
    const goalId = 4067;
    return (
      <div className='Goals'>
        <h1>Goals</h1>
        <Link className='btn btn-outline-dark' to='goals/new'>New Goal</Link>
        <Link className='btn btn-outline-info' to={`/goals/${goalId}/edit`}>Edit Goal</Link>
      </div>
    );
  }
}

export default Goals;
