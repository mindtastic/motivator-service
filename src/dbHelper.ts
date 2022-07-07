import db from './db';

const findMotivatorResultForUser = (motivatorID: string, userID: string) => {
  const motivator = db.models.motivatorResult.findOne({
    where: {
      motivator_id: motivatorID,
      user_id: userID,
    },
  });
  return motivator;
};

export default findMotivatorResultForUser;
