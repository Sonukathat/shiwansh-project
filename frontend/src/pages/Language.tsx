import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Language() {
  interface Lang {
    _id?: string;
    name: string;
  }

  const [name, setName] = useState<string>("");
  const [languages, setLanguages] = useState<Lang[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const API_URL = "http://localhost:3000/api/languages";

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

  // Fetch all languages
  const fetchLanguages = async () => {
    try {
      const res = await axios.get(API_URL);
      setLanguages(res.data);
    } catch (err: any) {
      toast("error", err.response?.data?.message || "Failed to fetch languages");
    }
  };

  // Load languages on mount
  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name) {
      toast("warning", "Please enter a language name");
      return;
    }
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, { name });
        toast("success", "Language updated");
        setEditingId(null);
      } else {
        await axios.post(`${API_URL}/add`, { name });
        toast("success", "Language added");
      }
      setName("");
      fetchLanguages();
    } catch (err: any) {
      toast("error", err.response?.data?.message || "Server error");
    }
  };

  // Edit language
  const handleEdit = (lang: Lang) => {
    setName(lang.name);
    setEditingId(lang._id || null);
  };

  // Delete language
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
      toast("success", "Language deleted");
      fetchLanguages();
    } catch (err: any) {
      toast("error", err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="container">
      <h2>Manage Language</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Language Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <button className="btn btn-primary w-100">{editingId ? "Update Language" : "Add Language"}</button>
          </div>
        </div>
      </form>

      {/* Languages Table */}
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {languages.map(lang => (
            <tr key={lang._id}>
              <td>{lang.name}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(lang)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(lang._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Language;
