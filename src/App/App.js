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
        <Router>
          <MyNav authed={authed} />
          <Switch>
            <PublicRoute path='/auth' exact component={Auth} authed={authed} />
            <PrivateRoute path='/' exact component={Home} authed={authed} />
            <PrivateRoute path='/feed' exact component={Feed} authed={authed} />
            <PrivateRoute path='/goals' exact component={Goals} authed={authed} />
            <PrivateRoute path='/goals/new' exact component={GoalForm} authed={authed} />
            <PrivateRoute path='/goals/:goalId/edit' exact component={GoalForm} authed={authed} />
            <PrivateRoute path='/home/:feedId/edit' exact component={Home} authed={authed} />
            <PrivateRoute path='/profile' exact component={Profile} authed={authed} />
            <PrivateRoute path='/profile/:profileId/edit' exact component={Profile} authed={authed} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
