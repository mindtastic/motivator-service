import express from 'express';
import { checkSchema } from 'express-validator';
// import db from './db';
import db from './db';
import postSchema from './schemas/post_motivator';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Motivator base route');
});

router.post('/', checkSchema(postSchema), ((req, res) => {
  // console.log(req);

  db.models.motivator.create({
    name: req.body.name,
    headline: req.body.headline,
    description: req.body.description,
    MotivatorContents: req.body.content,
  }, {
    include: [db.models.motivatorContent],
  }).then(() => res.send('successful'));
}));

export default router;
