import { useEffect, useState } from "react";
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

  useEffect(() => {
    call("/tasks?limit=50")
      .then((res) => setTasks(res.data))
      .catch((err: Error) => setError(err.message));
  }, [refresh]);

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
        <h1>✈️ Task Reminder System</h1>
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
