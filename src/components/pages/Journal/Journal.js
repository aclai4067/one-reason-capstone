import './Journal.scss';
import React from 'react';
import moment from 'moment';
import journalData from '../../../helpers/data/journalData';
import authData from '../../../helpers/data/authData';
import JournalEntry from '../../shared/JournalEntry/JournalEntry';

class Journal extends React.Component {
  state = {
    allJournalEntries: [],
    selectedJournalEntries: [],
  }

  setJournal = () => {
    const uid = authData.getUid();
    journalData.getJournalByUid(uid)
      .then((results) => {
        const sortJournal = results.sort((a, b) => moment(b.date) - moment(a.date));
        this.setState({ allJournalEntries: sortJournal, selectedJournalEntries: sortJournal });
      }).catch((err) => console.error('error from setJournal', err));
  }

  componentDidMount() {
    this.setJournal();
  }

  deleteEntry = (journalId) => {
    journalData.removeJournalEntry(journalId)
      .then(() => {
        this.setJournal();
      }).catch((err) => console.error('error from deleteEntry', err));
  }

  render() {
    const { selectedJournalEntries } = this.state;
    const buildJournal = selectedJournalEntries.map((entry) => <JournalEntry key={entry.id} entry={entry} deleteEntry={this.deleteEntry} />);
    return (
      <div className='Journal'>
        <h1>Journal</h1>
        { (selectedJournalEntries[0]) ? buildJournal : <h4 className='noEntries mt-3'>You haven't written in your journal yet</h4>}
      </div>
    );
  }
}

export default Journal;
