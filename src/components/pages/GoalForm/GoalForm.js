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

  componentDidMount() {
    const { goalId } = this.props.match.params;
    if (goalId) {
      goalData.getGoalById(goalId)
        .then((goal) => {
          const selectedGoal = goal.data;
          this.setState({ goalName: selectedGoal.name, goalTargetDate: selectedGoal.targetDate, goalIsMet: selectedGoal.isMet });
        }).catch((err) => console.error('error from goalForm componentDidMount', err));
    }
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

  editGoalEvent = (e) => {
    e.preventDefault(e);
    const { goalId } = this.props.match.params;
    const uid = authData.getUid();
    const updatedGoal = {
      name: this.state.goalName,
      targetDate: this.state.goalTargetDate,
      isMet: this.state.goalIsMet,
      uid,
    };
    goalData.changeGoal(goalId, updatedGoal)
      .then(() => {
        this.props.history.push('/goals');
      }).catch((err) => console.error('error from editGoalEvent', err));
  }

  changeGoalName = (e) => {
    e.preventDefault();
    this.setState({ goalName: e.target.value });
  }

  changeGoalDate = (e) => {
    e.preventDefault();
    this.setState({ goalTargetDate: e.target.value });
  }

  changeGoalIsMet = (e) => {
    this.setState({ goalIsMet: e.target.checked });
  }

  render() {
    const { goalName, goalTargetDate, goalIsMet } = this.state;
    const { goalId } = this.props.match.params;
    const buildEditGoalMet = () => {
      return (
        <div>
          <div>
            <input id='goalCheck' className='goalCheckBox' type='checkbox' onChange={this.changeGoalIsMet} checked={goalIsMet} />
            <label className='goalUnchecked pl-2' htmlFor='goalCheck'>Goal Met</label>
          </div>
          <button className='btn updateGoal' onClick={this.editGoalEvent}>Update</button>
        </div>
      );
    }

    return (
      <div className='GoalForm'>
        <h1>Set Your Goals</h1>
        <form className='col-sm-6 offset-sm-3'>
          <div className='form-group'>
            <label htmlFor='goalInput'>Goal</label>
            <input type='text' className='form-control' id='goalInput' value={goalName} onChange={this.changeGoalName} placeholder='Enter the goal you would like to meet' />
          </div>
          <div className='form-group'>
            <label htmlFor='targetDateInput'>Goal Target Date</label>
            <input type='date' className='form-control' id='targetDateInput' value={goalTargetDate} onChange={this.changeGoalDate} />
          </div>
          {
            (goalId) ? buildEditGoalMet() : <button className='btn saveGoal' onClick={this.saveGoalEvent}>Save</button>
          }
        </form>
      </div>
    );
  }
}

export default GoalForm;
