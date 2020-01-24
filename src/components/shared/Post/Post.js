import './Post.scss';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import postShape from '../../../helpers/propz/postShape';
import userData from '../../../helpers/data/userData';
import goalData from '../../../helpers/data/goalData';

class Post extends React.Component {
  state = {
    userName: '',
    goalName: '',
  }

  static propTypes = {
    post: postShape.postShape,
    homeView: PropTypes.bool,
    deletePost: PropTypes.func,
  }

  componentDidMount() {
    const { post } = this.props;
    userData.getUserByUid(post.uid)
      .then((user) => {
        this.setState({ userName: user.name });
        goalData.getGoalById(post.goalId)
          .then((goal) => {
            this.setState({ goalName: goal.data.name });
          });
      }).catch((err) => console.error('error from Post componentDidMount', err));
  }

  deletePostEvent = (e) => {
    e.preventDefault();
    const { post, deletePost } = this.props;
    deletePost(post.id);
  }

  render() {
    const { post, homeView } = this.props;
    const { userName, goalName } = this.state;
    const date = moment(post.date).format('ll');
    const displayName = (post.isAnonymous) ? 'Anonymous' : userName;

    const buildCard = () => {
      if (post.post === 'I Met My Goal:') {
        return (
          <div className='Post p-3 mb-2'>
            <header className='d-flex justify-content-between'>
              <h4 className='postHeader'>{ displayName } posted on {date}</h4>
              {
                (homeView) && (<button className='btn btn-danger close'>X</button>)
              }
            </header>
            <p className='postContentGoalMet'>{post.post} {goalName}!</p>
            <footer className='d-flex justify-content-end'>
              <p className='likesCount'>Celebrated by { (post.likes === 1) ? `${post.likes} person` : `${post.likes} people`}</p>
            </footer>
          </div>
        );
      }
      return (
        <div className='Post p-3 mb-2'>
          <header className='d-flex justify-content-between'>
            <h4 className='postHeader'>{ displayName } posted on {date}</h4>
            {
              (homeView) && (<button className='deletePostBtn btn btn-danger close' onClick={this.deletePostEvent}>X</button>)
            }
          </header>
          <p className='postContent'>{post.post}</p>
          <footer className='d-flex justify-content-between'>
            <p className='relatedGoal'>Related to Goal: {goalName}</p>
            <p className='likesCount'>Loved by { (post.likes === 1) ? `${post.likes} person` : `${post.likes} people`}</p>
          </footer>
        </div>
      );
    };

    return (
      buildCard()
    );
  }
}

export default Post;
