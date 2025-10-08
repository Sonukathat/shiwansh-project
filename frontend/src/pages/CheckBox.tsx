import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface EmployeeType {
  _id?: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
  gender: string;
  language: string;
}

function CheckBox() {
  const baseUrl = "http://localhost:5000/api/employees";

  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [formData, setFormData] = useState<EmployeeType>({
    name: "",
    email: "",
    mobile: "",
    country: "",
    state: "",
    district: "",
    gender: "Male",
    language: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

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

  // ✅ Load All Employees
  const loadEmployees = async () => {
    try {
      const res = await axios.get(baseUrl);
      setEmployees(res.data.employees || []);
    } catch (error) {
      toast("error", "Failed to load employees");
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      let langs = formData.language ? formData.language.split(", ") : [];
      if (checked) langs.push(value);
      else langs = langs.filter((l) => l !== value);
      setFormData({ ...formData, language: langs.join(", ") });
    } else if (type === "radio") {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Submit / Update Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${baseUrl}/${editingId}`, formData);
        toast("success", "Employee updated successfully");
      } else {
        await axios.post(baseUrl, formData);
        toast("success", "Employee added successfully");
      }
      setFormData({
        name: "",
        email: "",
        mobile: "",
        country: "",
        state: "",
        district: "",
        gender: "Male",
        language: "",
      });
      setEditingId(null);
      loadEmployees();
    } catch (error) {
      toast("error", "Operation failed");
    }
  };

  // ✅ Edit Employee
  const handleEdit = (emp: EmployeeType) => {
    setFormData(emp);
    setEditingId(emp._id || null);
  };

  // ✅ Delete Employee
  const handleDelete = async (id: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this employee!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`${baseUrl}/${id}`);
        toast("success", "Employee deleted successfully");
        loadEmployees();
      } catch (error) {
        toast("error", "Delete failed");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Employee</h2>

      {/* ✅ Form Section */}
      <form
        className="p-3 border rounded shadow-sm bg-light"
        onSubmit={handleSubmit}
      >
        {/* Row 1 */}
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Enter Mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Enter State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col">
            <input
              type="text"
              placeholder="Enter District"
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label d-block">Gender</label>
            {["Male", "Female", "Other"].map((g) => (
              <div className="form-check form-check-inline" key={g}>
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label className="form-check-label">{g}</label>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <label className="form-label d-block">Languages</label>
            {["Hindi", "English", "German"].map((lang) => (
              <div className="form-check form-check-inline" key={lang}>
                <input
                  type="checkbox"
                  value={lang}
                  checked={formData.language.includes(lang)}
                  onChange={handleChange}
                  className="form-check-input"
                />
                <label className="form-check-label">{lang}</label>
              </div>
            ))}
          </div>

          <div className="col-md-4 d-flex align-items-end justify-content-end">
            <button type="submit" className="btn btn-primary w-100">
              {editingId ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </div>
      </form>

      {/* ✅ Table Section */}
      <div className="mt-4">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Country</th>
              <th>State</th>
              <th>District</th>
              <th>Gender</th>
              <th>Language</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.mobile}</td>
                  <td>{emp.country}</td>
                  <td>{emp.state}</td>
                  <td>{emp.district}</td>
                  <td>{emp.gender}</td>
                  <td>{emp.language}</td>
                  <td className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => handleEdit(emp)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(emp._id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CheckBox;
