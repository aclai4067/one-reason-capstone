import './Journal.scss';
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import journalData from '../../../helpers/data/journalData';
import authData from '../../../helpers/data/authData';
import JournalEntry from '../../shared/JournalEntry/JournalEntry';
import DeleteModal from '../../shared/DeleteModal/DeleteModal';

class Journal extends React.Component {
  state = {
    allJournalEntries: [],
    selectedJournalEntries: [],
    journalEntryToDelete: '',
  }

  static propTypes = {
    modalIsOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
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

  confirmDelete = (journalId) => {
    this.setState({ journalEntryToDelete: journalId });
    this.props.toggleModal();
  }

  deleteEntryEvent = (e) => {
    e.preventDefault();
    const { journalEntryToDelete } = this.state;
    journalData.removeJournalEntry(journalEntryToDelete)
      .then(() => {
        this.setJournal();
        this.props.toggleModal();
      }).catch((err) => console.error('error from deleteEntry', err));
  }

  render() {
    const { selectedJournalEntries } = this.state;
    const { modalIsOpen, toggleModal } = this.props;
    const buildJournal = selectedJournalEntries.map((entry) => <JournalEntry key={entry.id} entry={entry} confirmDelete={this.confirmDelete} />);
    return (
      <div className='Journal'>
        <h1>Journal</h1>
        <div className='d-flex justify-content-start'>
          <Link to='/journal/new' className='btn journalNew'>New Entry</Link>
        </div>
        { (selectedJournalEntries[0]) ? buildJournal : <h4 className='noEntries mt-3'>You haven't written in your journal yet</h4>}
        <DeleteModal modalIsOpen={modalIsOpen} toggleModal={toggleModal} deleteFunc={this.deleteEntryEvent} />
      </div>
    );
  }
}

export default Journal;
