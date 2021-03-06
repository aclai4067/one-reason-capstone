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

const getGoalById = (goalId) => axios.get(`${baseUrl}/goals/${goalId}.json`);

const createGoal = (goalObj) => axios.post(`${baseUrl}/goals.json`, goalObj);

const removeGoal = (goalId) => axios.delete(`${baseUrl}/goals/${goalId}.json`);

const changeGoal = (goalId, goalObj) => axios.put(`${baseUrl}/goals/${goalId}.json`, goalObj);

export default {
  createGoal,
  getGoalsByUid,
  getGoalById,
  removeGoal,
  changeGoal,
};
