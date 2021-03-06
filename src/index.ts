import express from 'express';
import log from 'loglevel';
import db from './db';
import router from './router';
import auth from './middleware/auth';
import insertSeed from './db/seed';
import defaultErrorHandler from './middleware/defaultErrorHandler';
import moodivatorRouter from './moodivator';
import tilt_motivator  from './tilt/tilt_motivator.json' assert { type: 'json' };
import tilt_moodivator  from './tilt/tilt_moodivator.json' assert { type: 'json' };
import { assert } from 'console';

const app = express();
const port = process.env.PORT || 80;

const logLevel = process.env.LOG_LEVEL as log.LogLevelDesc || 'warn';
log.setLevel(logLevel);
log.info('Initialized logger');

// Database setup
const connectDb = db.sequelize.authenticate()
  .then(() => log.info('Database connection established'))
  .catch((e) => log.error(`Error connecting to database: ${e}`));

const prepareDb = connectDb
  .then(() => db.migrations(log).up())
  .then(() => insertSeed(log))
  .catch((e) => {
    log.error(`Error running migrations: ${e}`);
    log.trace(e);
  });


app.use(auth);
app.use(express.json());
app.use(defaultErrorHandler);


app.use('/motivator', router);
app.use('/moodivator', moodivatorRouter);

app.get('/', (req, res) => {
  log.info(req);
  res.send('Hello world');
});

app.get('/tilt/motivator', (req, res) => {
  res.status(200).json(tilt_motivator);
});

app.get('/tilt/moodivator', (req, res) => {
  res.status(200).json(tilt_moodivator);
});

app.get('/health', (req, res) => {
  res.status(200).end();
});

prepareDb.then(() => app.listen(port, () => {
  log.info(`Server is running at https://localhost:${port}`);
}));
