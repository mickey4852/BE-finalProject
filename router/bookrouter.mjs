import express from 'express';
import pool from '../utils/db.mjs';
import { protect } from '../middlewares/protect.js';

const bookRouter = express.Router();

bookRouter.use(protect);

bookRouter.get('/', (req, res) => {

    res.send('Hello World');
});

export default bookRouter;