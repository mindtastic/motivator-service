import User from '../db/models/users';

const authMiddleware = (req, res, next) => {
  const userId = req.get('X-User-Id');
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized ' });
  }

  try {
    uuid.parse(userId);
  } catch (e) {
    return res.status(401).json({ error: 'Invalid userId' });
  }

  User.findOrCreate({
    where: {
      uid: userId
    }
  })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch(next);
};

export default authMiddleware;