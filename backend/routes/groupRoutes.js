const express = require("express");
const router = express.Router();
const controller = require("../controllers/groupController");

router.get("/:id", controller.fetchGroup);
router.post("/", controller.createGroup);
router.post("/:id/expenses", controller.createExpense);

module.exports = router;
