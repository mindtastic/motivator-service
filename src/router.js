import express from 'express';
import { checkSchema } from 'express-validator';
import db from './db';
import postSchema from './validation/schema_postMotivator';

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
      .map((item) => {
        const content = item.MotivatorContents.map((x) => JSON.parse(x.content));
        const inputs = item.MotivatorInputs.map((x) => JSON.parse(x.value));

        /*

        const result = item.MotivatorResults.map(({
          motivator_id, user_id, MotivatorResultInputs, ...resultItem
        }) => ({ ...resultItem }));

        const inputs = item.MotivatorResults[0].MotivatorResultInputs
          .map(({ value }) => ({ ...JSON.parse(value) }));

        return {
          ...item, content, result: result[0], inputs,
        };

        */
        return { ...item, content, inputs };
      })
      .map(({ MotivatorContents, MotivatorInputs, ...itemWithoutContents }) => ({
        ...itemWithoutContents,
      }));
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
