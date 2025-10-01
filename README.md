# Book Management API

A RESTful API for managing books and user authentication built with Express.js and PostgreSQL.

### Project introduction
เป็นโจทย์ Final Project ของคลาส BE4

### Project Overview

- สร้างเว็บแอปพลิเคชั่นเพื่อจัดการ "คอลเลกชันหนังสือ"
- แอปนี้สามารถให้ผู้ใช้ลงทะเบียน เข้าสู่ระบบ และจัดการคอลเลกชันหนังสือส่วนบุคคล
- ผู้ใช้สามารถเพิ่ม ดู แก้ไข และลบรายละเอียดหนังสือ

### Project Requirements

1. **Backend (Express)**
    - สร้าง RESTful API สำหรับ
        - การสมัครสมาชิก เข้าสู่ระบบ และออกจากระบบ (ให้ใช้รูปแบบระบบ Authentication แบบ JWT)
        - มี CRUD API สำหรับจัดการข้อมูลของหนังสือ
    - Validate ข้อมูล และจัดการ Error ของ API ทุกอัน
    - สร้าง Middleware สำหรับการทำ Authentication ของ API
2. **Database**
    - ใช้ PostgreSQL ในการเก็บข้อมูล
3. **Other Requirements**
    - ใช้ Express ในการสร้าง API
    - ใช้ Git สำหรับการทำ Version control พร้อมกับรูปแบบการเขียน Commit message ด้วย Conventional commit
    - มี API Document ที่เขียนเอกในเอกสาร หรือแนะนำให้ใช้ Library ชื่อ Swagger ในการสร้าง API Document ([ดูวิธีการ Setup Swagger ได้จากที่นี่](https://blog.logrocket.com/documenting-express-js-api-swagger/))

## 📚 API Documentation

### Swagger/OpenAPI Documentation

The complete API specification is available in `swagger.yaml`. You can view it using:

1. **Swagger Editor**: [editor.swagger.io](https://editor.swagger.io/)
   - Import the `swagger.yaml` file
   - Use "Try it out" feature to test endpoints

2. **Swagger UI**: Generate interactive documentation
3. **Postman**: Import OpenAPI specification

### Quick Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | ❌ |
| POST | `/auth/login` | Login user | ❌ |
| GET | `/books` | Get user's books | ✅ |
| POST | `/books` | Add book to list | ✅ |
| PUT | `/books/{bookid}` | Update book | ✅ |
| DELETE | `/books/{bookid}` | Delete book | ✅ |

## 🛠 Installation & Setup

### Prerequisites

- **Node.js** (v14 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up database**
   ```bash
   # Run SQL scripts in your PostgreSQL database
   # See Database Schema section below
   ```

5. **Start the server**
   ```bash
   npm start
   ```

## 🔧 Environment Variables

Create a `.env` file in the root directory:

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Database Configuration (if needed)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_username
DB_PASSWORD=your_password
```

### Security Notes

- Use a strong, random JWT_SECRET (at least 32 characters)
- Never commit `.env` file to version control
- Use different secrets for development and production

## 🗄 Database Schema

### Users Table
```sql
CREATE TABLE users (
    userid SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100),
    lastname VARCHAR(100)
);
```

### Books Table
```sql
CREATE TABLE books (
    bookid SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    author VARCHAR(255),
    url VARCHAR(500),
    category VARCHAR(100),
    create_at TIMESTAMP DEFAULT NOW(),
    update_at TIMESTAMP DEFAULT NOW()
);
```

### Booklist Table (Junction Table)
```sql
CREATE TABLE booklist (
    userid INTEGER REFERENCES users(userid) ON DELETE CASCADE,
    bookid INTEGER REFERENCES books(bookid) ON DELETE CASCADE,
    PRIMARY KEY (userid, bookid)
);
```

### Sample Data
```sql
-- Insert sample user
INSERT INTO users (email, password, firstname, lastname) 
VALUES ('test@example.com', '$2b$10$...', 'John', 'Doe');

-- Insert sample book
INSERT INTO books (name, description, author, url, category) 
VALUES ('Harry Potter', 'Fantasy novel', 'J.K. Rowling', 'https://example.com', 'fantasy');

-- Add book to user's list
INSERT INTO booklist (userid, bookid) VALUES (1, 1);
```

## 🔗 API Endpoints

### Authentication Endpoints

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

**Validation Rules:**
- Password: minimum 8 characters
- Email: must contain '@' symbol
- Email: must be unique

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

### Book Management Endpoints

#### Get User's Books
```http
GET /books
Authorization: Bearer <jwt_token>

# With filters
GET /books?category=fantasy
GET /books?name=harry
GET /books?author=rowling
GET /books?category=fantasy&author=rowling
```

#### Add Book
```http
POST /books
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Harry Potter",
  "description": "A fantasy novel about a young wizard",
  "author": "J.K. Rowling",
  "url": "https://example.com/harry-potter",
  "category": "fantasy"
}
```

#### Update Book
```http
PUT /books/1
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "name": "Harry Potter Updated",
  "description": "Updated description",
  "author": "J.K. Rowling",
  "url": "https://example.com/updated",
  "category": "fantasy"
}
```

#### Delete Book
```http
DELETE /books/1
Authorization: Bearer <jwt_token>
```

## 🔐 Authentication

### JWT Token Usage

All book management endpoints require authentication. Include the JWT token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Token Information

- **Expiration**: 1 hour (900000 milliseconds)
- **Format**: Bearer token
- **Payload**: Contains user ID, email, firstname, lastname

### Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT token validation middleware
- Protected routes with authentication check

## 💡 Usage Examples

### Complete Workflow

1. **Register a new user**
   ```bash
   curl -X POST http://localhost:4000/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "firstname": "John",
       "lastname": "Doe"
     }'
   ```

2. **Login to get token**
   ```bash
   curl -X POST http://localhost:4000/auth/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123"
     }'
   ```

3. **Add a book (use token from step 2)**
   ```bash
   curl -X POST http://localhost:4000/books \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "name": "Harry Potter",
       "description": "Fantasy novel",
       "author": "J.K. Rowling",
       "url": "https://example.com",
       "category": "fantasy"
     }'
   ```

4. **Get user's books**
   ```bash
   curl -X GET http://localhost:4000/books \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

