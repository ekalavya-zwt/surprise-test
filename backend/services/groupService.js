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

function equalSplitAmount(totalAmount, memberCount) {
  const baseShare = Math.floor(totalAmount / memberCount);
  const remainder = totalAmount - baseShare * memberCount;

  return Array.from(
    { length: memberCount },
    (_, index) => baseShare + (index < remainder ? 1 : 0),
  );
}

async function createExpenseForGroup(groupId, expenseData) {
  const { paid_by, amount, description, split_type, date } = expenseData;

  if (!paid_by || !amount || !description || !split_type || !date) {
    throw {
      status: 400,
      message:
        "paid_by, amount, description, split_type, and date are required",
    };
  }

  if (split_type !== "equal") {
    throw {
      status: 400,
      message: "Only split_type 'equal' is supported",
    };
  }

  const group = await Groups.findByPk(groupId, {
    include: {
      model: Members,
      as: "members",
      attributes: ["id", "name"],
      separate: true,
      order: [["id", "ASC"]],
    },
  });

  if (!group) {
    throw { status: 404, message: "Group not found" };
  }

  const members = group.members;
  if (!members || members.length === 0) {
    throw {
      status: 400,
      message: "Group must have members before adding expenses",
    };
  }

  const payerId = Number(paid_by);
  if (!members.some((member) => member.id === payerId)) {
    throw {
      status: 400,
      message: "paid_by must be a valid member of the group",
    };
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    throw { status: 400, message: "Invalid date format" };
  }

  const totalAmount = Math.round(Number(amount) * 100);
  if (totalAmount <= 0) {
    throw { status: 400, message: "Amount must be greater than 0" };
  }

  const sharedAmount = equalSplitAmount(totalAmount, members.length);

  return await sequelize.transaction(async (transaction) => {
    const expense = await Expenses.create(
      {
        groupId,
        paidBy: payerId,
        amount,
        description,
        splitType: split_type,
        date: parsedDate,
      },
      { transaction },
    );

    const splitsData = members.map((member, index) => ({
      expenseId: expense.id,
      memberId: member.id,
      amountOwed: (sharedAmount[index] / 100).toFixed(2),
    }));

    await ExpenseSplits.bulkCreate(splitsData, { transaction });

    return {
      expense,
      splitsData,
    };
  });
}

module.exports = {
  getGroup,
  createGroupWithMembers,
  createExpenseForGroup,
};
