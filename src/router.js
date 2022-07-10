import express from 'express';
import { checkSchema, validationResult } from 'express-validator';
import log from 'loglevel';
import db from './db';
import expectedMotivatorFormat from './validation/schema_postMotivator';
import expectedMotivatorResultFormat from './validation/schema_postMotivatorResult';
import motivatorResultsForUser from './dbHelper';
import NotFoundError from './errors/NotFoundError';
import { formatMotivator } from './db/util';
import tilt  from './tilt/tilt_motivator.json' assert { type: 'json' };

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

router.post('/', checkSchema(expectedMotivatorFormat), ((req, res) => {
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
  }).then((motivator) => res.status(200).send(formatMotivator(motivator.toJSON())));
}));

router.post('/:motivator_id/result/', checkSchema(expectedMotivatorResultFormat), async (req, res) => {
  // Check validation results
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(400).json({
      error: validationErrors.array().map((v) => v.msg).join('\n'),
    });
  }

  const newResultInput = { value: req.body.values };
  const created = await db.models.motivatorResult.create({
    timestamp: req.body.timestamp,
    feedback: req.body.feedback.rating,
    status: 'completed',
    motivator_id: req.params.motivator_id,
    user_id: req.user.uid,
    // create new motivatorResultInput
    MotivatorResultInputs: newResultInput,
  }, {
    include: [db.models.motivatorResultInput],
  });

  return res.status(201).send({ resultId: created.id, status: 'success' });
});

router.delete('/:motivator_id/result/', (async (req, res) => {
  // check if motivator with ID exists
  const motivatorExists = await db.models.motivator.count({
    where: { id: req.params.motivator_id },
  });

  if (!motivatorExists) {
    throw new NotFoundError(`Motivator with ${req.params.motivator_id} does not exist`);
  }

  const motivatorResults = await motivatorResultsForUser(req.params.motivator_id, req.user.uid);
  if (!motivatorResults.length) {
    log.warn(`User ${req.user.uid} got no results for motivator ${req.params.motivator_id} stored`);
    return res.status(204).end();
  }

  // Perform deletion in a transaction
  await db.sequelize.transaction(async (t) => {
    await db.models.motivatorResultInput.destroy({
      where: { motivator_result_id: motivatorResults.map((m) => m.id) },
      transaction: t,
    });

    // Delete motivator results
    await db.models.motivatorResult.destroy({
      where: { id: motivatorResults.map((m) => m.id) },
      transaction: t,
    });
  });

  return res.status(204).end();
}));

router.get('/tilt/motivator', (req, res) => {
  res.status(200).json(tilt);
});

export default router;
