import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const getUserByUid = (uid) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/users.json?orderBy="uid"&equalTo="${uid}"`)
    .then((response) => {
      const user = response.data;
      const userArr = [];
      if (user !== null) {
        Object.keys(user).forEach((fbId) => {
          user[fbId].id = fbId;
          userArr.push(user[fbId]);
        });
      }
      resolve(userArr[0]);
    }).catch((err) => reject(err));
});

const createUser = (userObj) => axios.post(`${baseUrl}/users.json`, userObj);

export default { getUserByUid, createUser };
