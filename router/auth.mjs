import { Router } from 'express';
import pool from '../utils/db.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const authRouter = Router();

//authen api register
authRouter.post('/register', async (req, res) => {
    try {
    const user = {
        email: req.body.email,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    }

    //check if user already exists
    const checkUser = await pool.query('SELECT * FROM "users" WHERE email = $1', [user.email]);
    if (checkUser.rows.length > 0) {
        return res.status(400).json({message: 'User already exists'});
    }
    //check if password is valid
    if (user.password.length < 8) {
        return res.status(401).json({message: 'Password must be at least 8 characters long'});
    }

    //check if email is valid
    if (!user.email.includes('@')) {
        return res.status(402).json({message: 'Invalid email'});
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    //insert user into database
    const result = await pool.query(
        'INSERT INTO "users" (email, password, firstname, lastname) VALUES ($1, $2, $3, $4)',
        [
            user.email, 
            user.password, 
            user.firstname, 
            user.lastname, 
           
        ]
        );
    
    res.status(200).json({message: 'User registered successfully'});
} catch (error) {
    res.status(500).json({message: 'Internal server error'});
}
});
;

//api login
authRouter.post('/login', async (req, res) => {
    try {
    const user = {
        email: req.body.email,
        password: req.body.password,
    }

    //check if user exists
    const checkUser = await pool.query('SELECT * FROM "users" WHERE email = $1', [user.email]);
    if (checkUser.rows.length === 0) {
        return res.status(403).json({message: 'User not found'});
    }
    //check if password is valid
    const isPasswordValid = await bcrypt.compare(user.password, checkUser.rows[0].password);
    if (!isPasswordValid) {
        return res.status(404).json({message: 'Invalid password'});
    }
    //generate token
    const token = jwt.sign({
        id: checkUser.rows[0].id, 
        email: user.email, 
        firstname: checkUser.rows[0].firstname, 
        lastname: checkUser.rows[0].lastname
    }, process.env.JWT_SECRET || 'fallback_secret_key_for_development_only', {
        expiresIn: '1h'
    });
    res.status(200).json({message: 'User logged in successfully', token});
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({message: 'Internal server error', error: error.message});
    }

  
});


export default authRouter;