import './JournalEntry.scss';
import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import journalShape from '../../../helpers/propz/journalShape';
import goalData from '../../../helpers/data/goalData';

class JournalEntry extends React.Component {
  state = {
    goalName: '',
  }

  static propTypes = {
    entry: journalShape.journalShape,
  }

  componentDidMount() {
    const { entry } = this.props;
    goalData.getGoalById(entry.goalId)
      .then((results) => {
        const goal = results.data;
        this.setState({ goalName: goal.name });
      }).catch((err) => console.error('error from journalEntry componentDidMount', err));
  }

  render() {
    const { entry } = this.props;
    const { goalName } = this.state;

    return (
      <div className='JournalEntry'>
        <header className='d-flex justify-content-between'>
          <h4 className='journalTitle'>{entry.title}</h4>
          <h5 className='journalDate'>{entry.date}</h5>
        </header>
        <div className='d-flex justify-content-end'>
            <Link className='editJournalBtn btn close' to={`/journal/${entry.id}/edit`}><FontAwesomeIcon icon={faPencilAlt} /></Link>
            <button className='deleteJournalBtn btn close'><FontAwesomeIcon icon={faTrashAlt} /></button>
        </div>
        <p className='journalBody'>{entry.body}</p>
        <footer>
          <p className='journalGoal'>Related to Goal: {goalName}</p>
        </footer>
      </div>
    );
  }
}

export default JournalEntry;
