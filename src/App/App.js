import React from 'react';
import './App.scss';
import firebase from 'firebase/app';
import 'firebase/auth';
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';
import authData from '../helpers/data/authData';
import Auth from '../components/pages/Auth/Auth';
import MyNav from '../components/shared/MyNav/MyNav';
import Home from '../components/pages/Home/Home';
import Feed from '../components/pages/Feed/Feed';
import Goals from '../components/pages/Goals/Goals';
import GoalForm from '../components/pages/GoalForm/GoalForm';
import Profile from '../components/pages/Profile/Profile';
import Journal from '../components/pages/Journal/Journal';
import JournalForm from '../components/pages/JournalForm/JournalForm';

authData.firebaseApp();

const PublicRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = (props) => (authed === false ? <Component {...props} {...rest}/> : <Redirect to={{ pathname: '/', state: { from: props.location } }} />);
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};
const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  const routeChecker = (props) => (authed === true ? <Component {...props} {...rest}/> : <Redirect to={{ pathname: '/auth', state: { from: props.location } }} />);
  return <Route {...rest} render={(props) => routeChecker(props)} />;
};

class App extends React.Component {
  state = {
    authed: false,
    userFound: false,
    modalIsOpen: false,
    theme: 'dark',
  }

  componentDidMount() {
    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ authed: true });
      } else {
        this.setState({ authed: false, userFound: false });
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  toggleModal = () => {
    this.setState({ modalIsOpen: !this.state.modalIsOpen });
  }

  changeTheme = (newTheme) => {
    this.setState({ theme: newTheme });
  }

  setUser = (status) => {
    this.setState({ userFound: status });
  }

  render() {
    const {
      authed,
      userFound,
      modalIsOpen,
      theme,
    } = this.state;
    return (
      <div className={`theme-${theme}`}>
        <div className='App'>
          <Router>
            <MyNav authed={authed} userFound={userFound} />
            <Switch>
              <PublicRoute path='/auth' exact component={Auth} authed={authed} />
              <PrivateRoute path='/' exact component={Home} authed={authed} setUser={this.setUser} toggleModal={this.toggleModal} modalIsOpen={modalIsOpen} changeTheme={this.changeTheme} />
              <PrivateRoute path='/feed' exact component={Feed} authed={authed} />
              <PrivateRoute path='/goals' exact component={Goals} authed={authed} toggleModal={this.toggleModal} modalIsOpen={modalIsOpen} theme={theme} />
              <PrivateRoute path='/goals/new' exact component={GoalForm} authed={authed} />
              <PrivateRoute path='/goals/:goalId/edit' exact component={GoalForm} authed={authed} />
              <PrivateRoute path='/home/:feedId/edit' exact component={Home} authed={authed} toggleModal={this.toggleModal} modalIsOpen={modalIsOpen} theme={theme} />
              <PrivateRoute path='/profile' exact component={Profile} authed={authed} changeTheme={this.changeTheme} />
              <PrivateRoute path='/profile/:profileId/edit' exact component={Profile} authed={authed} changeTheme={this.changeTheme} />
              <PrivateRoute path='/journal' exact component={Journal} authed={authed} toggleModal={this.toggleModal} modalIsOpen={modalIsOpen} theme={theme} />
              <PrivateRoute path='/journal/new' exact component={JournalForm} authed={authed} />
              <PrivateRoute path='/journal/:journalId/edit' exact component={JournalForm} authed={authed} />
            </Switch>
          </Router>
        </div>
      </div>

    );
  }
}

export default App;
