const {
  getGroup,
  createGroupWithMembers,
} = require("../services/groupService");

async function fetchGroup(req, res) {
  try {
    const group = await getGroup(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (err) {
    console.error("Error fetching group:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function createGroup(req, res) {
  try {
    const { name, description, members } = req.body;

    if (!name || !members || !Array.isArray(members) || members.length === 0) {
      return res.status(400).json({
        message:
          "Group name and at least one member is required, and members must be a non-empty array",
      });
    }

    for (const member of members) {
      if (!member.name || !member.email || !member.phone) {
        return res.status(400).json({
          message: "Each member must have name, email, and phone",
        });
      }
    }

    const groupData = { name, description };
    const membersData = members.map((member) => ({
      name: member.name,
      email: member.email,
      phone: member.phone,
    }));

    const result = await createGroupWithMembers(groupData, membersData);

    res.status(201).json({
      message: "Group created successfully",
      result,
    });
  } catch (err) {
    console.error("Error creating group:", err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "A member with this email already exists",
      });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { fetchGroup, createGroup };
