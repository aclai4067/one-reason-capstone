import PropTypes from 'prop-types';

const goalShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string.isRequired,
  targetDate: PropTypes.string.isRequired,
  isMet: PropTypes.bool.isRequired,
  uid: PropTypes.string.isRequired,
});

export default { goalShape };
