import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Motivator base route");
})

export default router;