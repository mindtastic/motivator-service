import express from 'express';
import log from 'loglevel';

import * as db from './db';

const app = express();
app.use(express.json());
const port = process.env.PORT;

const logLevel = process.env.LOG_LEVEL as log.LogLevelDesc || 'warn';
log.setLevel(logLevel);
log.info('Initialized logger');

// Database setup
const connectDb = db.default.sequelize.authenticate()
  .then(() => log.info('Database connection established'))
  .catch((e) => log.error(`Error connecting to database: ${e}`));

const prepareDb = connectDb
  .then(() => db.default.migrations(log).up())
  .catch((e) => {
    log.error(`Error running migrations: ${e}`);
    log.trace(e);
  });

app.get('/', (req, res) => {
  res.send('Hello world');
});

// add result to a specified motivator
app.post('/motivator/result/:motivatorId', (req, res) => {
  log.info('Adding a result to a motivator');

  if (!req.body) {
    res.status(422).send('Request body undefined');
    return;
  }

  let { timestamp } = req.body.timestamp;

  if (!timestamp) {
    timestamp = new Date();
  }

  // TODO: Auth UserID Header
  db.default.models.motivatorResult.create({
    status: req.body.status,
    timestamp: { timestamp },
    feedback: req.body.feedback,
    user_id: req.get('X-User-ID'),
    motivator_id: req.params.motivatorId
  }).then((new_result) => res.status(201).send(new_result)).catch((err) => res.status(404).send(err));

});

// delete result from a specified motivator
app.delete('/motivator/result/:motivatorId', (req, res) => {
  log.info('Deleting a result from a motivator');

  // TODO: Auth UserID Header
  db.default.models.motivatorResult.destroy({
    where: { motivator_id: req.params.motivatorId },
  }).then(() => res.status(204).send()).catch((err) => res.status(404).send(err));

});

prepareDb.then(() => app.listen(port, () => {
  log.info(`Server is running at https://localhost:${port}`);
}));
