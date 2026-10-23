import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { call } from "../helpers/api";
import type { Task } from "../types/task";
import AddTaskForm from "../components/AddTaskForm";
import TaskItem from "../components/TaskItem";

interface Props {
  onLogout: () => void;
}

export default function TasksPage({ onLogout }: Props) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [refresh, setRefresh] = useState(0);
  const alreadyShown = useRef(new Set<number>()); // tasks we already showed a toast for

  // load the tasks on start, and again whenever "refresh" changes
  useEffect(() => {
    call("/tasks?limit=50")
      .then((res) => setTasks(res.data))
      .catch((err: Error) => setError(err.message));
  }, [refresh]);

  // reload every 30 seconds, so the 🔔 Reminded badge also appears by itself
  useEffect(() => {
    const id = setInterval(() => setRefresh((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  // every 5 seconds ask: has any reminder time arrived?
  useEffect(() => {
    function check() {
      for (const task of tasks) {
        if (task.done || !task.remindAt) continue;
        if (alreadyShown.current.has(task.id)) continue;

        const passed = Date.now() - new Date(task.remindAt).getTime();
        if (passed < 0 || passed > 120000) continue; // not yet, or older than 2 minutes

        alreadyShown.current.add(task.id);
        toast(
          (t) => (
            <span>
              ⏰ <b>{task.title}</b>{" "}
              <button className="x" onClick={() => toast.dismiss(t.id)}>
                ✕
              </button>
            </span>
          ),
          { duration: Infinity }, // stays until the user clicks ✕
        );
      }
    }

    check();
    const id = setInterval(check, 5000);
    return () => clearInterval(id);
  }, [tasks]);

  // run an action, show any error, then reload the list
  async function run(action: () => Promise<unknown>) {
    try {
      await action();
      setError("");
      setRefresh((n) => n + 1);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      return false;
    }
  }

  const add = (title: string, remindAt: string | null) =>
    run(() => call("/tasks", "POST", { title, remindAt }));

  const toggle = (task: Task) =>
    run(() => call(`/tasks/${task.id}`, "PATCH", { done: !task.done }));

  const remove = (id: number) => run(() => call(`/tasks/${id}`, "DELETE"));

  return (
    <div className="box">
      <div className="top">
        <h1>✈️ TaskPilot</h1>
        <button onClick={onLogout}>Log out</button>
      </div>

      <AddTaskForm onAdd={add} />

      {error && <p className="error">{error}</p>}

      <div className="card">
        {tasks.length === 0 && <p className="empty">No tasks yet 🌱</p>}
        <ul className="list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggle}
              onDelete={remove}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
