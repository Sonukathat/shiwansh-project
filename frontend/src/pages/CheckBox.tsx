import React, { useState } from "react";
import axios from "axios";

interface Employee {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/employees", employee);
      alert("Employee added successfully!");
      console.log(res.data);
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
    } catch (error: any) {
      alert("Failed to add employee: " + error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Manage Employee</h2>
      <form onSubmit={handleSubmit} className="p-3 border rounded shadow-sm bg-light">
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              className="form-control"
              value={employee.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              className="form-control"
              value={employee.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="mobile"
              placeholder="Enter Mobile"
              className="form-control"
              value={employee.mobile}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              name="country"
              placeholder="Enter Country"
              className="form-control"
              value={employee.country}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="state"
              placeholder="Enter State"
              className="form-control"
              value={employee.state}
              onChange={handleChange}
            />
          </div>
          <div className="col">
            <input
              type="text"
              name="district"
              placeholder="Enter District"
              className="form-control"
              value={employee.district}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Row 3 */}
        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label d-block">Gender</label>
            {["Male", "Female", "Other"].map((g) => (
              <div key={g} className="form-check form-check-inline">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  className="form-check-input"
                  checked={employee.gender === g}
                  onChange={handleChange}
                />
                <label className="form-check-label">{g}</label>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <label className="form-label d-block">Languages</label>
            {["Hindi", "English", "German"].map((lang) => (
              <div key={lang} className="form-check form-check-inline">
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={lang}
                  checked={employee.language.includes(lang)}
                  onChange={handleChange}
                />
                <label className="form-check-label">{lang}</label>
              </div>
            ))}
          </div>

          <div className="col-md-4 d-flex align-items-end justify-content-end">
            <button type="submit" className="btn btn-primary w-100">
              Add Employee
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CheckBox;
