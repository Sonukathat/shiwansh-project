import { useState, useEffect } from "react";
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
}

function Searching() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mobile, setMobile] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  const [students, setStudents] = useState<StudentType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const baseUrl = "http://localhost:3000/api/students"; // backend endpoint

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

  // Load all students initially
  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    axios
      .get<StudentType[]>(baseUrl)
      .then((res) => setStudents(res.data))
      .catch(() => toast("error", "Failed to load students"));
  };

  // Search handler
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params: any = {};
    if (name) params.name = name;
    if (email) params.email = email;
    if (mobile) params.mobile = mobile;
    if (country) params.country = country;
    if (stateName) params.state = stateName;
    if (district) params.district = district;

    axios
      .get<StudentType[]>(`${baseUrl}/search`, { params })
      .then((res) => {
        setStudents(res.data);
        if (res.data.length === 0) toast("warning", "No students found");
      })
      .catch(() => toast("error", "Search failed"));
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
            setStudents(students.filter((s) => s._id !== id));
          })
          .catch(() => toast("error", "Delete failed"));
      }
    });
  };

  // Edit student
  const handleEdit = (student: StudentType) => {
    setName(student.name);
    setEmail(student.email);
    setMobile(student.mobile);
    setCountry(student.country);
    setStateName(student.state);
    setDistrict(student.district);
    setEditingId(student._id);
  };

  // Update student
  const handleUpdate = () => {
    if (!editingId) return;

    const updatedData = { name, email, mobile, country, state: stateName, district };

    axios
      .put(`${baseUrl}/${editingId}`, updatedData)
      .then(() => {
        toast("success", "Student updated");
        resetForm();
        loadStudents();
      })
      .catch(() => toast("error", "Update failed"));
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMobile("");
    setCountry("");
    setStateName("");
    setDistrict("");
    setEditingId(null);
  };

  return (
    <div className="container">
      <h2>Search & Manage Students</h2>
      <form onSubmit={handleSearch}>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Enter Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Enter Mobile"
              className="form-control"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
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
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Enter State"
              className="form-control"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Enter District"
              className="form-control"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </div>
        </div>

        <div className="row mb-3 text-center">
          <div className="col">
            <button type="submit" className="btn btn-primary me-2">
              Advance Search
            </button>
            {editingId && (
              <>
                <button
                  type="button"
                  className="btn btn-success me-2"
                  onClick={handleUpdate}
                >
                  Update Student
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        <div className="row mb-3">
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Country</th>
                <th>State</th>
                <th>District</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    No data
                  </td>
                </tr>
              ) : (
                students.map((s) => (
                  <tr key={s._id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.mobile}</td>
                    <td>{s.country}</td>
                    <td>{s.state}</td>
                    <td>{s.district}</td>
                    <td>
                      <button
                        className="btn btn-warning me-2"
                        onClick={() => handleEdit(s)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleDelete(s._id)}
                      >
                        Delete
                      </button>
                      <button className="btn btn-info">View</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
}

export default Searching;
