import './Feed.scss';
import React from 'react';
import moment from 'moment';
import feedData from '../../../helpers/data/feedData';
import Post from '../../shared/Post/Post';

class Feed extends React.Component {
  state = {
    feed: [],
    selectedFeed: [],
  }

  setFeed = () => {
    feedData.getAllPosts()
      .then((entireFeed) => {
        const sortEntireFeed = entireFeed.sort((a, b) => moment(b.date) - moment(a.date));
        this.setState({ feed: sortEntireFeed, selectedFeed: sortEntireFeed });
      }).catch((err) => console.error('error from setFeed', err));
  }

  componentDidMount() {
    this.setFeed();
  }

  render() {
    const { selectedFeed } = this.state;
    const buildFeed = selectedFeed.map((post) => <Post key={post.id} post={post} />);
    return (
      <div className='Feed'>
        <h1>Inspiration Feed</h1>
        { buildFeed }
      </div>
    );
  }
}

export default Feed;
