import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        course: "",
        semester: ""
    });
    const [editId, setEditId] = useState(null);

    const fetchStudents = async () => {
        const response = await fetch("http://localhost:3000/students");
        const data = await response.json();
        setStudents(data);
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const url = editId
            ? `http://localhost:3000/students/${editId}`
            : "http://localhost:3000/students";

        const method = editId ? "PUT" : "POST";

        await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...formData,
                semester: Number(formData.semester)
            })
        });

        setFormData({
            name: "",
            email: "",
            course: "",
            semester: ""
        });

        setEditId(null);
        fetchStudents();
    };

    const handleEdit = (student) => {
        setEditId(student._id);

        setFormData({
            name: student.name,
            email: student.email,
            course: student.course,
            semester: student.semester
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        await fetch(`http://localhost:3000/students/${id}`, {
            method: "DELETE"
        });

        fetchStudents();
    };

    return (
        <div className="container">
            <h1>Student Management System</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Student Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="course"
                    placeholder="Course"
                    value={formData.course}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="semester"
                    placeholder="Semester"
                    value={formData.semester}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    {editId ? "Update Student" : "Add Student"}
                </button>
            </form>

            <h2>Student Records</h2>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Course</th>
                        <th>Semester</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {students.map((student) => (
                        <tr key={student._id}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.course}</td>
                            <td>{student.semester}</td>

                            <td>
                                <button
                                    onClick={() => handleEdit(student)}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(student._id)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;