import axios from 'axios';
import firebaseConfig from '../apiKeys.json';

const baseUrl = firebaseConfig.firebaseKeys.databaseURL;

const getJournalByUid = (uid) => new Promise((resolve, reject) => {
  axios.get(`${baseUrl}/journals.json?orderBy="uid"&equalTo="${uid}"`)
    .then((response) => {
      const journal = response.data;
      const journalArr = [];
      if (journal !== null) {
        Object.keys(journal).forEach((fbId) => {
          journal[fbId].id = fbId;
          journalArr.push(journal[fbId]);
        });
      }
      resolve(journalArr);
    }).catch((err) => reject(err));
});

const removeJournalEntry = (journalId) => axios.delete(`${baseUrl}/journals/${journalId}.json`);

const createJournal = (journalObj) => axios.post(`${baseUrl}/journals.json`, journalObj);

export default { getJournalByUid, removeJournalEntry, createJournal };
