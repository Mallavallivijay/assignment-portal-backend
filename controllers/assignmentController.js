const asyncHandler = require('express-async-handler');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const createAssignment = asyncHandler(async (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title || !dueDate) {
    res.status(400);
    throw new Error('Title and dueDate are required');
  }

  const assignment = await Assignment.create({
    title,
    description,
    dueDate,
    createdBy: req.user._id,
  });

  res.status(201).json(assignment);
});

const getAssignments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;
  const query = {};

  if (req.user.role === 'teacher') {
    query.createdBy = req.user._id;
    if (status) query.status = status.toUpperCase();
  } else {
    // student: only published
    query.status = 'PUBLISHED';
  }

  const total = await Assignment.countDocuments(query);
  const assignments = await Assignment.find(query)
    .sort({ createdAt: -1 })
    .skip(Number(skip))
    .limit(Number(limit))
    .lean();

  // option: include basic stats for teacher
  if (req.user.role === 'teacher') {
    const withStats = await Promise.all(assignments.map(async (a) => {
      const submissionsCount = await Submission.countDocuments({ assignment: a._id });
      return { ...a, submissionsCount };
    }));
    res.json({ data: withStats, total, page: Number(page), limit: Number(limit) });
  } else {
    res.json({ data: assignments, total, page: Number(page), limit: Number(limit) });
  }
});

const getAssignmentById = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id).lean();
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }

  if (req.user.role === 'student' && assignment.status !== 'PUBLISHED') {
    res.status(403);
    throw new Error('Students can view only published assignments');
  }

  res.json(assignment);
});

const updateAssignment = asyncHandler(async (req, res) => {
  const { action, title, description, dueDate } = req.body;
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }
  if (!assignment.createdBy.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to modify this assignment');
  }

  // actions: publish, complete
  if (action === 'publish') {
    if (assignment.status !== 'DRAFT') {
      res.status(400);
      throw new Error('Only draft assignments can be published');
    }
    const now = new Date();
    if (new Date(assignment.dueDate) < now) {
      res.status(400);
      throw new Error('Cannot publish assignment with due date in the past');
    }
    assignment.status = 'PUBLISHED';
    await assignment.save();
    return res.json(assignment);
  }

  if (action === 'complete') {
    if (assignment.status !== 'PUBLISHED') {
      res.status(400);
      throw new Error('Only published assignments can be marked completed');
    }
    assignment.status = 'COMPLETED';
    await assignment.save();
    return res.json(assignment);
  }

  // normal update (allowed only in DRAFT)
  if (assignment.status !== 'DRAFT') {
    res.status(400);
    throw new Error('Only Draft assignments can be edited');
  }

  if (title) assignment.title = title;
  if (description) assignment.description = description;
  if (dueDate) assignment.dueDate = dueDate;

  await assignment.save();
  res.json(assignment);
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const assignment = await Assignment.findById(req.params.id);
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }
  if (!assignment.createdBy.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to delete this assignment');
  }
  if (assignment.status !== 'DRAFT') {
    res.status(400);
    throw new Error('Only Draft assignments can be deleted');
  }
  await assignment.deleteOne();
  res.json({ message: 'Assignment deleted' });
});

const getSubmissionsForAssignment = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }
  if (!assignment.createdBy.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to view submissions for this assignment');
  }

  const submissions = await Submission.find({ assignment: assignmentId }).populate('student', 'name email').sort({ submittedAt: -1 });
  res.json(submissions);
});

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getSubmissionsForAssignment,
};
