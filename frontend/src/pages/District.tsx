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

  const loadDistricts = () => {
    axios
      .get<DistrictType[]>(baseUrl)
      .then((res) => setDistricts(res.data))
      .catch(() => console.error("Failed to load districts"));
  };

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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!country || !stateName || !districtName) {
      toast("warning", "All fields are required");
      return;
    }

    const payload = { country, state: stateName, district: districtName };

    if (editingId) {
      axios
        .put(`${baseUrl}/${editingId}`, payload)
        .then(() => {
          toast("success", "District updated");
          resetForm();
          loadDistricts();
        })
        .catch(() => toast("error", "Update failed"));
    } else {
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

  const handleEdit = (district: DistrictType) => {
    setCountry(district.country);
    setStateName(district.state);
    setDistrictName(district.district);
    setEditingId(district._id);
  };

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
      <h2 className="mb-4">Manage District</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="row g-2 mb-3">
          <div className="col-12 col-md-4">
            <input
              type="text"
              placeholder="Enter Country"
              className="form-control"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <div className="col-12 col-md-4">
            <input
              type="text"
              placeholder="Enter State"
              className="form-control"
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              required
            />
          </div>
          <div className="col-12 col-md-4">
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

        <div className="row mb-4">
          <div className="col-12 col-md-6 d-grid gap-2">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update District" : "Add District"}
            </button>
          </div>
          {editingId && (
            <div className="col-12 col-md-6 d-grid gap-2 mt-2 mt-md-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Table */}
      <h4 className="mb-3">Districts List</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
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
                <td className="text-nowrap">
                  <button
                    className="btn btn-sm btn-warning me-2 mb-1"
                    onClick={() => handleEdit(d)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger mb-1"
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
