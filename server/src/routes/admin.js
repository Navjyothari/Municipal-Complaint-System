const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const isAdmin = require('../middleware/isAdmin');

router.use(authenticate);
router.use(isAdmin);

router.get('/stats', adminController.getStats);
router.get('/complaints', adminController.getComplaints);
router.get('/departments', adminController.getDepartments);
router.post('/departments', adminController.createDepartment);

module.exports = router;
