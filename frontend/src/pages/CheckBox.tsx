import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Employee {
  _id?: string;
  name: string;
  email: string;
  mobile: string;
  country: string;
  state: string;
  district: string;
  gender: string;
  language: string[];
}

function CheckBox() {
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
  const [employee, setEmployee] = useState<Employee>({
    name: "",
    email: "",
    mobile: "",
    country: "",
    state: "",
    district: "",
    gender: "Male",
    language: [],
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const API_URL = "http://localhost:3000/api/employees"; // backend URL

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data.data);
    } catch (error: any) {
      console.log("Failed to fetch employees:", error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      let newLanguages = [...employee.language];
      if (checked) {
        newLanguages.push(value);
      } else {
        newLanguages = newLanguages.filter((lang) => lang !== value);
      }
      setEmployee({ ...employee, language: newLanguages });
    } else if (type === "radio") {
      setEmployee({ ...employee, [name]: value });
    } else {
      setEmployee({ ...employee, [name]: value });
    }
  };

  // Add or update employee
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // UPDATE
        await axios.put(`${API_URL}/${editingId}`, employee);
        toast("success", "Employee updated successfully!");
        setEditingId(null);
      } else {
        // CREATE
        await axios.post(API_URL, employee);
        toast("success", "Employee added successfully!");
      }
      // Reset form
      setEmployee({
        name: "",
        email: "",
        mobile: "",
        country: "",
        state: "",
        district: "",
        gender: "Male",
        language: [],
      });
      fetchEmployees(); // Refresh table
    } catch (error: any) {
      toast("error", "Failed to add/update employee: " + (error.response?.data?.message || error.message));
    }
  };

  // Delete employee
  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      toast("success", "Employee deleted successfully!");
      fetchEmployees();
    } catch (error: any) {
      toast("error", "Failed to delete employee: " + (error.response?.data?.message || error.message));
    }
  };

  // Edit employee
  const handleEdit = (emp: Employee) => {
    setEmployee(emp);
    setEditingId(emp._id || null);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Employee</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light mb-4">
        <div className="row mb-3">
          <div className="col-12 col-sm-6 col-md-4 mb-2">
            <input type="text" name="name" placeholder="Enter Name" className="form-control"
              value={employee.name} onChange={handleChange} required />
          </div>
          <div className="col-12 col-sm-6 col-md-4 mb-2">
            <input type="email" name="email" placeholder="Enter Email" className="form-control"
              value={employee.email} onChange={handleChange} required />
          </div>
          <div className="col-12 col-sm-6 col-md-4 mb-2">
            <input type="text" name="mobile" placeholder="Enter Mobile" className="form-control"
              value={employee.mobile} onChange={handleChange} required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-12 col-sm-6 col-md-4 mb-2">
            <input type="text" name="country" placeholder="Enter Country" className="form-control"
              value={employee.country} onChange={handleChange} />
          </div>
          <div className="col-12 col-sm-6 col-md-4 mb-2">
            <input type="text" name="state" placeholder="Enter State" className="form-control"
              value={employee.state} onChange={handleChange} />
          </div>
          <div className="col-12 col-sm-6 col-md-4 mb-2">
            <input type="text" name="district" placeholder="Enter District" className="form-control"
              value={employee.district} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label d-block">Gender</label>
            {["Male","Female","Other"].map(g => (
              <div key={g} className="form-check form-check-inline">
                <input type="radio" name="gender" value={g} className="form-check-input"
                  checked={employee.gender === g} onChange={handleChange} />
                <label className="form-check-label">{g}</label>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <label className="form-label d-block">Languages</label>
            {["Hindi","English","German"].map(lang => (
              <div key={lang} className="form-check form-check-inline">
                <input type="checkbox" className="form-check-input" value={lang}
                  checked={employee.language.includes(lang)} onChange={handleChange} />
                <label className="form-check-label">{lang}</label>
              </div>
            ))}
          </div>

          <div className="col-12 col-md-4 d-flex align-items-end justify-content-end">
            <button type="submit" className="btn btn-primary w-100 btn-mobile-full">
              {editingId ? "Update Employee" : "Add Employee"}
            </button>
          </div>
        </div>
      </form>

      {/* Employees Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Mobile</th><th>Country</th>
            <th>State</th><th>District</th><th>Gender</th><th>Languages</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp._id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.mobile}</td>
              <td>{emp.country}</td>
              <td>{emp.state}</td>
              <td>{emp.district}</td>
              <td>{emp.gender}</td>
              <td>{emp.language.join(", ")}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(emp)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(emp._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default CheckBox;
