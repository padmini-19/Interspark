import { useEffect, useState } from "react";
import API from "../api";
import { Link } from "react-router-dom";

function Home() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      
      // DEBUG LOG: Open your browser console to see exactly how your backend data looks
      console.log("Your backend tasks data looks like this:", res.data);

      // FIX: Ensure tasks is ALWAYS an array even if the backend wraps it in an object
      const taskData = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      setTasks(taskData);
    } catch (err) {
      alert("Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      alert("Failed to delete task");
    }
  };

  if (loading) return <h3>Loading...</h3>;

  return (
    <>
      <Link to="/add" className="btn btn-primary mb-3">
        Add Task
      </Link>

      {/* Fallback check if tasks list is completely empty */}
      {tasks.length === 0 ? (
        <div className="alert alert-info mt-3">No tasks found. Try adding one!</div>
      ) : (
        tasks.map((task) => (
          <div key={task._id || task.id} className="card mb-2 p-3 d-flex flex-row justify-
          content-between align-items-center shadow-sm">
            <div>
              <h5 className="mb-0">{task.title}</h5>
            </div>

            <div>
              <Link
                to={`/edit/${task._id || task.id}`}
                className="btn btn-warning btn-sm me-2"
              >
                Edit
              </Link>

              <button
                onClick={() => deleteTask(task._id || task.id)}
                className="btn btn-danger btn-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
}

export default Home;