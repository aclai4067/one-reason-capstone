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
import goalData from '../../../helpers/data/goalData';
import authData from '../../../helpers/data/authData';
import SingleGoal from '../../shared/SingleGoal/SingleGoal';
import feedData from '../../../helpers/data/feedData';

class Goals extends React.Component {
  state = {
    goals: [],
    modalIsOpen: false,
    goalShareIsAnonymous: false,
    goalIdToShare: '',
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

  toggleModal = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
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

  deleteGoal = (goalId) => {
    goalData.removeGoal(goalId)
      .then(() => {
        this.updateGoalIdOnPosts(goalId);
        this.setGoals();
      }).catch((err) => console.error('error from deleteGoal', err));
  }

  metGoal = (goalId, goalObj) => {
    goalData.changeGoal(goalId, goalObj)
      .then(() => {
        this.setState({ goalIdToShare: goalId });
        this.setGoals();
        this.toggleModal();
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
    const { goals, modalIsOpen, goalShareIsAnonymous } = this.state;
    const buildGoals = goals.map((goal) => <SingleGoal key={goal.id} goal={goal} deleteGoal={this.deleteGoal} metGoal={this.metGoal} />);

    return (
      <div className='Goals'>
        <h1>Goals</h1>
        <div className='d-flex justify-content-start'>
          <Link className='newGoalBtn btn btn-outline-secondary' to='goals/new'>New Goal</Link>
        </div>
        { (goals[0]) ? buildGoals : <h4 className='noGoals pt-4'>You haven't set any goals.</h4> }
        <div>
          <Modal isOpen={modalIsOpen} toggle={this.toggleModal} className='goalMetModal'>
            <ModalHeader toggle={this.toggleModal}>You did it!</ModalHeader>
            <ModalBody>
              <h3>Congratulations!</h3>
              <p>Would you like to share the news?</p>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-between'>
              <Button color="warning" onClick={this.saveGoalMetShareEvent}>Share</Button>{' '}
              <div className='form-group d-flex'>
                <input id='anonCheck' className='anonCheckbox' type='checkbox' onChange={this.changeGoalAnon} checked={goalShareIsAnonymous} />
                <label className='anonCheckLabel pl-2' htmlFor='anonCheck'>Anonymous</label>
              </div>
              <Button color="secondary" onClick={this.toggleModal}>No Thanks</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Goals;
