import db from './db';

const findMotivatorResultForUser = (motivatorID: string, userID: string) => {
  return db.models.motivatorResult.findOne({
    where: {
      motivator_id: motivatorID,
      user_id: userID,
    },
  });
};

export default findMotivatorResultForUser;