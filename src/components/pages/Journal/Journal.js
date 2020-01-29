import './Journal.scss';
import React from 'react';
import moment from 'moment';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import journalData from '../../../helpers/data/journalData';
import authData from '../../../helpers/data/authData';
import JournalEntry from '../../shared/JournalEntry/JournalEntry';

class Journal extends React.Component {
  state = {
    allJournalEntries: [],
    selectedJournalEntries: [],
    modalIsOpen: false,
    journalEntryToDelete: '',
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

  toggleModal = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  }

  confirmDelete = (journalId) => {
    this.setState({ journalEntryToDelete: journalId });
    this.toggleModal();
  }

  deleteEntryEvent = (e) => {
    e.preventDefault();
    const { journalEntryToDelete } = this.state;
    journalData.removeJournalEntry(journalEntryToDelete)
      .then(() => {
        this.setJournal();
        this.toggleModal();
      }).catch((err) => console.error('error from deleteEntry', err));
  }

  render() {
    const { selectedJournalEntries, modalIsOpen } = this.state;
    const buildJournal = selectedJournalEntries.map((entry) => <JournalEntry key={entry.id} entry={entry} confirmDelete={this.confirmDelete} />);
    return (
      <div className='Journal'>
        <h1>Journal</h1>
        { (selectedJournalEntries[0]) ? buildJournal : <h4 className='noEntries mt-3'>You haven't written in your journal yet</h4>}
        <div>
          <Modal isOpen={modalIsOpen} toggle={this.toggleModal} className='goalMetModal'>
            <ModalBody>
              <p>Are you sure you want to delete your journal entry?</p>
              <p>This cannot be recovered.</p>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-between'>
              <Button color="danger" onClick={this.deleteEntryEvent}>Delete</Button>{' '}
              <Button color="secondary" onClick={this.toggleModal}>Keep</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Journal;
