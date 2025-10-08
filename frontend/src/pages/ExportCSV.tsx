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

function ExportCSV() {
  const [students, setStudents] = useState<StudentType[]>([]);
  const baseUrl = "http://localhost:3000/api/students"; // your backend API

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

  // Load all students
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(baseUrl);
      setStudents(res.data.students || res.data);
    } catch (err) {
      toast("error", "Failed to fetch students");
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (students.length === 0) {
      toast("warning", "No data to export");
      return;
    }

    const headers = ["Name", "Email", "Mobile", "Country", "State", "District"];
    const csvRows = [headers.join(",")];

    students.forEach((s) => {
      const row = [
        `"${s.name}"`,
        `"${s.email}"`,
        `"${s.mobile}"`,
        `"${s.country}"`,
        `"${s.state}"`,
        `"${s.district}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "students.csv";
    link.click();

    URL.revokeObjectURL(url);
    toast("success", "CSV Exported Successfully");
  };

  // Delete student
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete this student?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${baseUrl}/${id}`);
          toast("success", "Student deleted");
          fetchStudents();
        } catch {
          toast("error", "Delete failed");
        }
      }
    });
  };

  // View student
  const handleView = (student: StudentType) => {
    Swal.fire({
      title: "Student Details",
      html: `
        <b>Name:</b> ${student.name}<br/>
        <b>Email:</b> ${student.email}<br/>
        <b>Mobile:</b> ${student.mobile}<br/>
        <b>Country:</b> ${student.country}<br/>
        <b>State:</b> ${student.state}<br/>
        <b>District:</b> ${student.district}
      `,
    });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Manage Students</h2>
        <button
          className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 shadow-sm rounded-pill"
          onClick={handleExportCSV}
        >
          <i className="bi bi-download"></i> Export CSV
        </button>
      </div>

      <div className="row mb-3">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
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
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id}>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.mobile}</td>
                  <td>{student.country}</td>
                  <td>{student.state}</td>
                  <td>{student.district}</td>
                  <td className="d-flex gap-2">
                    <button className="btn btn-primary btn-sm">Edit</button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(student._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleView(student)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExportCSV;