5. **Search books by category**
   ```bash
   curl -X GET "http://localhost:4000/books?category=fantasy" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

6. **Update a book**
   ```bash
   curl -X PUT http://localhost:4000/books/1 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "name": "Harry Potter Updated",
       "description": "Updated description",
       "author": "J.K. Rowling",
       "url": "https://example.com/updated",
       "category": "fantasy"
     }'
   ```

7. **Delete a book**
   ```bash
   curl -X DELETE http://localhost:4000/books/1 \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```

## ⚠️ Error Handling

### HTTP Status Codes

| Status | Description | Example |
|--------|-------------|---------|
| 200 | Success | Book retrieved successfully |
| 400 | Bad Request | User already exists, Book not found |
| 401 | Unauthorized | Invalid password, Invalid token |
| 402 | Invalid Input | Invalid email format |
| 403 | Forbidden | User not found |
| 404 | Not Found | Invalid password |
| 500 | Server Error | Internal server error |
| 501 | Not Implemented | Server error |

### Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed error information (in development)"
}
```

### Common Error Scenarios

1. **Authentication Errors**
   - Invalid token format
   - Expired token
   - Missing authorization header

2. **Validation Errors**
   - Password too short
   - Invalid email format
   - Missing required fields

3. **Business Logic Errors**
   - User already exists
   - Book not found in user's list
   - Duplicate book entries

## 🧪 Testing

### Manual Testing with Postman

1. Import the OpenAPI specification from `swagger.yaml`
2. Set up environment variables for base URL and JWT token
3. Test each endpoint following the workflow above

### Automated Testing

```bash
# Run tests (if available)
npm test

# Run with coverage
npm run test:coverage
```

### Database Testing

```sql
-- Test user registration
SELECT * FROM users WHERE email = 'test@example.com';

-- Test book addition
SELECT * FROM books WHERE name = 'Harry Potter';

-- Test booklist relationship
SELECT u.email, b.name 
FROM users u 
JOIN booklist bl ON u.userid = bl.userid 
JOIN books b ON bl.bookid = b.bookid 
WHERE u.email = 'test@example.com';
```

## 📁 Project Structure

```
server/
├── app.mjs                 # Main application entry point
├── package.json            # Dependencies and scripts
├── swagger.yaml            # OpenAPI specification
├── .env                    # Environment variables (not in git)
├── router/                 # API route handlers
│   ├── auth.mjs           # Authentication routes
│   └── bookrouter.mjs     # Book management routes
├── middlewares/            # Custom middleware
│   └── protect.js         # JWT authentication middleware
├── utils/                  # Utility functions
│   └── db.mjs             # Database connection
└── node_modules/          # Dependencies (auto-generated)
```

### File Descriptions

- **`app.mjs`**: Express app setup, middleware configuration, route mounting
- **`router/auth.mjs`**: User registration and login endpoints
- **`router/bookrouter.mjs`**: Book CRUD operations with user-specific filtering
- **`middlewares/protect.js`**: JWT token validation middleware
- **`utils/db.mjs`**: PostgreSQL connection pool setup

## 📦 Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.1.0 | Web framework |
| `pg` | ^8.16.3 | PostgreSQL client |
| `bcrypt` | ^6.0.0 | Password hashing |
| `jsonwebtoken` | ^9.0.2 | JWT authentication |
| `dotenv` | ^17.2.3 | Environment variables |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.1.10 | Development server |

### Installation

```bash
# Install all dependencies
npm install

# Install production dependencies only
npm install --production

# Update dependencies
npm update
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Style

- Use ES6+ modules (`.mjs` files)
- Follow consistent naming conventions
- Add comments for complex logic
- Handle errors appropriately

### Pull Request Guidelines

- Include description of changes
- Update documentation if needed
- Ensure all tests pass
- Follow the existing code style

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the Swagger documentation
- Review the error handling section
- Test with the provided examples

---

**Happy coding!** 🚀
