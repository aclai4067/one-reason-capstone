import './GoalForm.scss';
import React from 'react';
import goalData from '../../../helpers/data/goalData';
import authData from '../../../helpers/data/authData';

class GoalForm extends React.Component {
  state = {
    goalName: '',
    goalTargetDate: '',
    goalIsMet: false,
    goalValid: true,
    dateValid: true,
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
    const { goalName, goalTargetDate } = this.state;
    if (goalName.length > 0 && goalTargetDate.length > 0) {
      const uid = authData.getUid();
      const newGoal = {
        name: goalName,
        targetDate: goalTargetDate,
        isMet: false,
        uid,
      };
      goalData.createGoal(newGoal)
        .then(() => {
          this.props.history.push('/goals');
        }).catch((err) => console.error('error in saveGoalEvent', err));
      }
      if (goalName.length < 1 && goalTargetDate.length < 1) {
        this.setState({ goalValid: false, dateValid: false });
      }
      if (goalName.length < 1) {
        this.setState({ goalValid: false });
      }
      if (goalTargetDate.length < 1) {
        this.setState({ dateValid: false });
      }
  }

  editGoalEvent = (e) => {
    e.preventDefault(e);
    const { goalName, goalTargetDate } = this.state;
    if (goalName.length > 0 && goalTargetDate.length > 0) {
      const { goalId } = this.props.match.params;
      const uid = authData.getUid();
      const updatedGoal = {
        name: goalName,
        targetDate: goalTargetDate,
        isMet: this.state.goalIsMet,
        uid,
      };
      goalData.changeGoal(goalId, updatedGoal)
        .then(() => {
          this.props.history.push('/goals');
        }).catch((err) => console.error('error from editGoalEvent', err));
    }
  }

  changeGoalName = (e) => {
    e.preventDefault();
    if (e.target.value.length < 1) {
      this.setState({ goalName: e.target.value, goalValid: false });
    }
    if (e.target.value.length > 0) {
      this.setState({ goalName: e.target.value, goalValid: true });
    }
  }

  changeGoalDate = (e) => {
    e.preventDefault();
    if (e.target.value.length < 1) {
      this.setState({ goalTargetDate: e.target.value, dateValid: false });
    }
    if (e.target.value.length > 0) {
      this.setState({ goalTargetDate: e.target.value, dateValid: true });
    }
  }

  changeGoalIsMet = (e) => {
    this.setState({ goalIsMet: e.target.checked });
  }

  flagRequired = () => {
    const { goalValid, dateValid } = this.state;
    if (!goalValid || !dateValid) {
      return (<p className='validationError'>Please Complete Required Fields</p>);
    }
    return ('');
  };

  render() {
    const {
      goalName,
      goalTargetDate,
      goalIsMet,
      goalValid,
      dateValid
    } = this.state;
    const { goalId } = this.props.match.params;
    const buildEditGoalMet = () => (
      <div>
        <div>
          <input id='goalCheck' className='goalCheckBox' type='checkbox' onChange={this.changeGoalIsMet} checked={goalIsMet} />
          <label className='goalUnchecked pl-2' htmlFor='goalCheck'>Goal Met</label>
        </div>
        <button className='btn updateGoal' onClick={this.editGoalEvent}>Update</button>
      </div>
    );

    return (
      <div className='GoalForm'>
        <h1>Set Your Goals</h1>
        <form className='col-sm-6 offset-sm-3'>
          <div className='form-group'>
            <label htmlFor='goalInput'>Goal</label>
            <input type='text' className={`form-control valid-${goalValid}`} id='goalInput' value={goalName} onChange={this.changeGoalName} placeholder='Enter the goal you would like to meet' />
          </div>
          <div className='form-group'>
            <label htmlFor='targetDateInput'>Goal Target Date</label>
            <input type='date' className={`form-control valid-${dateValid}`} id='targetDateInput' value={goalTargetDate} onChange={this.changeGoalDate} />
          </div>
          {
            (goalId) ? buildEditGoalMet() : <button className='btn saveGoal' onClick={this.saveGoalEvent}>Save</button>
          }
          {this.flagRequired()}
        </form>
      </div>
    );
  }
}

export default GoalForm;
