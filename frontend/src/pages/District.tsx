import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface DistrictType {
  _id: string;
  country: string;
  state: string;
  district: string;
}

function District() {
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [districtName, setDistrictName] = useState("");
  const [districts, setDistricts] = useState<DistrictType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const baseUrl = "http://localhost:3000/api/districts";

  useEffect(() => {
    loadDistricts();
  }, []);

  // Load all districts
  const loadDistricts = () => {
    axios
      .get<DistrictType[]>(baseUrl)
      .then((res) => setDistricts(res.data))
      .catch(() => console.error("Failed to load districts"));
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

  // Add or Update district
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!country || !stateName || !districtName) {
      toast("warning", "All fields are required");
      return;
    }

    const payload = { country, state: stateName, district: districtName };

    if (editingId) {
      // Update
      axios
        .put(`${baseUrl}/${editingId}`, payload)
        .then(() => {
          toast("success", "District updated");
          resetForm();
          loadDistricts();
        })
        .catch(() => toast("error", "Update failed"));
    } else {
      // Add
      axios
        .post(baseUrl, payload)
        .then(() => {
          toast("success", "District added");
          resetForm();
          loadDistricts();
        })
        .catch(() => toast("error", "Add failed"));
    }
  };

  // Edit a district
  const handleEdit = (district: DistrictType) => {
    setCountry(district.country);
    setStateName(district.state);
    setDistrictName(district.district);
    setEditingId(district._id);
  };

  // Delete a district
  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete this district?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseUrl}/${id}`)
          .then(() => {
            toast("success", "District deleted");
            loadDistricts();
          })
          .catch(() => toast("error", "Delete failed"));
      }
    });
  };

  const resetForm = () => {
    setCountry("");
    setStateName("");
    setDistrictName("");
    setEditingId(null);
  };

  return (
    <div className="container">
      <h2>Manage District</h2>
      <form onSubmit={handleSubmit}>
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
              value={districtName}
              onChange={(e) => setDistrictName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="row mb-3 text-center">
          <div className="col">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update District" : "Add District"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

  <h4>Districts List</h4>
  <div className="table-responsive">
  <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Country</th>
            <th>State</th>
            <th>District</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {districts.map((d) => (
            <tr key={d._id}>
              <td>{d.country}</td>
              <td>{d.state}</td>
              <td>{d.district}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(d)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(d._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
  </table>
  </div>
    </div>
  );
}

export default District;
