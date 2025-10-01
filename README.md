# Book Management API

A RESTful API for managing books and user authentication built with Express.js and PostgreSQL.

## Features

- User authentication (register/login) with JWT tokens
- Book management (CRUD operations)
- User-specific book lists
- Protected routes with middleware
- Password hashing with bcrypt

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory:

```env
JWT_SECRET=your_super_secret_jwt_key_here
```

## Database Schema

### Users Table
- `userid` (Primary Key)
- `email` (Unique)
- `password` (Hashed)
- `firstname`
- `lastname`

### Books Table
- `bookid` (Primary Key)
- `name`
- `description`
- `author`
- `url`
- `category`
- `create_at`
- `update_at`

### Booklist Table
- `userid` (Foreign Key)
- `bookid` (Foreign Key)

## API Endpoints

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstname": "John",
  "lastname": "Doe"
}
```

**Response:**
```json
{
  "message": "User registered successfully"
}
```

**Validation:**
- Password must be at least 8 characters
- Email must contain '@'
- Email must be unique

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Books (Protected Routes)

All book endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

#### Get User's Books
```http
GET /books
GET /books?category=fiction
GET /books?name=harry
GET /books?author=rowling
GET /books?category=fiction&author=rowling
```

**Response:**
```json
[
  {
    "name": "Harry Potter",
    "description": "A fantasy novel",
    "author": "J.K. Rowling",
    "url": "https://example.com",
    "category": "fantasy",
    "create_at": "2024-01-15T10:30:00.000Z",
    "update_at": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Add Book to User's List
```http
POST /books
Content-Type: application/json

{
  "name": "Harry Potter",
  "description": "A fantasy novel about a young wizard",
  "author": "J.K. Rowling",
  "url": "https://example.com/harry-potter",
  "category": "fantasy"
}
```

**Response:**
```json
{
  "message": "Book added to booklist successfully"
}
```

#### Update Book
```http
PUT /books/:bookid
Content-Type: application/json

{
  "name": "Harry Potter Updated",
  "description": "Updated description",
  "author": "J.K. Rowling",
  "url": "https://example.com/updated",
  "category": "fantasy"
}
```

**Response:**
```json
{
  "message": "Book updated successfully"
}
```

#### Delete Book
```http
DELETE /books/:bookid
```

**Response:**
```json
{
  "message": "Book deleted successfully"
}
```

## Error Responses

### Authentication Errors
- `400` - User already exists (register)
- `401` - Password too short
- `402` - Invalid email format
- `403` - User not found (login)
- `404` - Invalid password

### Book Management Errors
- `400` - Book already exists / Book not found / Book not in user's list
- `401` - Unauthorized (invalid/missing token)
- `500` - Internal server error

## Usage Examples

### Complete Workflow

1. **Register a new user:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstname":"John","lastname":"Doe"}'
```

2. **Login to get token:**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

3. **Add a book (use token from step 2):**
```bash
curl -X POST http://localhost:4000/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Harry Potter","description":"Fantasy novel","author":"J.K. Rowling","url":"https://example.com","category":"fantasy"}'
```

4. **Get user's books:**
```bash
curl -X GET http://localhost:4000/books \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Running the Server

```bash
npm start
```

The server will run on `http://localhost:4000`

## Dependencies

- `express` - Web framework
- `pg` - PostgreSQL client
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `dotenv` - Environment variables
- `nodemon` - Development server

## Project Structure

```
server/
├── app.mjs                 # Main application file
├── package.json
├── router/
│   ├── auth.mjs           # Authentication routes
│   └── bookrouter.mjs     # Book management routes
├── middlewares/
│   └── protect.js         # JWT authentication middleware
└── utils/
    └── db.mjs             # Database connection
```
