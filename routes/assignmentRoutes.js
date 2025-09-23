// routes/assignmentRoutes.js
const express = require('express');
const router = express.Router();
const {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
  getSubmissionsForAssignment,
} = require('../controllers/assignmentController');

const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// create - teacher only
router.post('/', protect, authorizeRoles('teacher'), createAssignment);

// list - both roles (logic inside controller)
router.get('/', protect, getAssignments);

// get by id
router.get('/:id', protect, getAssignmentById);

// update (including publish / complete)
router.patch('/:id', protect, authorizeRoles('teacher'), updateAssignment);

// delete (draft only)
router.delete('/:id', protect, authorizeRoles('teacher'), deleteAssignment);

// get submissions for an assignment (teacher only)
router.get('/:id/submissions', protect, authorizeRoles('teacher'), getSubmissionsForAssignment);

module.exports = router;
