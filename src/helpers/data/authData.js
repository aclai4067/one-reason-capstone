import firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from '../apiKeys.json';

const getUid = () => firebase.auth().currentUser.uid;

const firebaseApp = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig.firebaseKeys);
  }
};

export default { firebaseApp, getUid };
