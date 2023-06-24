//package import
const mongoose = require("mongoose");

//model import
const { TaskModel, TASK_STATUS } = require("../models/task.model");
const { UserModel, USER_STATUS } = require("../models/user.model");

/**
 * @description To add new todo
 * @param {object} todoData
 * @param {string} [todoData.description]
 * @param {string} [todoData.userId]
 * @returns {object} added todo details
 */

const addNewTodo = async (todoData) => {
  const { description, userId, title } = todoData;
  if (!title) throw new Error("title is required");
  if (!description) throw new Error("todo description is required");
  const addTodo = await TaskModel.create({
    description,
    title,
    user: userId,
  });
  console.log("NEW TODO ADDED", addTodo);
  return addTodo;
};

/**
 * @description To edit todo
 * @param {object} todoData
 * @param {string} [todoData.todoId]
 * @param {string} [todoData.description]
 * @param {string} [todoData.userId]
 * @param {string} [todoData.status]
 * @returns {object} updated todo data
 */

const editTodo = async (todoData) => {
  let { description, userId, todoId, status, title } = todoData;
  if (!todoId) throw new Error("todoId is required");
  const isTodo = await TaskModel.countDocuments({
    _id: new mongoose.Types.ObjectId(todoId),
    user: new mongoose.Types.ObjectId(userId),
  });
  if (isTodo <= 0) throw new Error("Todo not exist");
  if (!status) status = TASK_STATUS.INPROGRESS;
  if (status === TASK_STATUS.DELETED) throw new Error("You cannot delete todo");
  const updateData = {
    status,
  };
  if (description) updateData.description = description;
  if (title) updateData.title = title;
  const editedTaskData = await TaskModel.findOneAndUpdate(
    { _id: new mongoose.Types.ObjectId(todoId) },
    updateData,
    {
      new: true,
    }
  );
  return editedTaskData;
};

/**
 * @description To delete todo
 * @param {string} todoId
 * @param {string} userId
 */
const deleteTodo = async (todoId, userId) => {
  if (!todoId) throw new Error("todoId is required");
  const deletedtodoData = await TaskModel.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(todoId),
      user: new mongoose.Types.ObjectId(userId),
    },
    { status: TASK_STATUS.DELETED },
    { new: true }
  );
  if (deletedtodoData.status !== TASK_STATUS.DELETED)
    throw new Error("todo is not deleted");
  return deletedtodoData;
};

/**
 * @description To view all todo
 * @param {string} userId
 * @returns {object[]} All Todos
 */

const viewAllTodo = async (userId) => {
  if (!userId) throw new Error("userId is required");
  const viewAllTodos = await TaskModel.find({
    userId: new mongoose.Types.ObjectId(userId),
    status: { $in: [TASK_STATUS.INPROGRESS, TASK_STATUS.COMPLETED] },
  });
  return viewAllTodos;
};

/**
 * @description To view single todo
 * @param {string} userId
 * @param {string} todoId
 * @returns {object} selected Todo
 */

const viewTodo = async (userId, todoId) => {
  if (!todoId) throw new Error("todoId is required");

  const selectedTodo = await TaskModel.findOne({
    _id: new mongoose.Types.ObjectId(todoId),
    user: new mongoose.Types.ObjectId(userId),
    status: { $in: [TASK_STATUS.INPROGRESS, TASK_STATUS.COMPLETED] },
  });
  if (!selectedTodo) throw new Error("todo not exist");
  return selectedTodo;
};

module.exports = {
  addNewTodo,
  editTodo,
  deleteTodo,
  viewAllTodo,
  viewTodo,
};
