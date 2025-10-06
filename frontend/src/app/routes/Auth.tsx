import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import styles from "../app.module.scss";

interface AuthProps {
  onAuthSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [currentLogin, setCurrentLogin] = useState("");
  const [currentPassword1, setCurrentPassword] = useState("");
  const [currentPassword2, setCurrentPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    axios.defaults.withCredentials = true;
    const getCsrfToken = async () => {
      if (!axios.defaults.headers.common["X-CSRFToken"]) {
        const { data } = await axios.get("/api/auth/csrf-token/");
        axios.defaults.headers.common["X-CSRFToken"] = data.csrfToken;
      }
    };
    getCsrfToken();
  }, []);

  const handleLogin = async () => {
    setError(null);
    try {
      const response = await axios.post(`/api/auth/login/`, {
        username: currentLogin,
        password: currentPassword1,
      });
      console.log(response);

      if (response.status === 204) {
        onAuthSuccess();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ message: string }>;
        if (axiosError.response) {
          setError(
            `Login failed: ${
              axiosError.response.data.message || "Bad request"
            } (Status: ${axiosError.response.status})`
          );
        } else if (axiosError.request) {
          setError("Login failed: No response from server.");
        } else {
          setError("Login failed: An error occurred.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleRegister = async () => {
    setError(null);
    try {
      const response = await axios.post(`/api/auth/registration/`, {
        username: currentLogin,
        password1: currentPassword1,
        password2: currentPassword2,
      });

      if (response.status === 204) {
        onAuthSuccess();
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{ [key: string]: string[] }>;
        if (axiosError.response) {
          const errorData = axiosError.response.data;
          const errorMessages = Object.keys(errorData)
            .map((key) => `${key}: ${errorData[key].join(", ")}`)
            .join("; ");
          setError(
            `Registration failed: ${errorMessages || "Bad request"} (Status: ${
              axiosError.response.status
            })`
          );
        } else if (axiosError.request) {
          setError("Registration failed: No response from server.");
        } else {
          setError("Registration failed: An error occurred.");
        }
      } else if (err instanceof Error) {
        setError(err.message);
      }
    }
  };

  const handleAuthAction = () => {
    if (isRegister) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <div className={styles.auth}>
      <div>
        <h1>{isRegister ? "Register" : "Login"}</h1>
        <div>
          <input
            type="text"
            placeholder="Username"
            value={currentLogin}
            onChange={(e) => setCurrentLogin(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={currentPassword1}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        {isRegister && (
          <>
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={currentPassword2}
                onChange={(e) => setCurrentPassword2(e.target.value)}
              />
            </div>
          </>
        )}
        <div>
          <button onClick={handleAuthAction}>
            {isRegister ? "Register" : "Login"}
          </button>
          <button onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? "Switch to Login" : "Switch to Register"}
          </button>
        </div>
        <div>{error && <p style={{ color: "red" }}>{error}</p>}</div>
      </div>
    </div>
  );
};

export default Auth;
