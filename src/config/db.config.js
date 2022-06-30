module.exports = {
  host: 'postgres',
  user: 'root',
  password: 'root',
  db: 'motivator',
  dialect: 'postgres',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
