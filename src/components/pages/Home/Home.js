import './Home.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import userData from '../../../helpers/data/userData';
import authData from '../../../helpers/data/authData';

class Home extends React.Component {
  state = {
    user: {},
  }

  componentDidMount() {
    const uid = authData.getUid();
    userData.getUserByUid(uid)
      .then((existingUser) => {
        if (existingUser) {
          this.setState({ user: existingUser });
        }
      }).catch((err) => console.error('error getting user by uid from Home', err));
  }

  render() {
    const profileId = 12345;
    const feedId = 67890;

    return (
      <div className='Home'>
        <h1>Home</h1>
        <Link className='btn btn-outline-dark' to='/profile'>Create Your Profile</Link>
        <Link className='btn btn-outline-info' to={`/profile/${profileId}/edit`}>Edit Profile</Link>
        <Link className='btn btn-outline-info' to={`/home/${feedId}/edit`}>Edit Post</Link>
      </div>
    );
  }
}

export default Home;
