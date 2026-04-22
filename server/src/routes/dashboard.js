const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/summary', dashboardController.getSummary);
router.get('/complaints', dashboardController.getUserComplaints);

module.exports = router;
