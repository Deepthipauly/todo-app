// package import
const express = require("express");

// file import
const taskController = require("../controllers/task.controller");
const { verifyToken } = require("../middleware/token");


const router = express.Router();

router.use(verifyToken)

// add task
router.route("/add_todo").post(taskController.addTaskController);

// edit task
router.route("/edit_todo/:todoId").patch(taskController.editTaskController);

// delete task
router.route("/delete_todo/:todoId").delete(taskController.deleteTaskController);

// get all todo
router.route("/all_todo").get(taskController.allTaskController);

// view single todo
router.route("/view_todo/:todoId").get(taskController.viewSingleTaskController);



module.exports = router;