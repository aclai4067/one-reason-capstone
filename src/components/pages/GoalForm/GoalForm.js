import './GoalForm.scss';
import React from 'react';
import goalData from '../../../helpers/data/goalData';
import authData from '../../../helpers/data/authData';

class GoalForm extends React.Component {
  state = {
    goalName: '',
    goalTargetDate: '',
    goalIsMet: false,
  }

  saveGoalEvent = (e) => {
    e.preventDefault(e);
    const uid = authData.getUid();
    const newGoal = {
      name: this.state.goalName,
      targetDate: this.state.goalTargetDate,
      isMet: false,
      uid,
    };
    goalData.createGoal(newGoal)
      .then(() => {
        this.props.history.push('/goals');
      }).catch((err) => console.error('error in saveGoalEvent', err));
  }

  changeGoalName = (e) => {
    e.preventDefault();
    this.setState({ goalName: e.target.value });
  }

  changeGoalDate = (e) => {
    e.preventDefault();
    this.setState({ goalTargetDate: e.target.value });
  }

  render() {
    return (
      <div className='GoalForm'>
        <h1>Set Your Goals</h1>
        <form className='col-6 offset-3'>
          <div className='form-group'>
            <label htmlFor='goalInput'>Goal</label>
            <input type='text' className='form-control' id='goalInput' value={this.state.goalName} onChange={this.changeGoalName} placeholder='Enter the goal you would like to meet' />
          </div>
          <div className='form-group'>
            <label htmlFor='targetDateInput'>Goal Target Date</label>
            <input type='date' className='form-control' id='targetDateInput' value={this.state.goalTargetDate} onChange={this.changeGoalDate} />
          </div>
          <button className='btn saveGoal' onClick={this.saveGoalEvent}>Save</button>
        </form>
      </div>
    );
  }
}

export default GoalForm;
