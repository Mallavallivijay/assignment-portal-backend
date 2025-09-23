// routes/submissionRoutes.js
const express = require('express');
const router = express.Router();
const { submitAnswer, getMySubmission, markReviewed } = require('../controllers/submissionController');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');


router.post('/:id/submissions', protect, authorizeRoles('student'), submitAnswer);// student submission answere
router.get('/:id/submissions/me', protect, authorizeRoles('student'), getMySubmission);// student view submitted answere



// tearcher to make review checcked or unchecked:
router.patch('/submissions/:submissionId/review', protect, authorizeRoles('teacher'), async (req, res, next) => {
  // This expects body: { reviewed: true/false } and req.params.submissionId
  const { reviewed } = req.body;
  // call controller
  const { markReviewed } = require('../controllers/submissionController');
  req.params.submissionId = req.params.submissionId;
  await markReviewed(req, res);
});

module.exports = router;
