const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Course = require('../models/course');
const auth = require('../middleware/auth');


/**
 * @route POST /api/v1/auth
 * @desc POST create a new course
 * @access private
 */
router.post('/create', auth, [
  // Validation middleware
  check('title', 'Title is required').not().isEmpty(),
  check('url', 'Invalid URL').isURL(),
  check('description', 'Description is required').not().isEmpty(),
  check('duration', 'Duration must be a number').optional().isNumeric(),
], async (req, res) => {
  try {
    // Check if the user is a teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ msg: 'Only teachers can create courses.' });
    }

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Destructure required fields from the request body
    const { title, url, description, duration } = req.body;

    // Create a new course object
    const newCourse = new Course({
      title,
      url,
      description,
      teacher: req.user.username,
      duration,
    });

    // Save the course to the database
    await newCourse.save();

    res.status(201).json({ msg: 'Course created successfully.', course: newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
});

/**
 * @route PUT /api/teacher
 * @desc Update a course
 * @access private
 */
router.put('/update-course/:courseId', auth, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { title, url, description, teacher, duration } = req.body;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if the logged-in teacher is the owner of the course
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Permission denied. You are not the owner of this course' });
    }

    // Update the course
    course.title = title;
    course.description = description;
    course.url = url;
    course.teacher = teacher;
    course.duration = duration;
    await course.save();

    res.json({ msg: 'Course updated successfully'});
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route DELETE /api/v1/teacher
 * @desc DELETE a course
 * @access private
 */
// Delete a course
router.delete('/delete-course/:courseId', auth, async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }

    // Check if the logged-in teacher is the owner of the course
    if (course.teacher.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Permission denied. You are not the owner of this course' });
    }

    // Delete the course
    await course.remove();

    res.json({ msg: 'Course deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route GET /api/teacher
 * @desc Get all courses created by the logged-in teacher
 * @access private
 */

router.get('/my-courses', auth, async (req, res) => {
  try {
    const teacherId = req.user.id;

    // Retrieve courses created by the teacher
    const courses = await Course.find({ teacher: teacherId });

    res.json({ courses });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
