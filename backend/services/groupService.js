const {
  Expenses,
  Groups,
  Members,
  ExpenseSplits,
  sequelize,
} = require("../models");

async function getGroup(groupId) {
  return await Groups.findByPk(groupId, {
    attributes: ["id", "name", "description"],
    include: {
      model: Members,
      as: "members",
      attributes: ["id", "name", "email", "phone"],
      separate: true,
      order: [["id", "ASC"]],
    },
  });
}

// Request body example (Equal):
// {
//   "paid_by": 1,
//   "amount": "Hotel booking",
//   "description": "100.00",
//   "split_type": "equal",
//   "date": "2026-06-01",
//   "splits": [
//     { "member_id": 1 },

async function createGroupWithMembers(groupData, membersData) {
  const transaction = await sequelize.transaction();

  try {
    const group = await Groups.create(groupData, { transaction });

    const members = await Promise.all(
      membersData.map((memberData) =>
        Members.create({ ...memberData, groupId: group.id }, { transaction }),
      ),
    );

    await transaction.commit();

    return {
      group,
      members,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = { getGroup, createGroupWithMembers };
