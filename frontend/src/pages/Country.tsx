import { useEffect, useState } from "react";
import type { FormEvent } from "react"; // ✅ Type-only import
import axios from "axios";
import Swal from "sweetalert2";

// Country type
interface CountryType {
  _id: string;
  name: string;
  image: string;
}

function Country() {
  const [countries, setCountries] = useState<CountryType[]>([]);
  const [id, setId] = useState<string>(""); // MongoDB _id
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const baseUrl = "http://localhost:3000/api/Countries"; // backend API
  const imageBasePath = "http://localhost:3000/uploads"; // static folder

  useEffect(() => {
    loadCountries();
  }, []);

  // Load countries
  const loadCountries = () => {
    axios
      .get<CountryType[]>(baseUrl)
      .then((res) => setCountries(res.data))
      .catch(() => console.error("Failed to load countries"));
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

  // Save (Add/Update)
  const handleSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    if (id) formData.append("id", id);
    formData.append("name", name);
    if (image) formData.append("image", image);

    if (!id) {
      // Add country
      axios
        .post(baseUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          toast("success", "Country added");
          resetForm();
          loadCountries();
        })
        .catch((err) =>
          toast("error", err.response?.data?.message || "Server error")
        );
    } else {
      // Update country
      axios
        .put(baseUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          toast("success", "Country updated");
          resetForm();
          loadCountries();
        })
        .catch((err) =>
          toast("error", err.response?.data?.message || "Server error")
        );
    }
  };

  // Edit
  const handleEdit = (country: CountryType) => {
    setId(country._id);
    setName(country.name);
    setImage(null); // clear previous selection
  };

  // Delete
  const handleDelete = (countryId: string) => {
    Swal.fire({
      title: "Delete country?",
      text: "This cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${baseUrl}/${countryId}`)
          .then(() => {
            toast("success", "Country deleted");
            loadCountries();
          })
          .catch(() => toast("error", "Delete failed"));
      }
    });
  };

  // Reset form
  const resetForm = () => {
    setId("");
    setName("");
    setImage(null);
  };

  return (
    <div className="container">
      <h2>Manage Country</h2>
      <form onSubmit={handleSave} encType="multipart/form-data">
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              value={name}
              placeholder="Enter country name"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="col mb-3">
          <label>Upload Image</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setImage(e.target.files[0]);
              }
            }}
            required={!id} // required only when adding
          />
        </div>

        <div className="row mb-3 text-center">
          <div className="col">
            <button type="submit" className="btn btn-primary">
              {id ? "Update Country" : "Add Country"}
            </button>
          </div>
        </div>
      </form>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((c) => (
            <tr key={c._id}>
              <td>{c.name}</td>
              <td>
                <img
                  src={`${imageBasePath}/${c.image}`}
                  alt={c.name}
                  style={{ width: "60px", height: "40px", objectFit: "cover" }}
                />
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

export default Country;
