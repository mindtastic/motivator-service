import express from 'express';
import { checkSchema } from 'express-validator';
import db from './db';
import postSchema from './validation/schema_postMotivator';

const router = express.Router();

router.get('/', (req, res) => {
  db.models.motivator.findAll({
    include: [
      {
        model: db.models.motivatorContent,
      },
      {
        model: db.models.motivatorResult,
        where: {
          user_id: req.user.uid,
        },
        include: [
          {
            model: db.models.motivatorResultInput,
          },
        ],
      },
    ],
  }).then((result) => {
    // const response = result.map((item) => ({ ...item, content: item.MotivatorContents }));

    // eslint-disable-next-line max-len
    const response = result.map((item) => item.toJSON())
      .map((item) => {
        const content = item.MotivatorContents.map((x) => JSON.parse(x.content));
        return { ...item, content };
      })
      .map((item) => {
        // eslint-disable-next-line no-param-reassign
        delete item.MotivatorContents;
        return item;
      });
    // console.log(response);
    res.send(response);
  });

  /*
  include: [
      {
        model: db.models.motivatorContent,
      },
      {
        model: db.models.motivatorResult,
        include: [
          {
            model: db.models.motivatorResultInput,
          },
          {
            model: db.models.user,
            where: {
              uid: req.user.uid,
            },
          },
        ],
      },
    ],
  */
});

router.post('/', checkSchema(postSchema), ((req, res) => {
  // console.log(req);

  db.models.motivator.create({
    name: req.body.name,
    headline: req.body.headline,
    description: req.body.description,
    MotivatorContents: req.body.content,
  }, {
    include: [db.models.motivatorContent],
  }).then(() => res.send('successful'));
}));

export default router;
