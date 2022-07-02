import db from '..';
import users from './userSeed';
import motivators from './motivatorSeed';
import getContents from './motivatorContentSeed';
import getResults from './motivatorResultSeed';
import getInputs from './motivatorInputSeed';

const insertSeed = async () => {
  const t = await db.sequelize.transaction();

  try {
    const usersCreated = await db.models.user.bulkCreate(users, {
      transaction: t,
    });

    const motivatorsCreated = await db.models.motivator.bulkCreate(motivators, {
      transaction: t,
    });

    motivatorsCreated.forEach((item) => {
      // eslint-disable-next-line max-len
      await db.models.motivatorContent.bulkCreate(getContents(item.id), { transaction: t });

      const resultsCreated = await db.models.motivatorResult.bulkCreate(
        getResults(item.id, usersCreated[0].id),
        { transaction: t },
      );

      resultsCreated.forEach((result) => {
        await db.models.motivatorResultInput.bulkCreate(getInputs(result.id), { transaction: t });
      });
    });

    await t.commit();
  } catch (e) {
    await t.rollback();
  }
};

export default insertSeed;
