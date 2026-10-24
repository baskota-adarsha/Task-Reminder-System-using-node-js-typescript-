import "./App.css";
import { useState } from "react";
import { getToken, removeToken } from "./helpers/api";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import { Toaster } from "react-hot-toast";
export default function App() {
  const [loggedIn, setLoggedIn] = useState(!!getToken());

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;
  return (
    <>
      <Toaster position="top-right" />
      <TasksPage
        onLogout={() => {
          removeToken();
          setLoggedIn(false);
        }}
      />
    </>
  );
}
