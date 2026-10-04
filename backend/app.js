const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Student = require("./models/Student");

const app = express();

const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/studentDB")
    .then(function() {
        console.log("MongoDB connected successfully");
    })
    .catch(function(error) {
        console.log("MongoDB connection error:", error);
    });

// Test route
app.get("/", function(req, res) {
    res.json({
        message: "Student Management API is running"
    });
});

// Add a new student
app.post("/students", async function(req, res) {
    try {
        const student = new Student({
            name: req.body.name,
            email: req.body.email,
            course: req.body.course,
            semester: req.body.semester
        });

        const savedStudent = await student.save();

        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({
            message: "Failed to add student",
            error: error.message
        });
    }
});

// Get all students
app.get("/students", async function(req, res) {
    try {
        const students = await Student.find();

        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch students",
            error: error.message
        });
    }
});

// Get one student by ID
app.get("/students/:id", async function(req, res) {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);
    } catch (error) {
        res.status(400).json({
            message: "Invalid student ID",
            error: error.message
        });
    }
});

// Update a student
app.put("/students/:id", async function(req, res) {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                course: req.body.course,
                semester: req.body.semester
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({
            message: "Failed to update student",
            error: error.message
        });
    }
});

// Delete a student
app.delete("/students/:id", async function(req, res) {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully",
            student: deletedStudent
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete student",
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, function() {
    console.log(`Server is running on http://localhost:${PORT}`);
});