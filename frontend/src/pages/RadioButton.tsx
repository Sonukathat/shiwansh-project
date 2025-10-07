import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface StudentType {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
  gender: "Male" | "Female" | "Other";
}

function RadioButton() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [students, setStudents] = useState<StudentType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const baseUrl = "http://localhost:3000/api/students";

  useEffect(() => {
    loadStudents();
  }, []);

  // Load all students
  const loadStudents = () => {
    axios
      .get<StudentType[]>(baseUrl)
      .then((res) => setStudents(res.data))
      .catch(() => console.error("Failed to load students"));
  };

  // Toast helper
  const toast = (icon: "success" | "error" | "warning", title: string) => {
    Swal.fire({
      toast: true,
      position: "top-end",
      icon,
      title,
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  };

  // Add or Update student
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !mobile || !country || !stateName || !district || !gender) {
      toast("warning", "All fields are required");
      return;
    }

    const payload = { name, email, mobile, country, state: stateName, district, gender };

    if (editingId) {
      // Update student
      axios
        .put(`${baseUrl}/${editingId}`, payload)
        .then(() => {
          toast("success", "Student updated");
          resetForm();
          loadStudents();
        })
        .catch(() => toast("error", "Update failed"));
    } else {
      // Add student
      axios
        .post(baseUrl, payload)
        .then(() => {
          toast("success", "Student added");
          resetForm();
          loadStudents();
        })
        .catch(() => toast("error", "Add failed"));
    }
  };

  // Edit student
  const handleEdit = (student: StudentType) => {
    setName(student.name);
    setEmail(student.email);
    setMobile(student.mobile);
    setCountry(student.country);
    setStateName(student.state);
    setDistrict(student.district);
    setGender(student.gender);
    setEditingId(student._id);
  };

  // Delete student
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete this student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseUrl}/${id}`)
          .then(() => {
            toast("success", "Student deleted");
            loadStudents();
          })
          .catch(() => toast("error", "Delete failed"));
      }
    });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMobile("");
    setCountry("");
    setStateName("");
    setDistrict("");
    setGender("Male");
    setEditingId(null);
  };

  return (
    <div className="container">
      <h2>Manage Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Enter Mobile"
              className="form-control"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Country"
              className="form-control"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Enter State"
              className="form-control"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Enter District"
              className="form-control"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            Gender:{" "}
            <input
              type="radio"
              name="gender"
              value="Male"
              checked={gender === "Male"}
              onChange={() => setGender("Male")}
            />{" "}
            Male{" "}
            <input
              type="radio"
              name="gender"
              value="Female"
              checked={gender === "Female"}
              onChange={() => setGender("Female")}
            />{" "}
            Female{" "}
            <input
              type="radio"
              name="gender"
              value="Other"
              checked={gender === "Other"}
              onChange={() => setGender("Other")}
            />{" "}
            Other
          </div>
        </div>

        <div className="row mb-3 text-center">
          <div className="col">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Student" : "Add Student"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <h4>Students List</h4>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Country</th>
            <th>State</th>
            <th>District</th>
            <th>Gender</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.mobile}</td>
              <td>{s.country}</td>
              <td>{s.state}</td>
              <td>{s.district}</td>
              <td>{s.gender}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(s)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(s._id)}
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

export default RadioButton;
