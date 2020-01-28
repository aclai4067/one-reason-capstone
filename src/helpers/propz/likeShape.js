import PropTypes from 'prop-types';

const likeShape = PropTypes.shape({
  id: PropTypes.string,
  uid: PropTypes.string.isRequired,
  feedId: PropTypes.string.isRequired,
});

export default { likeShape };
