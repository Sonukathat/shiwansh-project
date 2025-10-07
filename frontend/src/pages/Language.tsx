import { useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";

function Language() {
  const [name, setName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name) {
      setMessage("Please enter a language name");
      return;
    }

    try {
      const res = await axios.post<{ message: string }>(
        "http://localhost:3000/api/languages/add",
        { name }
      );
      setMessage(res.data.message);
      setName("");
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="container">
      <h2>Manage Language</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              placeholder="Enter Language Name"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <div className="row mb-3 text-center">
          <div className="col">
            <button className="btn btn-primary">Add Language</button>
          </div>
        </div>
      </form>
      {message && <p className="text-center">{message}</p>}
    </div>
  );
}

export default Language;
