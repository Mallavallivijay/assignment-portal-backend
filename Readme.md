# Assignment Portal - Backend

Node.js + Express backend using MongoDB (Mongoose).

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory with the following variables:
   ```env
   MONGO_URI=mongodb://localhost:27017/assignment-portal
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   PORT=5000
   NODE_ENV=development
   ```

3. **Database Setup:**
   - Make sure MongoDB is running on your system
   - Update the `MONGO_URI` in `.env` if your MongoDB connection string is different

4. **Seed the database (optional):**
   ```bash
   npm run seed
   ```

5. **Start the server:**
   ```bash
   npm run dev
   ```

## API Endpoints

- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - User logout
- **GET** `/api/assignments` - Get all assignments
- **POST** `/api/assignments` - Create assignment (Admin only)
- **GET** `/api/assignments/:id` - Get assignment by ID
- **PUT** `/api/assignments/:id` - Update assignment (Admin only)
- **DELETE** `/api/assignments/:id` - Delete assignment (Admin only)
- **POST** `/api/assignments/:id/submit` - Submit assignment
- **GET** `/api/assignments/:id/submissions` - Get submissions for assignment
