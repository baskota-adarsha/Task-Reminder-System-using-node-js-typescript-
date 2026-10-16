import "./App.css";
import { useState } from "react";
import { getToken } from "./helpers/api";
import LoginPage from "./pages/LoginPage";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!getToken());

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;
  return <p>Hey</p>;
}
