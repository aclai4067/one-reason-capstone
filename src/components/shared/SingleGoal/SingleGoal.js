import './SingleGoal.scss';
import React from 'react';
import moment from 'moment';
import goalShape from '../../../helpers/propz/goalShape';
import feedData from '../../../helpers/data/feedData';

class SingleGoal extends React.Component {
  state = {
    postCount: 0,
  }

  static propTypes = {
    goal: goalShape.goalShape,
  }

  componentDidMount() {
    const { goal } = this.props;
    feedData.getPostsByGoalId(goal.id)
      .then((results) => {
        const reasonsOnly = results.filter((x) => x.post !== 'I Met My Goal:');
        this.setState({ postCount: reasonsOnly.length });
      }).catch((err) => console.error('error from singleGoal componentDidMount', err));
  }

  render() {
    const { goal } = this.props;
    const { postCount } = this.state;

    return (
      <div className='SingleGoal p-3 mb-2'>
        <header className='d-flex justify-content-between flex-wrap'>
          <h4 className='goalHeader'>{goal.name}</h4>
          {
            (goal.isMet) ? (<p className='goalMet'>Met!</p>)
              : (<form><input id='goalCheck' className='goalCheckBox' type='checkbox' /><label className='goalUnchecked pl-2' htmlFor='goalCheck'>Goal Met</label></form>)
          }
        </header>
        <p>Target Date: {moment(goal.targetDate).format('ll')}</p>
        <p>You have posted {postCount} reasons to meet this goal.</p>
      </div>
    );
  }
}

export default SingleGoal;
