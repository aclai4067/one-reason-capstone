import './Goals.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import PropTypes from 'prop-types';
import goalData from '../../../helpers/data/goalData';
import authData from '../../../helpers/data/authData';
import SingleGoal from '../../shared/SingleGoal/SingleGoal';
import feedData from '../../../helpers/data/feedData';
import DeleteModal from '../../shared/DeleteModal/DeleteModal';
import journalData from '../../../helpers/data/journalData';

class Goals extends React.Component {
  state = {
    goals: [],
    goalModalIsOpen: false,
    goalShareIsAnonymous: false,
    goalIdToShare: '',
    goalEntryToDelete: '',
  }

  static propTypes = {
    modalIsOpen: PropTypes.bool,
    toggleModal: PropTypes.func,
  }

  setGoals = () => {
    const uid = authData.getUid();
    goalData.getGoalsByUid(uid)
      .then((results) => {
        this.setState({ goals: results });
      }).catch((err) => console.error('error from setGoals', err));
  }

  componentDidMount() {
    this.setGoals();
  }

  toggleGoalModal = () => {
    this.setState({ goalModalIsOpen: !this.state.goalModalIsOpen });
  }

  updateGoalIdOnPosts = (goalId) => {
    feedData.getPostsByGoalId(goalId)
      .then((goalPosts) => {
        goalPosts.forEach((post) => {
          const updatedPost = post;
          updatedPost.goalId = 'goal0';
          feedData.changePost(post.id, updatedPost);
        });
      }).catch((err) => console.error('error from updateGoalIdOnPosts', err));
  }

  updateGoalIdOnJournal = (goalId) => {
    journalData.getJournalByGoalId(goalId)
      .then((goalJournal) => {
        goalJournal.forEach((entry) => {
          const updatedEntry = entry;
          updatedEntry.goalId = 'goal0';
          journalData.changeJournal(entry.id, updatedEntry);
        });
      }).catch((err) => console.error('error from updateGoalIdOnPosts', err));
  }

  confirmDeleteGoal = (goalId) => {
    this.setState({ goalEntryToDelete: goalId });
    this.props.toggleModal();
  }

  deleteGoalEvent = (e) => {
    e.preventDefault();
    const { goalEntryToDelete } = this.state;
    goalData.removeGoal(goalEntryToDelete)
      .then(() => {
        this.updateGoalIdOnPosts(goalEntryToDelete);
        this.updateGoalIdOnJournal(goalEntryToDelete);
        this.setGoals();
        this.props.toggleModal();
      }).catch((err) => console.error('error from deleteGoal', err));
  }

  metGoal = (goalId, goalObj) => {
    goalData.changeGoal(goalId, goalObj)
      .then(() => {
        this.setState({ goalIdToShare: goalId });
        this.setGoals();
        this.toggleGoalModal();
      }).catch((err) => console.error('error from metGoal', err));
  }

  changeGoalAnon = (e) => {
    this.setState({ goalShareIsAnonymous: e.target.checked });
  }

  saveGoalMetShareEvent = (e) => {
    e.preventDefault();
    const uid = authData.getUid();
    const goalMetPost = {
      post: 'I Met My Goal:',
      date: new Date(),
      likes: 0,
      isAnonymous: this.state.goalShareIsAnonymous,
      goalId: this.state.goalIdToShare,
      uid,
    };
    feedData.createPost(goalMetPost)
      .then(() => {
        this.props.history.push('/feed');
      }).catch((err) => console.error('error from saveGoalMetShareEvent', err));
  }

  render() {
    const { goals, goalModalIsOpen, goalShareIsAnonymous } = this.state;
    const { modalIsOpen, toggleModal } = this.props;
    const buildGoals = goals.map((goal) => <SingleGoal key={goal.id} goal={goal} confirmDeleteGoal={this.confirmDeleteGoal} metGoal={this.metGoal} />);

    return (
      <div className='Goals'>
        <h1>Goals</h1>
        <div className='d-flex justify-content-start'>
          <Link className='newGoalBtn btn' to='goals/new'>New Goal</Link>
        </div>
        { (goals[0]) ? buildGoals : <h4 className='noGoals pt-4'>You haven't set any goals.</h4> }
        <div>
          <Modal isOpen={goalModalIsOpen} toggle={this.toggleGoalModal} modalClassName='goalModal' className='goalMetModal'>
            <ModalHeader toggle={this.toggleGoalModal}>You did it!</ModalHeader>
            <ModalBody>
              <h3>Congratulations!</h3>
              <p>Would you like to share the news?</p>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-between'>
              <Button className='shareGoalMet' onClick={this.saveGoalMetShareEvent}>Share</Button>{' '}
              <div className='form-group d-flex'>
                <input id='anonCheck' className='anonCheckbox' type='checkbox' onChange={this.changeGoalAnon} checked={goalShareIsAnonymous} />
                <label className='anonCheckLabel pl-2' htmlFor='anonCheck'>Anonymous</label>
              </div>
              <Button className='dismissGoalModal' onClick={this.toggleGoalModal}>No Thanks</Button>
            </ModalFooter>
          </Modal>
        </div>
        <DeleteModal modalIsOpen={modalIsOpen} toggleModal={toggleModal} deleteFunc={this.deleteGoalEvent} />
      </div>
    );
  }
}

export default Goals;
