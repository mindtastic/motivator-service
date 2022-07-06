import express from 'express';
import { checkSchema } from 'express-validator';
import { resetLevel } from 'loglevel';
import db from './db';
import motivator from './db/models/motivator';
import postSchemaMotivator from './validation/schema_postMotivator';
import postSchemaResult from './validation/schema_postMotivatorResult';

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

router.post('/', checkSchema(postSchemaMotivator), ((req, res) => {
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

router.post('/:motivator_id/result/', checkSchema(postSchemaResult), ((req, res) => {
  var newResultInput = { value: req.body.value }
  db.models.motivatorResult.create({
    timestamp: req.body.timestamp,
    feedback: req.body.feedback.rating,
    status: req.body.status,
    motivator_id: req.params.motivator_id,
    user_id: req.user.uid,
    // create new motivatorResultInput
    MotivatorResultInputs: newResultInput
  }, {
    include: [db.models.motivatorResultInput]
  }).then((result) => res.status(200).send(result))
    .catch((error) => res.status(500).send(error));
}));

router.delete('/:motivator_id/result/', ((req, res) => {
  // check if motivator with ID exists
  db.models.motivator.count({ 
    where: { 
      id: req.params.motivator_id 
    }
  }).then((number) => {
    if (number == 0) {
      res.status(404).end();
    }
  }).catch((err) => res.status(500).send(err));

  // search for result to get it's ID
  db.models.motivatorResult.findOne({
    where: { 
      motivator_id: req.params.motivator_id,
      user_id: req.user.uid
    }
  }).then((foundResult) => {

    // 1. delete motivator result input
    db.models.motivatorResultInput.destroy({
      where: {
        motivator_result_id: foundResult.id
      }
    }).then((numberResultInput) => {

      if (numberResultInput > 0) {
        // 2. delete motivator result
        db.models.motivatorResult.destroy({
          where: {
            id: foundResult.id
          }
        }).then((numberResult) => {
          
          if (numberResult > 0) {
            res.status(204).end();
          } else {
            res.status(500).send("Could not delete result");
          } 
        }).catch((err) => res.status(500).send(err));
      } else {
        res.status(500).send("Could not delete result inputs");
      }
    }).catch((err) => res.status(500).send(err));
  }).catch((err) => res.status(500).send(err));
}));

export default router;
