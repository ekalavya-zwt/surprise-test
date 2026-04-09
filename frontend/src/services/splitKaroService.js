import api from "../api/splitKaroAPI";

const getGroups = async () => {
  try {
    const response = await api.get("/groups");
    return response.data;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
};

const getGroup = async (groupId) => {
  try {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching group:", error);
    throw error;
  }
};

const createGroup = async (groupData) => {
  try {
    const response = await api.post("/groups", groupData);
    return response.data;
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};

const createExpense = async (expenseData) => {
  try {
    const response = await api.post("/expenses", expenseData);
    return response.data;
  } catch (error) {
    console.error("Error adding expense:", error);
    throw error;
  }
};

const getExpenses = async (groupId) => {
  try {
    const response = await api.get(`/groups/${groupId}/expenses`);
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
};

const deleteExpense = async (expenseId) => {
  try {
    await api.delete(`/expenses/${expenseId}`);
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
};

const getBalances = async (groupId) => {
  try {
    const response = await api.get(`/groups/${groupId}/balances`);
    return response.data;
  } catch (error) {
    console.error("Error fetching balances:", error);
    throw error;
  }
};

export {
  getGroups,
  getGroup,
  createGroup,
  createExpense,
  getExpenses,
  deleteExpense,
  getBalances,
};
