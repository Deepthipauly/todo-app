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
router.route("/edit_todo").post(taskController.editTaskController);

// delete task
router.route("/delete_todo").delete(taskController.deleteTaskController);

module.exports = router;