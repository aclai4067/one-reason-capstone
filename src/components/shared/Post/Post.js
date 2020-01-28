import './Post.scss';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faGlassCheers, faHeart } from '@fortawesome/free-solid-svg-icons';
import postShape from '../../../helpers/propz/postShape';
import userData from '../../../helpers/data/userData';
import goalData from '../../../helpers/data/goalData';
import authData from '../../../helpers/data/authData';
import likesData from '../../../helpers/data/likesData';
import likeShape from '../../../helpers/propz/likeShape';

class Post extends React.Component {
  state = {
    userName: '',
    goalName: '',
    liked: false,
    likeId: '',
  }

  static propTypes = {
    post: postShape.postShape,
    homeView: PropTypes.bool,
    deletePost: PropTypes.func,
    likePost: PropTypes.func,
    likesArr: PropTypes.arrayOf(likeShape.likeShape),
  }

  setUserAndGoalNames = () => {
    const { post, likesArr } = this.props;
    userData.getUserByUid(post.uid)
      .then((user) => {
        this.setState({ userName: user.name });
        goalData.getGoalById(post.goalId)
          .then((goal) => {
            this.setState({ goalName: goal.data.name });
            if (likesArr) {
              const findLike = likesArr.find((x) => x.feedId === post.id);
              if (findLike) {
                this.setState({ liked: true, likeId: findLike.id });
              }
            }
          });
      }).catch((err) => console.error('error from Post componentDidMount', err));
  }

  componentDidMount() {
    this.setUserAndGoalNames();
  }

  componentDidUpdate(prevProps) {
    if ((prevProps.post.goalId !== this.props.post.goalId)) {
      this.setUserAndGoalNames();
    }
  }

  deletePostEvent = (e) => {
    e.preventDefault();
    const { post, deletePost } = this.props;
    deletePost(post.id);
  }

  likePostEvent = (e) => {
    e.preventDefault();
    const { post, likePost } = this.props;
    const { liked } = this.state;
    const uid = authData.getUid();
    const postUpdate = post;
    if (!liked) {
      postUpdate.likes += 1;
      const newLike = {
        uid,
        feedId: post.id,
      };
      likesData.saveLike(newLike)
        .then((results) => {
          const likeId = results.data.name;
          this.setState({ likeId, liked: true });
          likePost(post.id, postUpdate);
        }).catch((err) => console.error('error from likePostEvent-liked', err));
    }
    if (liked) {
      postUpdate.likes -= 1;
      const { likeId } = this.state;
      likesData.deleteLike(likeId)
        .then(() => {
          this.setState({ likeId: '', liked: false });
          likePost(post.id, postUpdate);
        }).catch((err) => console.error('error from likePostEvent-unliked', err));
    }
  }

  render() {
    const { post, homeView } = this.props;
    const { userName, goalName, liked } = this.state;
    const date = moment(post.date).format('ll');
    const displayName = (post.isAnonymous) ? 'Anonymous' : userName;

    const buildCard = () => {
      if (post.post === 'I Met My Goal:') {
        return (
          <div className='Post p-3 mb-2'>
            <header className='d-flex justify-content-between'>
              <h4 className='postHeader'>{ displayName } posted on {date}</h4>
              {
                (homeView) ? (
                  <div className='d-flex'>
                    <Link className='editPostBtn btn close p-0' to={`/home/${post.id}/edit`}><FontAwesomeIcon icon={faPencilAlt} /></Link>
                    <button className='deletePostBtn btn close' onClick={this.deletePostEvent}>X</button>
                  </div>
                ) : (<FontAwesomeIcon onClick={this.likePostEvent} className={`liked-${liked} likeBtn cheers`} icon={faGlassCheers} />)
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
              (homeView) ? (
                <div className='d-flex'>
                  <Link className='editPostBtn btn close p-0' to={`/home/${post.id}/edit`}><FontAwesomeIcon icon={faPencilAlt} /></Link>
                  <button className='deletePostBtn btn close' onClick={this.deletePostEvent}>X</button>
                </div>
              ) : (<FontAwesomeIcon onClick={this.likePostEvent} className={`liked-${liked} likeBtn heart`} icon={faHeart} />)
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
