import './SingleGoal.scss';
import React from 'react';
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
        this.setState({ postCount: results.length });
      }).catch((err) => console.error('error from singleGoal componentDidMount', err));
  }

  render() {
    const { goal } = this.props;

    return (
      <div className='SingleGoal'>Goal</div>
    );
  }
}

export default SingleGoal;
