import express from 'express';
import pool from './utils/db.mjs';
import bookRouter from './router/bookrouter.mjs';

const app = express();
const port = 4000;

app.use(express.json());

app.use('/books', bookRouter);

//API test by get all books limit 10
app.get('/test', async (req, res) => {
    const { limit = 10 } = req.query;
    const books = await pool.query('SELECT * FROM books LIMIT $1', [limit]);
    res.status(200).json(books.rows);
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
