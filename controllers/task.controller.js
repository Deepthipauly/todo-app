const {
  addNewTodo,
  editTodo,
  deleteTodo,
  viewAllTodo,
  viewTodo,
} = require("../service/task.service");

// controller for adding todo
const addTaskController = async (req, res) => {
  console.log("START: addTaskController");
  try {
    req.body.userId = req.userId;
    const addNewTask = await addNewTodo(req.body);
    return res.status(201).json({
      data: addNewTask,
      message: "Todo is added",
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

// controller for editing todo
const editTaskController = async (req, res) => {
  console.log("START: editTaskController");
  try {
    req.body.todoId = req.params.todoId;
    req.body.userId = req.userId;
    const editedTask = await editTodo(req.body);
    return res.status(201).json({
      data: editedTask,
      message: "Todo updated",
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

// controller for deleting todo
const deleteTaskController = async (req, res) => {
  console.log("START: deleteTaskController");
  try {
    await deleteTodo(req.params.todoId, req.userId);
    return res.status(200).json({
      data: [],
      message: "Todo deleted",
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

// controller for fetching all todos
const allTaskController = async (req, res) => {
  console.log("START: allTaskController");

  try {
    const fetchAllTask = await viewAllTodo(req.userId);
    return res.status(200).json({
      data: fetchAllTask,
      message: "All Todos fetched successfully",
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

// controller for fetching single todo
const viewSingleTaskController = async (req, res) => {
  console.log("START: viewSingleTaskController");

  try {
    const viewSingleTask = await viewTodo(req.params.todoId, req.userId);
    return res.status(200).json({
      data: viewSingleTask,
      message: "Single Todo fetched",
    });
  } catch (e) {
    return res.status(400).json({ error: e.message || "something went wrong" });
  }
};

module.exports = {
  addTaskController,
  editTaskController,
  deleteTaskController,
  allTaskController,
  viewSingleTaskController,
};
