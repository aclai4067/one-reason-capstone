import './JournalForm.scss';
import React from 'react';
import authData from '../../../helpers/data/authData';
import journalData from '../../../helpers/data/journalData';
import goalData from '../../../helpers/data/goalData';

class JournalForm extends React.Component {
  state = {
    journalTitle: '',
    journalBody: '',
    journalGoalId: 'goal0',
    userGoals: [],
  }

  componentDidMount() {
    const uid = authData.getUid();
    goalData.getGoalsByUid(uid)
      .then((results) => {
        this.setState({ userGoals: results });
      }).catch((err) => console.error('error from JournalForm componentDidMount'));
  }

  saveJournalEvent = (e) => {
    e.preventDefault();
    const uid = authData.getUid();
    const journalObj = {
      date: new Date(),
      title: this.state.journalTitle,
      body: this.state.journalBody,
      goalId: this.state.journalGoalId,
      uid,
    };
    journalData.createJournal(journalObj)
      .then(() => {
        this.props.history.push('/journal');
      }).catch((err) => console.error('error from saveFournalEvent', err));
  }

  changeTitle = (e) => {
    e.preventDefault();
    this.setState({ journalTitle: e.target.value });
  }

  changeBody = (e) => {
    e.preventDefault();
    this.setState({ journalBody: e.target.value });
  }

  changeGoalId = (e) => {
    e.preventDefault();
    this.setState({ journalGoalId: e.target.value });
  }

  render() {
    const {
      journalTitle,
      journalBody,
      journalGoalId,
      userGoals,
    } = this.state;
    const buildGoalDropDown = userGoals.map((goal) => <option key={goal.id} value={goal.id}>{goal.name}</option>);
    return (
      <div className='JournalForm'>
        <h1>Journal Entry Form</h1>
        <form className='col-sm-10 offset-sm-1'>
          <div className='form-group col-sm-8 offset-sm-2'>
            <label htmlFor='journalTitle'>Title</label>
            <input type='text' className='form-control' id='journalTitle' value={journalTitle} onChange={this.changeTitle} placeholder='Title for journal entry' />
          </div>
          <div className='form-group col-sm-8 offset-sm-2'>
            <label htmlFor='journalGoalSelection' className='journalGoalDropdownLabel'>Related Goal</label>
            <select className='form-control' id='journalGoalSelection' onChange={this.changeGoalId} value={journalGoalId}>
              <option value='goal0'>General/Multiple</option>
              {buildGoalDropDown}
            </select>
          </div>
          <div className='form-group'>
            <label htmlFor='journalBody'>Body</label>
            <textarea className='form-control journalBody' id='journalBody' value={journalBody} onChange={this.changeBody} placeholder='Journal your thoughts. This post will always be private.'></textarea>
          </div>
          <button className='btn saveJournalBtn' onClick={this.saveJournalEvent}>Save</button>
        </form>
      </div>
    );
  }
}

export default JournalForm;
