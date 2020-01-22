import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const createGoal = (goalObj) => axios.post(`${baseUrl}/goals.json`, goalObj);

export default { createGoal };
