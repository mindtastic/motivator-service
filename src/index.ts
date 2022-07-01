import express from 'express';
import log from 'loglevel';
import db from './models';

const app = express();
const port = process.env.PORT;

const logLevel = process.env.LOG_LEVEL as log.LogLevelDesc || 'warn';
log.setLevel(logLevel);
log.info('Initialized logger');

db.sequelize.sync({ force: true }).then(() => log.info('Database synced'));

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  log.info(`Server is running at https://localhost:${port}`);
});
