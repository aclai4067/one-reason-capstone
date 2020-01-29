import './Journal.scss';
import React from 'react';
import moment from 'moment';
import journalData from '../../../helpers/data/journalData';
import authData from '../../../helpers/data/authData';

class Journal extends React.Component {
  state = {
    journal: [],
  }

  setJournal = () => {
    const uid = authData.getUid();
    journalData.getJournalByUid(uid)
      .then((results) => {
        const sortJournal = results.sort((a, b) => moment(b.date) - moment(a.date));
        this.setState({ journal: sortJournal });
      }).catch((err) => console.error('error from setJournal', err));
  }

  componentDidMount() {
    this.setJournal();
  }

  render() {
    return (
      <div className='Journal'>
        <h1>Journal</h1>
      </div>
    );
  }
}

export default Journal;
