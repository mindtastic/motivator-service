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
        model: db.models.motivatorResult,
        where: {
          user_id: req.user.uid,
        },
        limit: 1,
        include: [
          {
            model: db.models.motivatorResultInput,
          },
        ],
      },
    ],
  }).then((query) => {
    const response = query.map((item) => item.toJSON())
      .map((item) => {
        const content = item.MotivatorContents.map((x) => JSON.parse(x.content));

        const result = item.MotivatorResults.map(({
          motivator_id, user_id, MotivatorResultInputs, ...resultItem
        }) => ({ ...resultItem }));

        const inputs = item.MotivatorResults[0].MotivatorResultInputs
          .map(({ value }) => ({ ...JSON.parse(value) }));

        return {
          ...item, content, result: result[0], inputs,
        };
      })
      .map(({ MotivatorContents, MotivatorResults, ...itemWithoutContents }) => ({
        ...itemWithoutContents,
      }));
    res.send(response);
  }).catch((error) => res.status(500).send(error));
});

router.post('/', checkSchema(postSchema), ((req, res) => {
  db.models.motivator.create({
    name: req.body.name,
    headline: req.body.headline,
    description: req.body.description,
    MotivatorContents: req.body.content,
  }, {
    include: [db.models.motivatorContent],
  }).then((motivator) => res.status(200).send(motivator))
    .catch((error) => res.status(500).send(error));
}));

export default router;
