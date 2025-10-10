import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface CustomerType {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  image: string;
}

function ImageUpload() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [customers, setCustomers] = useState<CustomerType[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const baseUrl = "http://localhost:3000/api/users";
  const imageBaseUrl = "http://localhost:3000/uploads";

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = () => {
    axios
      .get<CustomerType[]>(baseUrl)
      .then((res) => setCustomers(res.data))
      .catch(() => console.error("Failed to load customers"));
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

    if (!name || !email || !mobile || (!image && !editingId)) {
      toast("warning", "All fields required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("mobile", mobile);
    if (image) formData.append("image", image);

    if (editingId) {
      axios
        .put(`${baseUrl}/${editingId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          toast("success", "Customer updated");
          resetForm();
          loadCustomers();
        })
        .catch(() => toast("error", "Update failed"));
    } else {
      axios
        .post(baseUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          toast("success", "Customer added");
          resetForm();
          loadCustomers();
        })
        .catch(() => toast("error", "Add failed"));
    }
  };

  const handleEdit = (customer: CustomerType) => {
    setName(customer.name);
    setEmail(customer.email);
    setMobile(customer.mobile);
    setEditingId(customer._id);
  };

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Delete this customer?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseUrl}/${id}`)
          .then(() => {
            toast("success", "Customer deleted");
            loadCustomers();
          })
          .catch(() => toast("error", "Delete failed"));
      }
    });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setMobile("");
    setImage(null);
    setEditingId(null);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Manage Customer</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row g-2 mb-3">
          <div className="col-12 col-md-6">
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-12 col-md-6">
            <input
              type="text"
              placeholder="Enter Mobile"
              className="form-control"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <div className="col-12 col-md-6">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImage(e.target.files[0]);
                }
              }}
              required={!editingId}
            />
          </div>
        </div>

        <div className="mb-4 text-center">
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Customer" : "Add Customer"}
          </button>
          {editingId && (
            <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <h4>Customer List</h4>
      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Image</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.mobile}</td>
                <td>
                  {c.image ? (
                    <img
                      src={`${imageBaseUrl}/${c.image}`}
                      alt={c.name}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-warning me-2 mb-1"
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger mb-1"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ImageUpload;
