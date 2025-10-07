import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

interface StudentType {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
}

function Pagination() {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(3);
  const [totalPages, setTotalPages] = useState<number>(1);

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

  // Load all students when page or limit changes
  useEffect(() => {
    fetchStudents();
  }, [currentPage, rowsPerPage]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${baseUrl}?page=${currentPage}&limit=${rowsPerPage}`);
      setStudents(res.data.students || res.data); // handle both paginated or non-paginated API
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast("error", "Failed to load students");
    }
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

  // Edit student (simple alert for demo)
  const handleEdit = (student: StudentType) => {
    Swal.fire({
      title: "Edit Student",
      html: `
        <input id="name" class="swal2-input" placeholder="Name" value="${student.name}">
        <input id="email" class="swal2-input" placeholder="Email" value="${student.email}">
        <input id="mobile" class="swal2-input" placeholder="Mobile" value="${student.mobile}">
        <input id="country" class="swal2-input" placeholder="Country" value="${student.country}">
        <input id="state" class="swal2-input" placeholder="State" value="${student.state}">
        <input id="district" class="swal2-input" placeholder="District" value="${student.district}">
      `,
      confirmButtonText: "Update",
      showCancelButton: true,
      preConfirm: () => {
        return {
          name: (document.getElementById("name") as HTMLInputElement).value,
          email: (document.getElementById("email") as HTMLInputElement).value,
          mobile: (document.getElementById("mobile") as HTMLInputElement).value,
          country: (document.getElementById("country") as HTMLInputElement).value,
          state: (document.getElementById("state") as HTMLInputElement).value,
          district: (document.getElementById("district") as HTMLInputElement).value,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed && result.value) {
        try {
          await axios.put(`${baseUrl}/${student._id}`, result.value);
          toast("success", "Student updated");
          fetchStudents();
        } catch {
          toast("error", "Update failed");
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

  // Pagination Controls
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Manage Students</h2>
        <div className="d-flex align-items-center gap-2">
          <label className="mb-0 fw-semibold">Rows per page:</label>
          <select
            className="form-select form-select-sm w-auto"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={9}>9</option>
          </select>
        </div>
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
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(student)}
                    >
                      Edit
                    </button>
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

      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={currentPage === 1}
          onClick={handlePrev}
        >
          <ChevronLeft size={16} /> Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={currentPage === totalPages}
          onClick={handleNext}
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
