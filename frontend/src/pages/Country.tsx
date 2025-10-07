import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

function Country() {
  const [countries, setCountries] = useState([]);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  
  const baseUrl = "https://localhost:7071/api/Countries";
  const imageBasePath = "https://localhost:7071/api/Uploads";

  useEffect(() => {
    loadCountries();
  }, []);

  // Load countries
  const loadCountries = () => {
    axios.get(baseUrl).then((res) => {
      setCountries(res.data);
    });
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
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", id.toString());
    formData.append("name", name);
    if (image) {
      formData.append("image", image);
    }

    if (id === 0) {
      axios
        .post(baseUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          toast("success", "Country added");
          resetForm();
          loadCountries();
        });
    } else {
      axios
        .put(baseUrl, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(() => {
          toast("success", "Country updated");
          resetForm();
          loadCountries();
        });
    }
  };

  // Edit
  const handleEdit = (country: any) => {
    setId(country.id);
    setName(country.name);
  };

  // Delete
  const handleDelete = (countryId: number) => {
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
        axios.delete(`${baseUrl}/${countryId}`).then(() => {
          toast("success", "Country deleted");
          loadCountries();
        });
      }
    });
  };

  // Reset form
  const resetForm = () => {
    setId(0);
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
            required={id === 0}
          />
        </div>

        <div className="row mb-3 text-center">
          <div className="col">
            <button type="submit" className="btn btn-primary">
              {id === 0 ? "Add Country" : "Update Country"}
            </button>
          </div>
        </div>
      </form>

      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {countries.map((c: any) => (
            <tr key={c.id}>
              <td>{c.id}</td>
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
                  onClick={() => handleDelete(c.id)}
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
