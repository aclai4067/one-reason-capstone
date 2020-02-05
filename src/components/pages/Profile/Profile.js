import './Profile.scss';
import React from 'react';
import PropTypes from 'prop-types';
import authData from '../../../helpers/data/authData';
import userData from '../../../helpers/data/userData';
import goalData from '../../../helpers/data/goalData';

class Profile extends React.Component {
  state = {
    profileName: '',
    profileImage: '',
    profileTheme: '',
    firstGoalName: '',
    firstGoalDate: '',
    profile: {},
    nameValid: true,
    goalValid: true,
    dateValid: true,
  }

  static propTypes = {
    changeTheme: PropTypes.func,
  }

  componentDidMount() {
    const { profileId } = this.props.match.params;
    if (profileId) {
      userData.getUserById(profileId)
        .then((results) => {
          const user = results.data;
          this.setState({
            profile: user,
            profileName: user.name,
            profileImage: user.imageUrl,
            profileTheme: user.theme,
          });
        }).catch((err) => console.error('error in profile componentDidMount', err));
    }
  }

  saveProfileEvent = (e) => {
    e.preventDefault();
    const avatar = (this.state.profileImage.length < 1) ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
      : this.state.profileImage;
    const {
      profileName,
      profileTheme,
      firstGoalName,
      firstGoalDate,
    } = this.state;
    if (profileName.length > 0 && firstGoalName.length > 0 && firstGoalDate.length > 0) {
      const uid = authData.getUid();
      const newGoalObj = {
        name: firstGoalName,
        targetDate: firstGoalDate,
        isMet: false,
        uid,
      };
      const newUserObj = {
        name: profileName,
        imageUrl: avatar,
        memberSince: new Date(),
        theme: profileTheme,
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
    if (profileName.length < 1 && firstGoalName.length < 1 && firstGoalDate.length < 1) {
      this.setState({ nameValid: false, goalValid: false, dateValid: false });
    }
    if (profileName.length < 1 && firstGoalName.length < 1) {
      this.setState({ nameValid: false, goalValid: false });
    }
    if (profileName.length < 1 && firstGoalDate.length < 1) {
      this.setState({ nameValid: false, dateValid: false });
    }
    if (firstGoalName.length < 1 && firstGoalDate.length < 1) {
      this.setState({ goalValid: false, dateValid: false });
    }
    if (profileName.length < 1) {
      this.setState({ nameValid: false });
    }
    if (firstGoalName.length < 1) {
      this.setState({ goalValid: false });
    }
    if (firstGoalDate.length < 1) {
      this.setState({ dateValid: false });
    }
  }

  updateProfileEvent = (e) => {
    e.preventDefault();
    const avatar = (this.state.profileImage.length < 1) ? 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png'
      : this.state.profileImage;
    const { profileName, profileTheme } = this.state;
    if (profileName.length > 0) {
      const { profileId } = this.props.match.params;
      const updatedProfile = this.state.profile;
      updatedProfile.name = profileName;
      updatedProfile.imageUrl = avatar;
      updatedProfile.theme = profileTheme;
      userData.editProfile(profileId, updatedProfile)
        .then(() => {
          this.props.history.push('/');
        }).catch((err) => console.error('error from updateProfleEvent', err));
    }
  }

  changeName = (e) => {
    e.preventDefault();
    if (e.target.value.length < 1) {
      this.setState({ profileName: e.target.value, nameValid: false });
    }
    if (e.target.value.length > 0) {
      this.setState({ profileName: e.target.value, nameValid: true });
    }
  }

  changeImg = (e) => {
    e.preventDefault();
    this.setState({ profileImage: e.target.value });
  }

  changeGoalName = (e) => {
    e.preventDefault();
    if (e.target.value.length < 1) {
      this.setState({ firstGoalName: e.target.value, goalValid: false });
    }
    if (e.target.value.length > 0) {
      this.setState({ firstGoalName: e.target.value, goalValid: true });
    }
  }

  changeGoalDate = (e) => {
    e.preventDefault();
    if (e.target.value.length < 1) {
      this.setState({ firstGoalDate: e.target.value, dateValid: false });
    }
    if (e.target.value.length > 0) {
      this.setState({ firstGoalDate: e.target.value, dateValid: true });
    }
  }

  changeTheme = (e) => {
    e.preventDefault();
    const { changeTheme } = this.props;
    this.setState({ profileTheme: e.target.value });
    changeTheme(e.target.value);
  }

  flagRequired = () => {
    const { nameValid, goalValid, dateValid } = this.state;
    if (!nameValid || !goalValid || !dateValid) {
      return (<p className='validationError'>Please Complete Required Fields</p>);
    }
    return ('');
  };

  render() {
    const { profileId } = this.props.match.params;
    const {
      profileName,
      profileTheme,
      profileImage,
      firstGoalName,
      firstGoalDate,
      nameValid,
      goalValid,
      dateValid,
    } = this.state;

    return (
      <div className='Profile'>
        <h1>Profile</h1>
        <form className='col-sm-6 offset-sm-3 mt-4'>
          <div className='form-group'>
            <label htmlFor='nameInput'>Your Name</label>
            <input type='text' className={`form-control valid-${nameValid}`} id='nameInput' value={profileName} onChange={this.changeName} placeholder='Enter the name you would like others to see' />
          </div>
          <div className='form-group'>
            <label htmlFor='imageInput'>Profile Picture</label>
            <input type='text' className='form-control' id='imageInput' value={profileImage} onChange={this.changeImg} placeholder='Enter an image url (ending in .jpg, .png, .gif, etc.)' />
          </div>
          <div className='form-group'>
            <label htmlFor='themeSelection' className='themeDropdownLabel'>Theme</label>
            <select className='form-control' id='themeSelection' onChange={this.changeTheme} value={profileTheme}>
              <option value='default'>Default/Light Theme</option>
              <option value='dark'>Dark Theme</option>
              <option value='neutral'>Neutral Theme</option>
            </select>
          </div>
          { (!profileId) ? (
            <div className='firstGoal'>
              <div className='form-group'>
                <label htmlFor='glInpt'>First Goal</label>
                <input type='text' className={`form-control valid-${goalValid}`} id='glInpt' value={firstGoalName} onChange={this.changeGoalName} placeholder='Enter the goal you would like to meet' />
              </div>
              <div className='form-group'>
                <label htmlFor='targetDateInput'>Goal Target Date</label>
                <input type='date' className={`form-control valid-${dateValid}`} id='targetDateInput' value={firstGoalDate} onChange={this.changeGoalDate} />
              </div>
              <button className='btn saveProfile' onClick={this.saveProfileEvent}>Save</button>
            </div>
          )
            : (<button className='btn updateProfile' onClick={this.updateProfileEvent}>Update</button>)
          }
          {this.flagRequired()}
        </form>
      </div>
    );
  }
}

export default Profile;
