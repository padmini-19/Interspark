const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const protect = require('../middleware/authMiddleware');

// Protect all routes below this line with our auth middleware
router.use(protect);

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
router.get('/', async (req, res, next) => {
  try {
    // Convert ID to a string to ensure flawless Mongoose querying
    const userId = req.user._id.toString();
    const tasks = await Task.find({ user: userId });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

// @desc    Create a new task
// @route   POST /api/tasks
router.post('/', async (req, res, next) => {
  const { title } = req.body;

  if (!title) {
    res.status(400);
    return next(new Error('Please add a task title'));
  }

  try {
    // Explicitly attach the string version of the authenticated user's ID
    const task = await Task.create({
      user: req.user._id.toString(),
      title,
      description: "" // Fallback description field in case your model requires it
    });
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

// @desc    Update a task status or content
// @route   PUT /api/tasks/:id
router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('User not authorized'));
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      return next(new Error('Task not found'));
    }

    if (task.user.toString() !== req.user._id.toString()) {
      res.status(401);
      return next(new Error('User not authorized'));
    }

    await task.deleteOne();
    res.json({ id: req.params.id, message: 'Task removed successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;