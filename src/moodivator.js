import axios from 'axios';
import express from 'express';
import log from "loglevel";

const moodivatorRouter = express.Router();

moodivatorRouter.get('/', (req, res) => {
  axios({
    url: 'https://mood-diary.mood-diary.svc.cluster.local:80/diary',
    method: 'GET',
    headers: {
      "X-User-Id": "",
    }
  }).then((resp) => {
    log.info('\x1b[32m', '[GET /moodivator]', 'Reponse Status:', resp.status, '\x1b[0m');
    res.status(200).end();
  });
});

export default moodivatorRouter;
