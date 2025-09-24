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


router.post('/', protect, authorizeRoles('teacher'), createAssignment);// create - teacher only
router.get('/', protect, getAssignments);// list - both roles (logic inside controller)
router.get('/:id', protect, getAssignmentById);// get by id
router.patch('/:id', protect, authorizeRoles('teacher'), updateAssignment);// update (including publish / complete)
router.delete('/:id', protect, authorizeRoles('teacher'), deleteAssignment);// delete (draft only)
router.get('/:id/submissions', protect, authorizeRoles('teacher'), getSubmissionsForAssignment);// get submissions for an assignment (teacher only)

module.exports = router;
