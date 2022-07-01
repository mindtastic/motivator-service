import express from 'express';
import log from 'loglevel';
import db from './db';
import router from './router';
import auth from './middleware/auth';

const app = express();
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

//app.use(auth);

app.use('/motivator', router);

app.get('/', (req, res) => {
  console.log(req);
  res.send('Hello world');
});

prepareDb.then(() => app.listen(port, () => {
  log.info(`Server is running at https://localhost:${port}`);
}));
