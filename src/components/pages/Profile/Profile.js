import './Profile.scss';
import React from 'react';
import authData from '../../../helpers/data/authData';
import userData from '../../../helpers/data/userData';
import goalData from '../../../helpers/data/goalData';

class Profile extends React.Component {
  state = {
    profileName: '',
    profileImage: '',
    firstGoalName: '',
    firstGoalDate: '',
    profile: {},
  }

  componentDidMount() {
    const { profileId } = this.props.match.params;
    if (profileId) {
      userData.getUserById(profileId)
        .then((results) => {
          const user = results.data;
          this.setState({ profile: user, profileName: user.name, profileImage: user.imageUrl });
        }).catch((err) => console.error('error in profile componentDidMount', err));
    }
  }

  saveProfileEvent = (e) => {
    e.preventDefault();
    const uid = authData.getUid();
    const newGoalObj = {
      name: this.state.firstGoalName,
      targetDate: this.state.firstGoalDate,
      isMet: false,
      uid,
    };
    const newUserObj = {
      name: this.state.profileName,
      imageUrl: this.state.profileImage,
      memberSince: new Date(),
      uid,
    };
    userData.createUser(newUserObj)
      .then(() => {
        goalData.createGoal(newGoalObj)
          .then(() => {
            this.props.history.push('/');
          });
      }).catch((err) => console.error('error from saveProfileEvent', err));
  }

  updateProfileEvent = (e) => {
    e.preventDefault();
    const { profileId } = this.props.match.params;
    const updatedProfile = this.state.profile;
    updatedProfile.name = this.state.profileName;
    updatedProfile.imageUrl = this.state.profileImage;
    userData.editProfile(profileId, updatedProfile)
      .then(() => {
        this.props.history.push('/');
      }).catch((err) => console.error('error from updateProfleEvent', err));
  }

  changeName = (e) => {
    e.preventDefault();
    this.setState({ profileName: e.target.value });
  }

  changeImg = (e) => {
    e.preventDefault();
    this.setState({ profileImage: e.target.value });
  }

  changeGoalName = (e) => {
    e.preventDefault();
    this.setState({ firstGoalName: e.target.value });
  }

  changeGoalDate = (e) => {
    e.preventDefault();
    this.setState({ firstGoalDate: e.target.value });
  }

  render() {
    const { profileId } = this.props.match.params;

    return (
      <div className='Profile'>
        <h1>Profile</h1>
        <form className='col-sm-6 offset-sm-3 mt-4'>
          <div className='form-group'>
            <label htmlFor='nameInput'>Your Name</label>
            <input type='text' className='form-control' id='nameInput' value={this.state.profileName} onChange={this.changeName} placeholder='Enter the name you would like others to see' />
          </div>
          <div className='form-group'>
            <label htmlFor='imageInput'>Profile Picture</label>
            <input type='text' className='form-control' id='imageInput' value={this.state.profileImage} onChange={this.changeImg} placeholder='Enter an image url (ending in .jpg, .png, .gif, etc.)' />
          </div>
          { (!profileId) ? (
            <div className='firstGoal'>
              <div className='form-group'>
                <label htmlFor='goalInput'>First Goal</label>
                <input type='text' className='form-control' id='goalInput' value={this.state.firstGoalName} onChange={this.changeGoalName} placeholder='Enter the goal you would like to meet' />
              </div>
              <div className='form-group'>
                <label htmlFor='targetDateInput'>Goal Target Date</label>
                <input type='date' className='form-control' id='targetDateInput' value={this.state.firstGoalDate} onChange={this.changeGoalDate} />
              </div>
              <button className='btn saveProfile' onClick={this.saveProfileEvent}>Save</button>
            </div>
          )
            : (<button className='btn updateProfile' onClick={this.updateProfileEvent}>Update</button>)
          }
        </form>
      </div>
    );
  }
}

export default Profile;
