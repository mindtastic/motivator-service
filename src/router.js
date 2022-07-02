import express from 'express';
// import db from './db';
import db from './db';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Motivator base route');
});

router.post('/', ((req, res) => {
  // console.log(req);

  db.models.motivator.create({
    name: 'Test Motivator',
    headline: 'Motivator for creating code tests',
    description: 'Heal your mind by testing your code',
    MotivatorContents: [{
      ordering: 0,
      content: JSON.stringify({ whatever: 'idc' }),
    },
    {
      ordering: 1,
      content: JSON.stringify({ whatever: 'idk' }),
    }],
  }, {
    include: [db.models.motivatorContent],
  }).then(() => res.send('successful'));
}));

export default router;
