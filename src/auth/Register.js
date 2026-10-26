import React from 'react'
import axios from "axios"
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

import './Register.css'
function Register()
{
    const navigate = useNavigate();

   
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

const handleSubmit = async (e) => {

    e.preventDefault();

    try {

        const response = await axios.post(
            "https://bookswap-backend-five.vercel.app/emp/",
            formData
        );

        console.log("Registration response:", response.data);

        localStorage.setItem(
            "username",
            response.data.username
        );

        setFormData({
            username: "",
            email: "",
            password: ""
        });

        alert("Registration successful!");

        navigate("/Navbar");

    } catch (error) {

        console.log(
            "Registration error:",
            error.response?.data
        );

        alert(
            JSON.stringify(
                error.response?.data ||
                "Registration failed"
            )
        );
    }
};
 return(
    <div id="register">
    
    
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
    />
</label>
        <button type="submit">
        Register
        </button>
      <h2>──────── OR ────────</h2>

                <h3>
              Already have an account? <NavLink to="/login" className={({ isActive })=> isActive ? "active" :"nav-item"}>login</NavLink>

                </h3>
    </form>
    
    </div>

        )

}
export default Register