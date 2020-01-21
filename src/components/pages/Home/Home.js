import './Home.scss';
import React from 'react';
import { Link } from 'react-router-dom';

class Home extends React.Component {
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
