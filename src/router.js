import express from 'express';
import { checkSchema } from 'express-validator';
import db from './db';
import postSchema from './validation/schema_postMotivator';
import { formatMotivator } from './db/util';

const router = express.Router();

router.get('/', (req, res) => {
  db.models.motivator.findAll({
    include: [
      {
        model: db.models.motivatorContent,
      },
      {
        model: db.models.motivatorInput,
      },
    ],
  }).then((query) => {
    const response = query.map((item) => item.toJSON())
      .map((item) => formatMotivator(item));
    res.send(response);
  }).catch((error) => {
    res.status(500).send(error);
  });
});

router.post('/', checkSchema(postSchema), ((req, res) => {
  let inputs = [];

  if (req.body.inputs) inputs = req.body.inputs;

  db.models.motivator.create({
    name: req.body.name,
    headline: req.body.headline,
    description: req.body.description,
    MotivatorContents: req.body.content,
    MotivatorInputs: inputs,
  }, {
    include: [db.models.motivatorContent, db.models.motivatorInput],
  }).then((motivator) => res.status(200).send(motivator))
    .catch((error) => res.status(500).send(error));
}));

export default router;
