import { Route, Routes, useNavigate } from "react-router-dom";
import styles from "./app.module.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import Auth from "./routes/Auth";
import Models from "./routes/Models";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout/", {}, { withCredentials: true });
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const verifySession = async () => {
      try {
        const response = await axios.get("/api/auth/user/");
        if (response.status === 200 && response.data.username) {
          setUsername(response.data.username);
          navigate("/models");
        } else {
          navigate("/auth");
        }
      } catch {
        navigate("/auth");
      }
    };

    verifySession();
  }, [navigate]);

  return (
    <div className={styles.app}>
      <Routes>
        <Route
          path="/auth"
          element={<Auth onAuthSuccess={() => navigate("/models")} />}
        />
        <Route
          path="/models"
          element={<Models onLogout={handleLogout} username={username} />}
        />
      </Routes>
    </div>
  );
}

export default App;
