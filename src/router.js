import express from 'express';
// import db from './db';
import Models from './db/models';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Motivator base route');
});

router.post('/', (() => {
  // console.log(req, res);

  Models.definitions.motivator.create({
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
    include: [Models.definitions.motivatorContent],
  });
}));

export default router;
