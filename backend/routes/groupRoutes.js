const express = require("express");
const router = express.Router();
const groupcontroller = require("../controllers/groupController");

router.get("/:id", groupcontroller.fetchGroup);
router.post("/", groupcontroller.createGroup);
router.get("/:id/expenses", groupcontroller.fetchExpenses);
router.get("/:id/balances", groupcontroller.fetchBalances);
router.post("/:id/expenses", groupcontroller.createExpense);

module.exports = router;
