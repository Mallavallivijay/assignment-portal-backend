// app.js
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const submissionRoutes = require('./routes/submissionRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors({
  origin: '*' // change to your frontend origin in production
}));

app.get('/', (req, res) => res.json({ message: 'Assignment Portal API' }));

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/assignments', submissionRoutes); // submission endpoints use same prefix

// error handler (last)
app.use(errorHandler);

module.exports = app;
