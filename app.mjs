import express from 'express';
import pool from './utils/db.mjs';
import bookRouter from './router/bookrouter.mjs';
import authRouter from './router/auth.mjs';
import dotenv from 'dotenv';

async function init() {
    dotenv.config();
    const app = express();
    const port = 4000;

    app.use(express.json());
    app.use('/books', bookRouter);
    app.use('/auth', authRouter);

    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

init();