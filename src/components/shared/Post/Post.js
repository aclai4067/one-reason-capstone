import './Post.scss';
import React from 'react';
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

  render() {
    const { post } = this.props;
    return (
      <div className='Post'>
        <h3>Post</h3>
      </div>
    );
  }
}

export default Post;
