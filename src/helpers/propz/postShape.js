import PropTypes from 'prop-types';

const postShape = PropTypes.shape({
  id: PropTypes.string,
  post: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  likes: PropTypes.number.isRequired,
  isAnonymous: PropTypes.bool.isRequired,
  goalId: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
});

export default { postShape };
