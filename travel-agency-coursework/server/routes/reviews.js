import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    res.status(200).send("Reviews route is working");
});

export default router;