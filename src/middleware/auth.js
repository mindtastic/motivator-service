import db from '../db';

const authMiddleware = (req, res, next) => {
  const userId = req.get('X-User-Id');

  if (!userId) {
    next();
    return null;
  }

  db.models.user.findOrCreate({
    where: {
      uid: userId,
    },
    defaults: {
      uid: userId,
    },
  }).then(([user]) => {
    req.user = {
      uid: user.uid,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    next();
  }).catch(next);

  return null;
};

export default authMiddleware;
