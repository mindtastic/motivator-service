import express from 'express';
import log from 'loglevel';

const app = express();
const port = process.env.PORT;

const logLevel = process.env.LOG_LEVEL as log.LogLevelDesc || 'warn';
log.setLevel(logLevel);
log.info('Initialized logger');

app.get('/', (req, res) => {
  res.send('Hello world');
});

app.listen(port, () => {
  log.info(`Server is running at https://localhost:${port}`);
});