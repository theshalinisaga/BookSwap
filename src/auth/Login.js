
import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [toast, setToast] = useState({
        message: "",
        type: ""
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!toast.message) return;

        const timer = setTimeout(() => {
            setToast({ message: "", type: "" });
        }, 3500);

        return () => clearTimeout(timer);
    }, [toast]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setToast({ message: "", type: "" });

        try {
            const response = await axios.post(
                "https://bookswap-backend-five.vercel.app/login/",
                {
                    username: name,
                    password: password
                }
            );

            console.log("Login response:", response.data);

            if (!response.data.token) {
                setToast({
                    message: "Login succeeded, but no authentication token was returned.",
                    type: "error"
                });
                setLoading(false);
                return;
            }

            localStorage.setItem("username", response.data.username);
            localStorage.setItem("user_id", response.data.user_id);
            localStorage.setItem("token", response.data.token);

            setToast({
                message: `Welcome back, ${response.data.username || name}!`,
                type: "success"
            });

            setTimeout(() => {
                navigate("/Navbar");
            }, 1200);

        } catch (error) {
            console.log("Login error:", error.response?.data);

            setToast({
                message:
                    error.response?.data?.message ||
                    error.response?.data?.detail ||
                    "Invalid username or password. Please try again.",
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="login">
            {toast.message && (
                <div
                    className={`login-toast ${toast.type}`}
                    role="status"
                    aria-live="polite"
                >
                    <span className="toast-icon">
                        {toast.type === "success" ? "✓" : "!"}
                    </span>

                    <div className="toast-content">
                        <strong>
                            {toast.type === "success"
                                ? "Login Successful"
                                : "Login Error"}
                        </strong>
                        <p>{toast.message}</p>
                    </div>

                    <button
                        type="button"
                        className="toast-close"
                        onClick={() =>
                            setToast({ message: "", type: "" })
                        }
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <h1>Welcome Back</h1>
                <p>Login to continue your BookSwap journey.</p>

                <label htmlFor="name">
                    Enter Name:
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="username"
                        required
                    />
                </label>

                <label htmlFor="password">
                    Enter Password:
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <h2>──────── OR ────────</h2>

                <h3>
                    Already have an account?{" "}
                    <NavLink
                        to="/register"
                        className={({ isActive }) =>
                            isActive ? "active" : "nav-item"
                        }
                    >
                        Register
                    </NavLink>
                </h3>
            </form>
        </div>
    );
}

export default Login;
