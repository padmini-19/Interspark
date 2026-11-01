import { useEffect, useState } from "react";
import API from "../api";
import { useNavigate, useParams } from "react-router-dom";

function EditTask() {
  const [title, setTitle] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/tasks/${id}`).then((res) => {
      setTitle(res.data.title);
    });
  }, []);

  const updateTask = async (e) => {
    e.preventDefault();

    await API.put(`/tasks/${id}`, {
      title,
    });

    navigate("/");
  };

  return (
    <form onSubmit={updateTask}>
      <input
        className="form-control mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <button className="btn btn-warning">
        Update Task
      </button>
    </form>
  );
}

export default EditTask;