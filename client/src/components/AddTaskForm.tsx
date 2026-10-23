import { useState, type FormEvent } from "react";
interface Props {
  onAdd: (title: string, remindAt: string | null) => Promise<Boolean>;
}
export default function AddTaskForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [remindAt, setRemindAt] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const time = remindAt ? new Date(remindAt).toISOString() : null;
    const saved = await onAdd(title.trim(), time);

    if (saved) {
      setTitle("");
      setRemindAt("");
    }
  }
  return (
    <div className="card">
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="What do you need to do? ✨"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label>
          Remind me at (optional)
          <input
            type="datetime-local"
            value={remindAt}
            onChange={(e) => setRemindAt(e.target.value)}
          />
        </label>
        <button type="submit">Add task</button>
      </form>
    </div>
  );
}
