
import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [toast, setToast] = useState({
        message: "",
        type: ""
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!toast.message) return;

        const timer = setTimeout(() => {
            setToast({ message: "", type: "" });
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setToast({ message: "", type: "" });

        try {
            const response = await axios.post(
                "https://bookswap-backend-five.vercel.app/emp/",
                formData
            );

            console.log("Registration response:", response.data);

            const username =
                response.data.username || formData.username;

            localStorage.setItem("username", username);

            setFormData({
                username: "",
                email: "",
                password: ""
            });

            setToast({
                message: `Welcome to BookSwap, ${username}! Your account has been created successfully.`,
                type: "success"
            });

            setTimeout(() => {
                navigate("/Navbar");
            }, 1800);

        } catch (error) {
            console.error(
                "Registration error:",
                error.response?.data || error.message
            );

            const errorData = error.response?.data;

            let errorMessage = "Registration failed. Please try again.";

            if (errorData) {
                if (typeof errorData === "string") {
                    errorMessage = errorData;
                } else if (errorData.detail) {
                    errorMessage = errorData.detail;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                } else {
                    errorMessage = Object.entries(errorData)
                        .map(([field, messages]) => {
                            const message = Array.isArray(messages)
                                ? messages.join(", ")
                                : String(messages);

                            return `${field}: ${message}`;
                        })
                        .join(" | ");
                }
            }

            setToast({
                message: errorMessage,
                type: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="register">
            {toast.message && (
                <div
                    className={`register-toast ${toast.type}`}
                    role="status"
                    aria-live="polite"
                >
                    <span className="toast-icon">
                        {toast.type === "success" ? "✓" : "!"}
                    </span>

                    <div className="toast-content">
                        <strong>
                            {toast.type === "success"
                                ? "Registration Successful"
                                : "Registration Error"}
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
                <h1>Create Account</h1>
                <p>Join BookSwap and start your reading journey.</p>

                <label htmlFor="name">
                    Enter Name:
                    <input
                        id="name"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        autoComplete="username"
                        required
                    />
                </label>

                <label htmlFor="email">
                    Enter Email:
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        autoComplete="email"
                        required
                    />
                </label>

                <label htmlFor="password">
                    Enter Password:
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        autoComplete="new-password"
                        required
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Creating Account..." : "Register"}
                </button>

                <h2>──────── OR ────────</h2>

                <h3>
                    Already have an account?{" "}
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            isActive ? "active" : "nav-item"
                        }
                    >
                        Login
                    </NavLink>
                </h3>
            </form>
        </div>
    );
}

export default Register;
