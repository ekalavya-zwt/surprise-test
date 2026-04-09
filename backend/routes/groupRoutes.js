const express = require("express");
const router = express.Router();
const groupcontroller = require("../controllers/groupController");

router.get("/", groupcontroller.fetchGroups);
router.get("/:id", groupcontroller.fetchGroup);
router.post("/", groupcontroller.createGroup);
router.get("/:id/expenses", groupcontroller.fetchExpenses);
router.get("/:id/balances", groupcontroller.fetchBalances);
router.post("/:id/expenses", groupcontroller.createExpense);
router.get(
  "/:id/settlements/suggest",
  groupcontroller.fetchSettlementSuggestions,
);

module.exports = router;
