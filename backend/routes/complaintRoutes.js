const router = require("express").Router();
const ctrl = require("../controllers/complaintController");
const { verifyToken } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.post("/", verifyToken, ctrl.createComplaint);
router.get("/my", verifyToken, ctrl.getMyComplaints);
router.get("/", verifyToken, isAdmin, ctrl.getAllComplaints);
router.put("/:id/status", verifyToken, isAdmin, ctrl.updateStatus);

module.exports = router;