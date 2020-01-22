import PropTypes from 'prop-types';

const userShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  memberSince: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
});

export default { userShape };
