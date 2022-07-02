import { parse as uuidParse } from 'uuid';
import db from '../db';

const authMiddleware = (req, res, next) => {
  const userId = req.get('X-User-Id');
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized ' });
  }

  try {
    console.log(userId);
    uuidParse(userId);
  } catch (e) {
    console.log(e);
    return res.status(401).json({ error: 'Invalid userId' });
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
