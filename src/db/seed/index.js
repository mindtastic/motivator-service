import db from '..';
import users from './userSeed';
import motivators from './motivatorSeed';
import getContents from './motivatorContentSeed';
import getResults from './motivatorResultSeed';
import getInputs from './motivatorInputSeed';
import getResultInputs from './motivatorResultInputSeed';

const insertSeed = async (logger) => {
  const isSeedPresent = await db.models.user.findAll({
    where: {
      uid: users[0].uid,
    },
  });

  if (isSeedPresent.length > 0) return;

  const t = await db.sequelize.transaction();

  try {
    const usersCreated = await db.models.user.bulkCreate(users, {
      transaction: t,
    });

    const motivatorsCreated = await db.models.motivator.bulkCreate(motivators, {
      transaction: t,
    });

    await Promise.all(motivatorsCreated.map(async (item) => {
      await db.models.motivatorContent.bulkCreate(getContents(item.id), { transaction: t });
      await db.models.motivatorInput.bulkCreate(getInputs(item.id), { transaction: t });

      const resultsCreated = await db.models.motivatorResult.bulkCreate(
        getResults(usersCreated[0].uid, item.id),
        { transaction: t },
      );

      await Promise.all(resultsCreated.map(async (result) => {
        // eslint-disable-next-line max-len
        await db.models.motivatorResultInput.bulkCreate(getResultInputs(result.id), { transaction: t });
      }));
    }));

    await t.commit();
  } catch (e) {
    logger.error(`Error committing DB seed: ${e}`);
    await t.rollback();
  }
};

export default insertSeed;
