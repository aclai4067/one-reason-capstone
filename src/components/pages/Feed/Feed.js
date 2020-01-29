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
    filterValue: 'all',
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

  toggleLikedPostDisplayEvent = (e) => {
    e.preventDefault();
    this.setState({ filterValue: e.target.value });
    const { likesArr, feed } = this.state;
    if (e.target.value === 'liked') {
      const userLikes = [];
      likesArr.forEach((like) => {
        const likedPost = feed.find((x) => x.id === like.feedId);
        userLikes.push(likedPost);
      });
      const sortLikedFeed = userLikes.sort((a, b) => moment(b.date) - moment(a.date));
      this.setState({ selectedFeed: sortLikedFeed });
    }
    if (e.target.value === 'all') {
      this.setState({ selectedFeed: feed });
    }
  }

  likePost = (feedId, feedObj) => {
    feedData.changePost(feedId, feedObj)
      .then(() => {
        this.setFeed();
        this.setState({ filterValue: 'all' });
      }).catch((err) => console.error('error from likePost', err));
  }

  render() {
    const { selectedFeed, likesArr, filterValue } = this.state;
    const buildFeed = selectedFeed.map((post) => <Post key={post.id} post={post} likesArr={likesArr} likePost={this.likePost} />);
    return (
      <div className='Feed'>
        <h1>Inspiration Feed</h1>
        <select className='feedFilter' id='filterFeedByLikes' onChange={this.toggleLikedPostDisplayEvent} value={filterValue}>
          <option value='all'>View All</option>
          <option value='liked'>See Liked Posts</option>
        </select>
        { buildFeed }
      </div>
    );
  }
}

export default Feed;
