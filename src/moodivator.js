import axios from 'axios';
import express from 'express';

const moodivatorRouter = express.Router();

moodivatorRouter.get('/', (req, res) => {
  console.log(req, res);

  axios({
    url: '',
    method: 'GET',
    headers: {
      'X-User-Id': '',
    },
  }).then((resp) => console.log(resp));
});

export default moodivatorRouter;
