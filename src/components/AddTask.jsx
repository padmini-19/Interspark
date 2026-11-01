import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

function AddTask() {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      // FIX: Explicitly send description as an empty string so the model doesn't fail
      await API.post("/tasks", {
        title,
        description: "" 
      });

      navigate("/");
    } catch (err) {
      alert("Failed to add task");
    }
  };

  return (
    <form onSubmit={submitHandler}>
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Enter task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <button className="btn btn-success">Add Task</button>
    </form>
  );
}

export default AddTask;