import express from 'express';
import jwt from 'jsonwebtoken';
import pool from '../utils/db.mjs';
import { protect } from '../middlewares/protect.js';

const bookRouter = express.Router();

bookRouter.use(protect);

//get user books in list by email in token with optional query filters
bookRouter.get('/', async (req, res) => {
   try {
     const email = req.user.email;
     const { category, name, author } = req.query;
     
     let query = `SELECT books.name, books.description, books.author, books.url, books.category, books.create_at, books.update_at
                  FROM books 
                  JOIN booklist ON books.bookid = booklist.bookid
                  JOIN users ON users.userid = booklist.userid
                  WHERE users.email = $1`;
     
     let params = [email];
     let paramCount = 1;
     
     // Add optional filters
     if (category) {
       paramCount++;
       query += ` AND books.category = $${paramCount}`;
       params.push(category);
     }
     
     if (name) {
       paramCount++;
       query += ` AND books.name ILIKE $${paramCount}`;
       params.push(`%${name}%`);
     }
     
     if (author) {
       paramCount++;
       query += ` AND books.author ILIKE $${paramCount}`;
       params.push(`%${author}%`);
     }
     
     console.log('Query:', query);
     console.log('Params:', params);
     
     const result = await pool.query(query, params);
   
     res.status(200).json(result.rows);
   } catch (error) {
        res.status(500).json({message: 'Internal server error', error: error.message});
   }
  
 });

//post book to booklist of email user in token
bookRouter.post('/', async (req, res) => {
   try {
    const email = req.user.email;
    const book = req.body;
    //check if book already in books table
    const checkBook = await pool.query('SELECT * FROM books WHERE bookid = $1', [book.bookid]);
    if (checkBook.rows.length > 0) {
        return res.status(400).json({message: 'Book already exists'});
    }

    //add book to books table
    const created_at = new Date();
    const updated_at = new Date();
    const result = await pool.query(
        `INSERT INTO books (name, description, author, url, category,create_at,update_at) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`
        , [
            book.name, 
            book.description, 
            book.author, 
            book.url, 
            book.category,
            created_at,
            updated_at
        ]);
    //add book to booklist for email user in token
   const userid = await pool.query('SELECT userid FROM users WHERE email = $1', [email]);
   const bookid = await pool.query('SELECT bookid FROM books WHERE name = $1', [book.name]);

    const result2 = await pool.query(
        `INSERT INTO booklist (userid, bookid) 
        VALUES ($1, $2)`
        , [
            userid.rows[0].userid, 
            bookid.rows[0].bookid
        ]);
    res.status(200).json({message: 'Book added to booklist successfully'});

   } catch (error) {
    res.status(500).json({message: 'Internal server error', error: error.message});
   }
});

//update book in booklist of email user in token
bookRouter.put('/:bookid', async (req, res) => {
   try {
    const email = req.user.email;
    const book = req.body;
    const bookid = req.params.bookid;
    
    //check if book already in books table
    const checkBook = await pool.query('SELECT * FROM books WHERE bookid = $1', [bookid]);
    if (checkBook.rows.length === 0) {
        return res.status(400).json({message: 'Book not found'});
    }
 
    //check if book already in booklist for email user in token
    const userid = await pool.query('SELECT userid FROM users WHERE email = $1', [email]);

    const checkBooklist = await pool.query('SELECT * FROM booklist WHERE bookid = $1 AND userid = $2', [bookid, userid.rows[0].userid]);
    if (checkBooklist.rows.length === 0) {
        return res.status(400).json({message: 'Book not found in user\'s booklist'});
    }
  
    //update book in books table
    const result = await pool.query(
        `UPDATE books SET name = $1, description = $2, author = $3, url = $4, category = $5, update_at = NOW() WHERE bookid = $6`
        , [
            book.name, 
            book.description, 
            book.author, 
            book.url, 
            book.category,
            bookid
        ]);
    res.status(200).json({message: 'Book updated successfully'});
    
   } catch (error) {
    res.status(500).json({message: 'Internal server error'});
   }
});

//delete book in booklist of email user in token
bookRouter.delete('/:bookid', async (req, res) => {
   try {
    const email = req.user.email;
    const bookid = req.params.bookid;
    //check if book already in books table
    const checkBook = await pool.query(
        `SELECT * FROM books 
        WHERE bookid = $1`
        , [
            bookid
        ]);
    if (checkBook.rows.length === 0) {
        return res.status(400).json({message: 'Book not found'});
    }

    //check if book already in booklist for email user in token
    const userid = await pool.query(
        `SELECT userid 
        FROM users 
        WHERE email = $1`
        , [
            email
        ]);
    const checkBooklist = await pool.query(
        `SELECT * 
        FROM booklist 
        WHERE bookid = $1 AND userid = $2`
        , [
            bookid, 
            userid.rows[0].userid
        ]);
    if (checkBooklist.rows.length === 0) {
        return res.status(400).json({message: 'Book not found in user\'s booklist'});
    }

    //delete book list of bookid
    const result = await pool.query(
        `DELETE FROM booklist 
        WHERE bookid = $1 AND userid = $2`
        , [
            bookid, 
            userid.rows[0].userid
        ]);
    if (result.rowCount === 0) {
        return res.status(400).json({message: 'Book not found in user\'s booklist'});
    }

    //delete book in books table
    const result2 = await pool.query(
        `DELETE FROM books 
        WHERE bookid = $1`
        , [
            bookid
        ]);
    if (result2.rowCount === 0) {
        return res.status(400).json({message: 'Book not found in books table'});
    }
    res.status(200).json({message: 'Book deleted successfully'});   

   } catch (error) {
    res.status(501).json({
        message: 'Internal server error'
    });
   }
});


export default bookRouter;