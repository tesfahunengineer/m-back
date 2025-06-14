const express = require("express");
const Project = require("../database/Schema/projectSchema");
const router = express.Router();

// Create a new project
router.post("/", async (req, res) => {
  const { name, description, start_date, end_date, status } = req.body;
  try {
    const newProject = new Project({
      name,
      description,
      start_date,
      end_date,
      status,
    });
    await newProject.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all projects
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().populate("tasks");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific project
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("tasks");
    res.json(project);
  } catch (err) {
    res.status(404).json({ message: "Project not found" });
  }
});

module.exports = router;
