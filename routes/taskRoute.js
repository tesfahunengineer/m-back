const express = require("express");
const Task = require("../database/Schema/taskSchema");
const Project = require("../database/Schema/projectSchema");
const router = express.Router();

// Create a new task
router.post("/", async (req, res) => {
  const { project, name, description, start_date, end_date, status } = req.body;
  try {
    const newTask = new Task({
      project,
      name,
      description,
      start_date,
      end_date,
      status,
    });
    await newTask.save();

    // Add task to project
    const projectDoc = await Project.findById(project);
    projectDoc.tasks.push(newTask._id);
    await projectDoc.save();

    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().populate("project");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project");
    res.json(task);
  } catch (err) {
    res.status(404).json({ message: "Task not found" });
  }
});

module.exports = router;
