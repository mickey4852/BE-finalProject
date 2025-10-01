import express from 'express';
import pool from '../utils/db.mjs';

const bookRouter = express.Router();

bookRouter.get('/', (req, res) => {
    res.send('Hello World');
});

export default bookRouter;