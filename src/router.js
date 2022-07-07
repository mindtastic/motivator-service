import express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import db from './db';
import expectedMotivatorFormat from './validation/schema_postMotivator';
import expectedMotivatorResultFormat from './validation/schema_postMotivatorResult';
import { notFoundError, serverError } from './middleware/defaultError';
import findMotivatorResultForUser from './dbHelper';

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

router.post('/', checkSchema(expectedMotivatorFormat), ((req, res) => {
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

router.post('/:motivator_id/result/', checkSchema(expectedMotivatorResultFormat), ((req, res) => {
  // check validation result
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({error: validationErrors.array()});
  }
  
  const newResultInput = { value: req.body.values };
  db.models.motivatorResult.create({
    timestamp: req.body.timestamp,
    feedback: req.body.feedback.rating,
    status: 'completed',
    motivator_id: req.params.motivator_id,
    user_id: req.user.uid,
    // create new motivatorResultInput
    MotivatorResultInputs: newResultInput,
  }, {
    include: [db.models.motivatorResultInput],
  }).then((result) => res.status(201).send({resultId: result.id, status: 'success'}))
    .catch((error) => serverError(res, error.message));
}));

router.delete('/:motivator_id/result/', ((req, res) => {
  try {
    // check if motivator with ID exists
    const counted = await db.models.motivator.count({
      where: {
        id: req.params.motivator_id,
      },
    });

    if (counted === 0) {
      return notFoundError(res, 'motivator');
    }

    // search for motivator result to get it's ID
    const motivatorResult = await findMotivatorResultForUser(req.params.motivator_id, req.user.uid);

    if (motivatorResult === null) {
      return notFoundError(res, 'motivator result');
    }
    
    // 1. delete motivator result input
    const numOfDestroyedRows = await db.models.motivatorResultInput.destroy({
      where: {
        motivator_result_id: motivatorResult.id,
      },
    });

    if (numOfDestroyedRows === 0) {
      return serverError(res, 'Could not delete motivator result inputs');
    }

    // 2. delete motivator result
    await motivatorResult.destroy();

    return res.status(204).end();

  } catch (err) {
    serverError(res, err.message);
  }
}));

export default router;
