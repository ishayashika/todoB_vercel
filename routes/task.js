import express from "express";
const router = express.Router();
import { createTask, deleteAll, deleteTask, getAllTaskUCreated, getCurrentUserTask, getDeletedTasks, upadateTask } from "../controllers/userTask.js";

router.post("/", createTask); //without createtask getCurrentUserTaskShow []
router.get("/all", getAllTaskUCreated)

router.get("/mytask", getCurrentUserTask);
router.get("/deleted", getDeletedTasks);

// This one for upadating task
router.put("/:taskId", upadateTask);

router.delete("/:taskId", deleteTask);
router.delete("/deleteAll", deleteAll);

export default router;