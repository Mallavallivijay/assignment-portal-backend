##  Backend Folder

Developed Node.js/Express.js backend API for an educational assignment management system. Built with MongoDB and JWT authentication, this system allows teachers to create and manage assignments while students can submit and track their work.

## Features implemented
<!-- - User Authentication -->
 JWT-based authentication with role-based access control
<!-- - Assignment Management -->
 Full CRUD operations for assignments with status tracking
<!-- - Submission System -->
 Students can submit assignments with due date validation
 Role-Based Access Separate permissions for teachers and students
<!-- - Review System -->
 Teachers can mark submissions as reviewed
<!-- - RESTful API -->
 Clean and well-structured API endpoints
<!-- - Error Handling -->
 Comprehensive error handling with proper HTTP status codes
<!-- - Database Seeding -->
 Easy database setup with sample data




## Technology Stack:
 Node.js, Express.js, MongoDB ,JSON Web Tokens (JWT),(Password Hashin)bcryptjs,(Validation)express-async-handler for async error handling

## Database Schema

<!-- User Model -->
<!-- {
  name: String,
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['teacher', 'student'], required),
  timestamps: true
} -->

<!-- Assignment Model -->
<!-- {
  title: String (required),
  description: String,
  dueDate: Date (required),
  status: String (enum: ['DRAFT', 'PUBLISHED', 'COMPLETED'], default: 'DRAFT'),
  createdBy: ObjectId (ref: User, required),
  timestamps: true
} -->


<!-- Submission Model -->
<!-- {
  assignment: ObjectId (ref: Assignment, required),
  student: ObjectId (ref: User, required),
  answer: String (required),
  reviewed: Boolean (default: false),
  reviewedAt: Date,
  submittedAt: Date (default: Date.now)
} -->


### Authentication Flow
1. User logs in with email/password
2. Server validates credentials and generates JWT token
3. Token is sent to client (frontend)and stored (localStorage)
4. Client includes token in Authorization header for protected routes(privitateroutes)
5. Server validates token and extracts user information

### Role-Based Access Control
- Teacher: Can create, update, delete assignments, view all submissions, mark reviews
- Student: Can view published assignments, submit answers, view own submissions



### Authentication Routes 
(`/api/auth`) => Bbase Url

`/login ` :post => UserLogin it is an public access to irrespective of user rolelogin

### Assignment Routes 
(`/api/assignments`) =>Base Url

 `/` : GET => Get all assignments (filtered by role) 
 `/` : POST => CREATE new assignments (Teacher role) 
`/:id` : PATCH => Update assignment (Teacher role) 
`/:id` : DELETE => Delete assignment(Teacher role) 
 `/:id/submissions` : GET => Get submissions for assignment(Teacher role) 

### Assignemtns Submission Routes 
(`/api/assignments`) => Base Url

 `/:id/submissions`: POST =>Submit assignment answer (Student only )
 `/:id/submissions/me`: GET =>Get own submission  (Student only )
 `/submissions/:submissionId/review` : PATCH =>Mark submission as reviewed (Student only )

## Setup and Installation

### Installation Steps

1.<!-- Clone the repository -->

   git clone (created an  new repository in git hub with preferred  Name)
   cd assignment-portal-backend

2.<!-- Install dependencies -->

   npm install   (it instal all the necessary file like nodemodules,and some dependeces)

3.<!-- Environment Configuration -->
   Create a `.env` file in the root directory that contains below:

   -MONGO_URI=mongodb://localhost:27017/assignment-portal (mongodbd defalult server address ip)
   -JWT_SECRET=your-super-secret-jwt-key-change-this-in-production (random wish typed)
   -PORT=5000 (port for connection )
   -NODE_ENV=development (indication of environment)


4.<!-- Database Setup -->
   -Ensure MongoDB is running
   -Update `MONGO_URI` in `.env` if using a different connection string in (server.js)

   <!-- Seed the database  -->
   (optional to create the user credentials these can be use for future for bulk generation of users )

   npm run seed 

   **note if we doesnot runthese 'npm run seed' the credential may not be created and user may not be able to login**

   (command to create this creates sample teacher and student accounts:
   Teacher: `teacher1@example.com` / `Password123`
    Student: `student1@example.com` / `Password123`)
5.<!--  Start the server -->

   npm run dev (Development mode (with nodemon) to run the server)




### Sample Test Data
After seeding, you can test with:(these are two sets of data create manually )
- `teacher1@example.com` / `Password123`
-  `student1@example.com` / `Password123`

## Main Logic Implementation

### Authentication Controller (`authController.js`)
 -Validates user credentials, generates JWT token
-Creates JWT with user ID and role

### Assignment Controller (`assignmentController.js`)
- Full create, read, update, delete functionality
- Draft → Published → Completed workflow
- Teachers see all their assignments, students see only published ones
- Prevents publishing assignments with past due dates
-  Teachers get submission counts for their assignments

### Submission Controller (`submissionController.js`)
-  Handles student assignment submissions
-  Ensures one submission per student per assignment
-  Prevents late submissions
-  Teachers can mark submissions as reviewed
- : Students can only view their own submissions

### Authentication Middleware (`authMiddleware.js`)
-  Validates JWT tokens and extracts user information
-  Restricts access based on user roles
-  Proper error responses for authentication failures