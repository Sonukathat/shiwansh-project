import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import Select from "react-select";
import Swal from "sweetalert2";
import type { MultiValue, ActionMeta } from "react-select";

function MultiselectDropdown() {
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
  // Employee state
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

  interface LanguageOption {
    value: string;
    label: string;
  }

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
  const API_URL = "http://localhost:3000/api/employees";

  // Fetch all employees
  const fetchEmployees = async (): Promise<void> => {
    try {
      const res = await axios.get(API_URL);
      setEmployees(res.data.data);
    } catch (error) {
      const err = error as any;
      console.log("Failed to fetch employees:", err.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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

  // Handle multi-select change
  const handleSelectChange = (
    selected: MultiValue<LanguageOption>,
    _actionMeta: ActionMeta<LanguageOption>
  ): void => {
    setEmployee({ ...employee, language: selected ? selected.map((s) => s.label) : [] });
  };

  // Add or update employee
  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, employee);
        toast("success", "Employee updated successfully!");
        setEditingId(null);
      } else {
        await axios.post(API_URL, employee);
        toast("success", "Employee added successfully!");
      }
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
      fetchEmployees();
    } catch (error) {
      const err = error as any;
      toast("error", "Failed to add/update employee: " + (err.response?.data?.message || err.message));
    }
  };

  // Delete employee
  const handleDelete = async (id: string | undefined): Promise<void> => {
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
    } catch (error) {
      const err = error as any;
      toast("error", "Failed to delete employee: " + (err.response?.data?.message || err.message));
    }
  };

  // Edit employee
  const handleEdit = (emp: Employee): void => {
    setEmployee(emp);
    setEditingId(emp._id || null);
  };

  const languageOptions = [
    { value: "Hindi", label: "Hindi" },
    { value: "English", label: "English" },
    { value: "German", label: "German" },
    { value: "French", label: "French" },
    { value: "Spanish", label: "Spanish" },
  ];

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Employee</h2>

      <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light mb-4">
        <div className="row mb-3">
          <div className="col">
            <input type="text" name="name" placeholder="Enter Name" className="form-control" value={employee.name} onChange={handleChange} required />
          </div>
          <div className="col">
            <input type="email" name="email" placeholder="Enter Email" className="form-control" value={employee.email} onChange={handleChange} required />
          </div>
          <div className="col">
            <input type="text" name="mobile" placeholder="Enter Mobile" className="form-control" value={employee.mobile} onChange={handleChange} required />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col">
            <input type="text" name="country" placeholder="Enter Country" className="form-control" value={employee.country} onChange={handleChange} />
          </div>
          <div className="col">
            <input type="text" name="state" placeholder="Enter State" className="form-control" value={employee.state} onChange={handleChange} />
          </div>
          <div className="col">
            <input type="text" name="district" placeholder="Enter District" className="form-control" value={employee.district} onChange={handleChange} />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label d-block">Gender</label>
            {['Male','Female','Other'].map(g => (
              <div key={g} className="form-check form-check-inline">
                <input type="radio" name="gender" value={g} className="form-check-input" checked={employee.gender === g} onChange={handleChange} />
                <label className="form-check-label">{g}</label>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <label className="form-label">Languages</label>
            <Select
              options={languageOptions}
              isMulti
              isSearchable
              value={languageOptions.filter((opt: LanguageOption) => employee.language.includes(opt.label))}
              onChange={handleSelectChange}
              placeholder="Select languages..."
            />
          </div>

          <div className="col-md-4 d-flex align-items-end justify-content-end">
            <button type="submit" className="btn btn-primary w-100">{editingId ? "Update Employee" : "Add Employee"}</button>
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
          {employees.map((emp: Employee) => (
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

export default MultiselectDropdown;