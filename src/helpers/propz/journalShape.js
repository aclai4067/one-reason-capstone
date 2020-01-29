import PropTypes from 'prop-types';

const journalShape = PropTypes.shape({
  id: PropTypes.string,
  date: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  goalId: PropTypes.string.isRequired,
  uid: PropTypes.string.isRequired,
});

export default { journalShape };
