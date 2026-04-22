const express = require('express');
const router = express.Router();
const complaintsController = require('../controllers/complaintsController');
const authenticate = require('../middleware/authenticate');
const isAdmin = require('../middleware/isAdmin');
const upload = require('../middleware/upload');

// User & Admin shared endpoints
router.get('/', authenticate, complaintsController.getComplaints);
router.post('/', authenticate, complaintsController.createComplaint);
router.get('/:id', authenticate, complaintsController.getComplaintById);
router.post('/:id/evidence', authenticate, upload.array('evidence', 5), complaintsController.uploadEvidence);

// Admin endpoints
router.patch('/:id/status', authenticate, isAdmin, complaintsController.updateStatus);
router.post('/:id/assign', authenticate, isAdmin, complaintsController.assignDepartment);
router.post('/:id/log', authenticate, isAdmin, complaintsController.addActivityLog);

module.exports = router;
