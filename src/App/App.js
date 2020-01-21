import React from 'react';
import './App.scss';
import firebase from 'firebase/app';
import 'firebase/auth';
import authData from '../helpers/data/authData';
import Auth from '../components/pages/Auth/Auth';

authData.firebaseApp();

class App extends React.Component {
  state = {
    authed: false,
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  render() {
    const { authed } = this.state;
    return (
      <div className="App">
        {
          (authed) ? (<h1>Home</h1>) : (<Auth />)
        }
      </div>
    );
  }
}

export default App;
