import type { Task } from "../types/task";
interface Props {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <li className={task.done ? "task done" : "task"}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task)}
      />
      <div className="info">
        <span className="title">{task.title}</span>
        {task.remindAt && (
          <small>
            ⏰ {new Date(task.remindAt).toLocaleString()}
            {task.reminded && !task.done && " 🔔 Reminded"}
          </small>
        )}
      </div>
      <button className="del" onClick={() => onDelete(task.id)}>
        🗑️
      </button>
    </li>
  );
}
