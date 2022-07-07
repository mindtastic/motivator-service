import db from './db';

const motivatorResultsForUser = (motivatorID: string, userID: string) => (
  db.models.motivatorResult.findAll({
    where: {
      motivator_id: motivatorID,
      user_id: userID,
    },
  })
);

export default motivatorResultsForUser;
