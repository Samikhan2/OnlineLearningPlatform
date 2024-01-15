const express = require('express');
const router = express.Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');

// Create a new course
router.post('/create', auth(['teacher']), async (req, res) => {
  try {
    const { title, url, description, teacher, duration } = req.body;
    const teacherId = req.user.id; 

    const newCourse = new Course({
        title, 
        url, 
        description, 
        teacher: teacherId, 
        duration
    });

    await newCourse.save();

    res.json({ msg: 'Course created successfully', course: newCourse });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update a course
router.put('/update-course/:courseId', auth(['teacher']), async (req, res) => {
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

    res.json({ msg: 'Course updated successfully', course });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

/**
 * @route DELETE /api/v1/teacher
 * @desc log in teacher
 * @access private
 */
// Delete a course
router.delete('/delete-course/:courseId', auth(['teacher']), async (req, res) => {
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

// Get all courses created by the logged-in teacher
router.get('/my-courses', auth(['teacher']), async (req, res) => {
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
