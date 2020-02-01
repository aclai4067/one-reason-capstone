import './ReasonForm.scss';
import React from 'react';
import PropTypes from 'prop-types';
import authData from '../../../helpers/data/authData';
import goalShape from '../../../helpers/propz/goalShape';

class ReasonForm extends React.Component {
  state = {
    postMessage: '',
    postGoalId: '',
    postIsAnonymous: false,
    postDate: '',
    postLikes: 0,
    reasonValid: true,
  }

  static propTypes = {
    goals: PropTypes.arrayOf(goalShape.goalShape),
    savePost: PropTypes.func,
    editPost: PropTypes.func,
    feedId: PropTypes.string,
  }

  componentDidUpdate(prevProps) {
    const { userFeed, feedId } = this.props;
    if ((prevProps.feedId !== this.props.feedId) && feedId) {
      const postToEdit = userFeed.find((post) => post.id === feedId);
      this.setState({
        postMessage: postToEdit.post,
        postGoalId: postToEdit.goalId,
        postIsAnonymous: postToEdit.isAnonymous,
        postDate: postToEdit.date,
        postLikes: postToEdit.likes,
        reasonValid: true,
      });
    }
  }

  savePostEvent = (e) => {
    e.preventDefault();
    if (this.state.postMessage.length > 0) {
      const uid = authData.getUid();
      const newReason = {
        post: this.state.postMessage,
        date: new Date(),
        likes: 0,
        isAnonymous: this.state.postIsAnonymous,
        goalId: this.state.postGoalId,
        uid,
      };
      this.props.savePost(uid, newReason);
      this.setState({
        postMessage: '',
        postIsAnonymous: false,
        postGoalId: '',
        postDate: '',
        postLikes: 0,
      });
    }
    if (this.state.postMessage.length < 1) {
      this.setState({ reasonValid: false });
    }
  }

  updatePostEvent = (e) => {
    e.preventDefault();
    if (this.state.postMessage.length > 0) {
      const uid = authData.getUid();
      const { feedId, editPost } = this.props;
      const updatedReason = {
        post: this.state.postMessage,
        date: this.state.postDate,
        likes: this.state.postLikes,
        isAnonymous: this.state.postIsAnonymous,
        goalId: this.state.postGoalId,
        uid,
      };
      editPost(feedId, updatedReason);
      this.setState({ postMessage: '', postIsAnonymous: false, postGoalId: '' });
    }
    if (this.state.postMessage.length < 1) {
      this.setState({ reasonValid: false });
    }
  }

  changePost = (e) => {
    e.preventDefault();
    this.setState({ postMessage: e.target.value });
    if (e.target.value.length > 0) {
      this.setState({ reasonValid: true });
    }
  }

  changeGoalRelation = (e) => {
    e.preventDefault();
    this.setState({ postGoalId: e.target.value });
  }

  changeAnon= (e) => {
    this.setState({ postIsAnonymous: e.target.checked });
  }

  flagRequired = () => {
    const { reasonValid } = this.state;
    if (!reasonValid) {
      return (<p className='validationError'>Please Enter Your Reason</p>);
    }
    return ('');
  };

  render() {
    const { goals, feedId } = this.props;
    const {
      postMessage,
      postGoalId,
      postIsAnonymous,
      reasonValid,
    } = this.state;
    const buildGoalDropDown = goals.map((goal) => <option key={goal.id} value={goal.id}>{goal.name}</option>);
    return (
      <form className='ReasonForm'>
        <div className='d-flex'>
        <input type='text' className={`reasonTextbox col-9 valid-${reasonValid}`} placeholder='I want to reach this goal because...' onChange={this.changePost} value={postMessage} />
        {
          (feedId) ? <button className='btn updateReasonBtn col-sm-2 ml-sm-4' onClick={this.updatePostEvent}>Update</button>
            : <button className='btn postReasonBtn col-sm-2 ml-sm-4' onClick={this.savePostEvent}>Post</button>
        }
        </div>
        <div className='d-flex col-sm-8 offset-1 mt-1 justify-content-between flex-wrap'>
          <div className='form-group d-flex'>
            <input id='anonymousCheck' className='anonymousCheckbox' type='checkbox' onChange={this.changeAnon} checked={postIsAnonymous} />
            <label className='anonymousCheckLabel pl-2' htmlFor='anonymousCheck'>Anonymous</label>
          </div>
          <div className='form-group d-flex'>
            <label htmlFor='goalSelection' className='goalDropdownLabel'>Related Goal</label>
            <select className='form-control' id='goalSelection' onChange={this.changeGoalRelation} value={postGoalId}>
              <option value='goal0'>General/Multiple</option>
              {buildGoalDropDown}
            </select>
          </div>
        </div>
        {this.flagRequired()}
      </form>
    );
  }
}

export default ReasonForm;
