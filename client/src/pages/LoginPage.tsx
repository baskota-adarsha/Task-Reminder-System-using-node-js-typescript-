import { useState, type FormEvent } from "react";
import { call, saveToken } from "../helpers/api";
export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");

    try {
      if (isRegister) await call("/auth/register", "POST", { email, password });
      const data = await call("/auth/login", "POST", { email, password });
      saveToken(data.token);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    }
  }

  return (
    <div className="box">
      <div className="card">
        <h1>✈️ TaskPilot</h1>
        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">
            {isRegister ? "Create account" : "Log in"}
          </button>
        </form>
        <p>
          <button className="link" onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "I already have an account" : "Create an account"}
          </button>
        </p>
      </div>
    </div>
  );
}
