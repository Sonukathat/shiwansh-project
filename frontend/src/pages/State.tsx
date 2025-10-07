import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface LocationType {
  _id: string;
  country: string;
  states: string[];
}

function State() {
  const [country, setCountry] = useState("");
  const [stateName, setStateName] = useState("");
  const [locations, setLocations] = useState<LocationType[]>([]);
  const [editing, setEditing] = useState<{ country: string; oldState: string } | null>(null);

  const baseUrl = "http://localhost:3000/api/locations";

  useEffect(() => {
    loadLocations();
  }, []);

  // Load countries + states
  const loadLocations = () => {
    axios
      .get<LocationType[]>(baseUrl)
      .then((res) => setLocations(res.data))
      .catch(() => console.error("Failed to load locations"));
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

  // Add or Update state
  const handleAddOrUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!country || !stateName) {
      toast("warning", "Country and State required");
      return;
    }

    const existingCountry = locations.find((loc) => loc.country === country);

    if (!existingCountry) {
      // Add new country + state
      axios
        .post(`${baseUrl}/country`, { country })
        .then(() => axios.post(`${baseUrl}/state`, { country, state: stateName }))
        .then(() => {
          toast("success", "Country and State added");
          resetForm();
          loadLocations();
        })
        .catch((err) => toast("error", err.response?.data?.message || "Server error"));
    } else if (editing) {
      // Update state
      const updatedStates = existingCountry.states.map((s) =>
        s === editing.oldState ? stateName : s
      );

      axios
        .put(`${baseUrl}/updateState`, { country, states: updatedStates })
        .then(() => {
          toast("success", "State updated");
          resetForm();
          loadLocations();
        })
        .catch((err) => toast("error", err.response?.data?.message || "Server error"));
    } else {
      // Add new state
      axios
        .post(`${baseUrl}/state`, { country, state: stateName })
        .then(() => {
          toast("success", "State added");
          resetForm();
          loadLocations();
        })
        .catch((err) => toast("error", err.response?.data?.message || "Server error"));
    }
  };

  // Edit a state
  const handleEdit = (countryName: string, state: string) => {
    setCountry(countryName);
    setStateName(state);
    setEditing({ country: countryName, oldState: state });
  };

  // Delete a state
  const handleDelete = (countryName: string, state: string) => {
    Swal.fire({
      title: `Delete state "${state}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        const location = locations.find((loc) => loc.country === countryName);
        if (!location) return;

        const updatedStates = location.states.filter((s) => s !== state);

        axios
          .put(`${baseUrl}/updateState`, { country: countryName, states: updatedStates })
          .then(() => {
            toast("success", "State deleted");
            loadLocations();
          })
          .catch(() => toast("error", "Delete failed"));
      }
    });
  };

  const resetForm = () => {
    setCountry("");
    setStateName("");
    setEditing(null);
  };

  return (
    <div className="container">
      <h2>Manage State</h2>

      <form onSubmit={handleAddOrUpdate}>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Country"
              className="form-control"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              disabled={!!editing} // disable country during edit
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
        </div>

        <div className="row mb-3 text-center">
          <div className="col">
            <button type="submit" className="btn btn-primary">
              {editing ? "Update State" : "Add State"}
            </button>
            {editing && (
              <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <h4>Countries & States List</h4>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Country</th>
            <th>State</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {locations.map((loc) =>
            loc.states.map((s) => (
              <tr key={loc._id + s}>
                <td>{loc.country}</td>
                <td>{s}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(loc.country, s)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(loc.country, s)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default State;
