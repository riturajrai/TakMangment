const express = require('express');
const Task = require('../models/Task');
const router = express.Router();
const { authenticateToken } = require('../../auth-service/middleware/auth');

// Create a new task
router.post('/create-task', authenticateToken, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            createdBy: req.user.userId  
        });
        await task.save();
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all tasks with pagination
router.get('/tasks', authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const tasks = await Task.find({ createdBy: req.user.userId })
            .limit(limit * 1)
            .skip((page - 1) * limit);
        const count = await Task.countDocuments({ createdBy: req.user.userId });
        res.json({
            tasks,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page)
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get single task by ID
router.get('/task/:id', authenticateToken, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, createdBy: req.user.userId });
        if (!task) return res.status(404).json({ message: "Task not found" });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

  
// Update a task by ID
router.put('/update-task/:id', authenticateToken, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.userId },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task updated successfully", updatedTask });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a task by ID
router.delete('/delete-task/:id', authenticateToken, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user.userId });
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update task status
router.patch('/update-task/status/:id', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.userId },
            { status, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Task status updated", updatedTask });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update task priority
router.patch('/update-task/priority/:id', authenticateToken, async (req, res) => {
    try {
        const { priority } = req.body;
        const updatedTask = await Task.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.userId },
            { priority, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.json({ message: "Priority updated", updatedTask });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
