import './Feed.scss';
import React from 'react';
import moment from 'moment';
import feedData from '../../../helpers/data/feedData';
import Post from '../../shared/Post/Post';
import likesData from '../../../helpers/data/likesData';
import authData from '../../../helpers/data/authData';

class Feed extends React.Component {
  state = {
    feed: [],
    selectedFeed: [],
    likesArr: [],
  }

  setFeed = () => {
    const uid = authData.getUid();
    feedData.getAllPosts()
      .then((entireFeed) => {
        likesData.getLikesByUid(uid)
          .then((likes) => {
            const sortEntireFeed = entireFeed.sort((a, b) => moment(b.date) - moment(a.date));
            this.setState({ feed: sortEntireFeed, selectedFeed: sortEntireFeed, likesArr: likes });
          });
      }).catch((err) => console.error('error from setFeed', err));
  }

  componentDidMount() {
    this.setFeed();
  }

  likePost = (feedId, feedObj) => {
    feedData.changePost(feedId, feedObj)
      .then(() => {
        this.setFeed();
      }).catch((err) => console.error('error from likePost', err));
  }

  render() {
    const { selectedFeed, likesArr } = this.state;
    const buildFeed = selectedFeed.map((post) => <Post key={post.id} post={post} likesArr={likesArr} likePost={this.likePost} />);
    return (
      <div className='Feed'>
        <h1>Inspiration Feed</h1>
        { buildFeed }
      </div>
    );
  }
}

export default Feed;
