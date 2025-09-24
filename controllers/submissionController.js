const asyncHandler = require('express-async-handler');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');

const submitAnswer = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const { answer } = req.body;
  if (!answer || answer.trim() === '') {
    res.status(400);
    throw new Error('Answer is required');
  }

  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) {
    res.status(404);
    throw new Error('Assignment not found');
  }
  if (assignment.status !== 'PUBLISHED') {
    res.status(403);
    throw new Error('Assignment is not published');
  }

  const now = new Date();
  if (new Date(assignment.dueDate) < now) {
    res.status(403);
    throw new Error('Cannot submit after the due date');
  }

  // ensure single submission per student
  const existing = await Submission.findOne({ assignment: assignmentId, student: req.user._id });
  if (existing) {
    res.status(400);
    throw new Error('You have already submitted for this assignment');
  }

  const submission = await Submission.create({
    assignment: assignmentId,
    student: req.user._id,
    answer,
  });

  res.status(201).json(submission);
});

const getMySubmission = asyncHandler(async (req, res) => {
  const assignmentId = req.params.id;
  const submission = await Submission.findOne({ assignment: assignmentId, student: req.user._id });
  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }
  res.json(submission);
});

const markReviewed = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { reviewed } = req.body;

  const submission = await Submission.findById(submissionId).populate('assignment');
  if (!submission) {
    res.status(404);
    throw new Error('Submission not found');
  }

  // only the teacher can mark review (created role only can make changes in assignment)
  const assignment = await Assignment.findById(submission.assignment._id);
  if (!assignment.createdBy.equals(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to mark review for this submission');
  }

  submission.reviewed = Boolean(reviewed);
  submission.reviewedAt = submission.reviewed ? new Date() : undefined;
  await submission.save();

  res.json(submission);
});

module.exports = { submitAnswer, getMySubmission, markReviewed };
