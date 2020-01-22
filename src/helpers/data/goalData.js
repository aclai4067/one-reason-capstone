import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const getGoalsByUid = (uid) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/goals.json?orderBy="uid"&equalTo="${uid}"`)
    .then((response) => {
      const goals = response.data;
      const goalArr = [];
      if (goals !== null) {
        Object.keys(goals).forEach((fbId) => {
          goals[fbId].id = fbId;
          goalArr.push(goals[fbId]);
        });
      }
      resolve(goalArr);
    }).catch((err) => reject(err));
});

const createGoal = (goalObj) => axios.post(`${baseUrl}/goals.json`, goalObj);

export default { createGoal, getGoalsByUid };
