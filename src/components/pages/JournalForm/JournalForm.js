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
    journalDate: '',
    userGoals: [],
    titleValid: true,
    bodyValid: true,
  }

  componentDidMount() {
    const uid = authData.getUid();
    const { journalId } = this.props.match.params;
    goalData.getGoalsByUid(uid)
      .then((results) => {
        this.setState({ userGoals: results });
      }).catch((err) => console.error('error from JournalForm componentDidMount goals', err));
    if (journalId) {
      journalData.getJournalById(journalId)
        .then((results) => {
          const entry = results.data;
          this.setState({
            journalTitle: entry.title,
            journalBody: entry.body,
            journalGoalId: entry.goalId,
            journalDate: entry.date,
          });
        }).catch((err2) => console.error('error from JournalForm componentDidMount journal', err2));
    }
  }

  saveJournalEvent = (e) => {
    e.preventDefault();
    const { journalTitle, journalBody } = this.state;
    if (journalTitle.length > 0 && journalBody.length > 0) {
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
    if (journalTitle.length < 1 && journalBody.length < 1) {
      this.setState({ titleValid: false, bodyValid: false });
    }
    if (journalTitle.length < 1) {
      this.setState({ titleValid: false });
    }
    if (journalBody.length < 1) {
      this.setState({ bodyValid: false });
    }
  }

  editJournalEvent = (e) => {
    e.preventDefault();
    const { journalTitle, journalBody } = this.state;
    if (journalTitle.length > 0 && journalBody.length > 0) {
      const uid = authData.getUid();
      const { journalId } = this.props.match.params;
      const journalObj = {
        date: this.state.journalDate,
        title: journalTitle,
        body: journalBody,
        goalId: this.state.journalGoalId,
        uid,
      };
      journalData.changeJournal(journalId, journalObj)
        .then(() => {
          this.props.history.push('/journal');
        }).catch((err) => console.error('error from editJournalEvent', err));
    }
  }

  changeTitle = (e) => {
    e.preventDefault();
    if (e.target.value.length < 1) {
      this.setState({ journalTitle: e.target.value, titleValid: false });
    }
    if (e.target.value.length > 0) {
      this.setState({ journalTitle: e.target.value, titleValid: true });
    }
  }

  changeBody = (e) => {
    e.preventDefault();
    if (e.target.value.length < 1) {
      this.setState({ journalBody: e.target.value, bodyValid: false });
    }
    if (e.target.value.length > 0) {
      this.setState({ journalBody: e.target.value, bodyValid: true });
    }
  }

  changeGoalId = (e) => {
    e.preventDefault();
    this.setState({ journalGoalId: e.target.value });
  }

  flagRequired = () => {
    const { titleValid, bodyValid } = this.state;
    if (!titleValid || !bodyValid) {
      return (<p className='validationError'>Please Complete Required Fields</p>);
    }
    return ('');
  };

  render() {
    const {
      journalTitle,
      journalBody,
      journalGoalId,
      userGoals,
      titleValid,
      bodyValid,
    } = this.state;
    const { journalId } = this.props.match.params;
    const buildGoalDropDown = userGoals.map((goal) => <option key={goal.id} value={goal.id}>{goal.name}</option>);

    return (
      <div className='JournalForm'>
        <h1>Journal Entry Form</h1>
        <form className='col-sm-10 offset-sm-1'>
          <div className='form-group col-sm-8 offset-sm-2'>
            <label htmlFor='journalTitle'>Title</label>
            <input type='text' className={`form-control valid-${titleValid}`} id='journalTitle' value={journalTitle} onChange={this.changeTitle} placeholder='Title for journal entry' />
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
            <textarea className={`form-control journalBody valid-${bodyValid}`} id='journalBody' value={journalBody} onChange={this.changeBody} placeholder='Journal your thoughts. This post will always be private.'>
            </textarea>
          </div>
          {this.flagRequired()}
          {
            (journalId) ? <button className='btn updateJournalBtn' onClick={this.editJournalEvent}>Update</button>
              : <button className='btn saveJournalBtn' onClick={this.saveJournalEvent}>Save</button>
          }
        </form>
      </div>
    );
  }
}

export default JournalForm;
