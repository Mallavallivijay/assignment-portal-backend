// seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Assignment = require('./models/Assignment');

async function seed() {
  try {
    await connectDB();
    // clear users and assignments (CAUTION in prod!)
    await User.deleteMany({});
    await Assignment.deleteMany({});

    const teacher = new User({
      name: 'Ms. Alice Teacher',
      email: 'teacher1@example.com',
      password: 'Password123', // will be hashed by pre-save
      role: 'teacher',
    });

    const student = new User({
      name: 'Bob Student',
      email: 'student1@example.com',
      password: 'Password123',
      role: 'student',
    });

    await teacher.save();
    await student.save();

    // create a sample draft assignment
    const a1 = await Assignment.create({
      title: 'Sample Math Assignment',
      description: 'Solve basic problems 1-10',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // one week from now
      createdBy: teacher._id,
    });

    console.log('Seed completed');
    console.log('Teacher:', { email: teacher.email, password: 'Password123' });
    console.log('Student:', { email: student.email, password: 'Password123' });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
