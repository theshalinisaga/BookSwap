
import React, { useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                
"https://bookswap-backend-five.vercel.app/login/"
,
                {
                    username: name,
                    password: password
                }
            );

            console.log("Login response:", response.data);

            // Save login details in browser storage
            localStorage.setItem("username", response.data.username);
            localStorage.setItem("user_id", response.data.user_id);

            // IMPORTANT: Save the authentication token
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            } else {
                alert("Login succeeded, but the server did not return a token.");
                return;
            }

            alert("Login successful!");
            navigate("/Navbar");

        } catch (error) {
            console.log("Login error:", error.response?.data);

            alert(
                error.response?.data?.message ||
                "Invalid username or password"
            );
        }
    };

    return (
        <div id="login">
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
                        required
                    />
                </label>

                <button type="submit">Login</button>

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
