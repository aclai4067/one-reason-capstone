import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const getFeedByUid = (uid) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/feeds.json?orderBy="uid"&equalTo="${uid}"`)
    .then((response) => {
      const feed = response.data;
      const feedArr = [];
      if (feed !== null) {
        Object.keys(feed).forEach((fbId) => {
          feed[fbId].id = fbId;
          feedArr.push(feed[fbId]);
        });
      }
      resolve(feedArr);
    }).catch((err) => reject(err));
});

export default { getFeedByUid };
