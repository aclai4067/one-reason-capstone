import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const getLikesByUid = (uid) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/likes.json?orderBy="uid"&equalTo="${uid}"`)
    .then((response) => {
      const likes = response.data;
      const likesArr = [];
      if (likes !== null) {
        Object.keys(likes).forEach((fbId) => {
          likes[fbId].id = fbId;
          likesArr.push(likes[fbId]);
        });
      }
      resolve(likesArr);
    }).catch((err) => reject(err));
});

const saveLike = (likeObj) => axios.post(`${baseUrl}/likes.json`, likeObj);

const deleteLike = (likeId) => axios.delete(`${baseUrl}/likes/${likeId}.json`);

export default { getLikesByUid, saveLike, deleteLike };
