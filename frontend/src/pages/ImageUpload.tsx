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

  // Load all customers
  const loadCustomers = () => {
    axios
      .get<CustomerType[]>(baseUrl)
      .then((res) => setCustomers(res.data))
      .catch(() => console.error("Failed to load customers"));
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

  // Add or Update customer
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
      // Update
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
      // Add
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

  // Edit customer
  const handleEdit = (customer: CustomerType) => {
    setName(customer.name);
    setEmail(customer.email);
    setMobile(customer.mobile);
    setEditingId(customer._id);
  };

  // Delete customer
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
    <div className="container">
      <h2>Manage Customer</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="col">
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

        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Mobile"
              className="form-control"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <div className="col">
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImage(e.target.files[0]);
                }
              }}
              required={!editingId} // require image only for add
            />
          </div>
        </div>

        <div className="row mb-3 text-center">
          <div className="col">
            <button type="submit" className="btn btn-primary">
              {editingId ? "Update Customer" : "Add Customer"}
            </button>
            {editingId && (
              <button type="button" className="btn btn-secondary ms-2" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </form>

      <h4>Customer List</h4>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Image</th>
            <th>Actions</th>
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
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(c)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(c._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ImageUpload;
