import './SingleGoal.scss';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import goalShape from '../../../helpers/propz/goalShape';
import feedData from '../../../helpers/data/feedData';

class SingleGoal extends React.Component {
  state = {
    postCount: 0,
  }

  static propTypes = {
    goal: goalShape.goalShape,
    deleteGoal: PropTypes.func,
  }

  componentDidMount() {
    const { goal } = this.props;
    feedData.getPostsByGoalId(goal.id)
      .then((results) => {
        const reasonsOnly = results.filter((x) => x.post !== 'I Met My Goal:');
        this.setState({ postCount: reasonsOnly.length });
      }).catch((err) => console.error('error from singleGoal componentDidMount', err));
  }

  deleteGoalEvent = (e) => {
    e.preventDefault();
    const { goal, deleteGoal } = this.props;
    deleteGoal(goal.id);
  }

  render() {
    const { goal } = this.props;
    const { postCount } = this.state;

    return (
      <div className='SingleGoal p-3 mb-2'>
        <header className='d-flex justify-content-between flex-wrap'>
          <h4 className='goalHeader'>{goal.name}</h4>
          <div className='d-flex justify-content-end'>
            <button className='deleteGoalBtn btn btn-danger close' onClick={this.deleteGoalEvent}>X</button>
          </div>
        </header>
        <p>Target Date: {moment(goal.targetDate).format('ll')}</p>
        <div className='d-flex justify-content-between flex-wrap'>
          <p>You have posted {postCount} reasons to meet this goal.</p>
          {
            (goal.isMet) ? (<p className='goalMet'>Met!</p>)
              : (<form><input id='goalCheck' className='goalCheckBox' type='checkbox' /><label className='goalUnchecked pl-2' htmlFor='goalCheck'>Goal Met</label></form>)
          }
        </div>
      </div>
    );
  }
}

export default SingleGoal;
