import express from 'express';
import log from 'loglevel';
import db from './db';

import sequelize from './db';
import definitions from './db/models';
import sequelizeRes from './db/models/motivatorResult';
import sequelizeMot from './db/models/motivator';

const app = express();
app.use(express.json());
const port = process.env.PORT;

const logLevel = process.env.LOG_LEVEL as log.LogLevelDesc || 'warn';
log.setLevel(logLevel);
log.info('Initialized logger');

// Database setup
const connectDb = db.sequelize.authenticate()
  .then(() => log.info('Database connection established'))
  .catch((e) => log.error(`Error connecting to database: ${e}`));

const prepareDb = connectDb
  .then(() => db.migrations(log).up())
  .catch((e) => {
    log.error(`Error running migrations: ${e}`);
    log.trace(e);
  });

app.get('/', (req, res) => {
  res.send('Hello world');
});

// add result to a specified motivator
app.post('/motivator/result/:motivatorId', (req, res) => {
  console.log(req);
  console.log(req.body);
  console.log(req.get('X-User-ID'));
  console.log(req.params.motivatorId)



  if (!req.body) {
    res.status(400).send("Request body undefined");
    return;
  }

  let timestamp = req.body.timestamp;

  if (!timestamp) {
    timestamp = new Date();
  }

  // TODO: Auth UserID Header
  sequelize.models.motivatorResult.create({
      status: req.body.status,
      timestamp: timestamp,
      feedback: req.body.feedback,
      user_id: req.get('X-User-ID'),
      motivator_id: req.params.motivatorId
  }).then((new_result) => res.status(201).send(new_result)).catch((err) => res.status(500).send(err))

})

// delete result from a specified motivator
app.delete('/motivator/result/:motivatorId', (req, res) => {
  
  // TODO: Auth UserID Header
  sequelize.models.motivatorResult.destroy({
    where: { motivator_id: req.params.motivatorId },
  }).then(() => res.status(200).send({"success": true})).catch((err) => res.status(500).send(err))

})

prepareDb.then(() => app.listen(port, () => {
  log.info(`Server is running at https://localhost:${port}`);
}));
