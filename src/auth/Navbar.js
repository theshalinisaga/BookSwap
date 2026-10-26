import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import logo from "./logo.png";
import Book from "./Book.jpg";

import "./Navbar.css";

function Navbar() {

    const navigate = useNavigate();

    return (
        <div className="bookswap-page">

            {/* ================= NAVBAR ================= */}

            <nav className="navbar">

                <div className="navbar-logo">
                    <img src={logo} alt="BookSwap Logo" />
                </div>

                <div className="nav-links">

                    <NavLink to="/Navbar">
                        Home
                    </NavLink>

                    <NavLink to="/browsebooks">
                        Browse Books
                    </NavLink>

                    <NavLink to="/categories">
                        Categories
                    </NavLink>

                    <NavLink
                        to="/login"
                        className="login-btn"
                    >
                        Login
                    </NavLink>

                    <NavLink
                        to="/register"
                        className="register-btn"
                    >
                        Register
                    </NavLink>

                </div>

            </nav>


            {/* ================= HERO ================= */}

            <section className="hero-section">

                <div className="hero-content">

                    <div className="hero-badge">
                        <span></span>
                        A SMARTER WAY TO SWAP BOOKS
                    </div>

                    <h1>
                        Exchange Knowledge,
                        <br />

                        <span>
                            One Book at a Time.
                        </span>
                    </h1>

                    <p>
                        BookSwap connects students and readers
                        to buy, sell and exchange second-hand
                        books at affordable prices while giving
                        every book a new journey.
                    </p>

                    <div className="hero-buttons">

                        <button
                            className="primary-btn"
                            onClick={() =>
                                navigate("/browsebooks")
                            }
                        >
                            Browse Books
                            <span>→</span>
                        </button>

                        <button
                            className="secondary-btn"
                            onClick={() =>
                                navigate("/add")
                            }
                        >
                            Add Your Book
                        </button>

                    </div>

                </div>


                {/* ================= 3D BOOK ================= */}

                <div className="hero-visual">

                    <div className="hero-glow"></div>

                    <div className="book-shadow"></div>

                    <div className="book-3d">

                        <img
                            src={Book}
                            alt="Book"
                        />

                        <div className="book-shine"></div>

                    </div>

                    <div className="floating-card card-one">
                        📚
                        <span>
                            1,200+ Books
                        </span>
                    </div>

                    <div className="floating-card card-two">
                        🔄
                        <span>
                            Easy Swaps
                        </span>
                    </div>

                    <div className="floating-card card-three">
                        ✨
                        <span>
                            Join Community
                        </span>
                    </div>

                </div>

            </section>


            {/* ================= HOW IT WORKS ================= */}

            <section className="how-section">

                <div className="section-heading">

                    <div className="section-label">
                        HOW IT WORKS
                    </div>

                    <h2>
                        Simple steps.
                        <br />

                        <span>
                            Real connections.
                        </span>
                    </h2>

                    <p>
                        Turn the books sitting on your shelf
                        into opportunities to discover,
                        connect and share knowledge.
                    </p>

                </div>


                {/* ================= STEPS ================= */}

                <div className="steps-container">

                    <div className="connection-line">
                        <div></div>
                    </div>


                    {/* STEP 1 */}

                    <div className="step-card">

                        <div className="step-number">
                            01
                        </div>

                        <div className="step-icon">
                            📚
                        </div>

                        <h3>
                            List Your Books
                        </h3>

                        <p>
                            Add books you no longer need.
                            Enter the title and details,
                            and make them available
                            for other readers.
                        </p>

                        <div className="step-feature">
                            <span>✓</span>
                            Easy book listing
                        </div>

                        <div className="step-feature">
                            <span>✓</span>
                            Add book details
                        </div>

                        <div className="step-feature">
                            <span>✓</span>
                            Give old books new life
                        </div>

                    </div>


                    {/* STEP 2 */}

                    <div className="step-card">

                        <div className="step-number">
                            02
                        </div>

                        <div className="step-icon">
                            🔎
                        </div>

                        <h3>
                            Discover & Request
                        </h3>

                        <p>
                            Explore books available from
                            other readers and find the
                            titles you've been searching for.
                        </p>

                        <div className="step-feature">
                            <span>✓</span>
                            Browse available books
                        </div>

                        <div className="step-feature">
                            <span>✓</span>
                            Find what you need
                        </div>

                        <div className="step-feature">
                            <span>✓</span>
                            Send swap requests
                        </div>

                    </div>


                    {/* STEP 3 */}

                    <div className="step-card">

                        <div className="step-number">
                            03
                        </div>

                        <div className="step-icon">
                            🔄
                        </div>

                        <h3>
                            Swap & Connect
                        </h3>

                        <p>
                            Connect with fellow readers
                            and exchange your books
                            through safe local meetups.
                        </p>

                        <div className="step-feature">
                            <span>✓</span>
                            Connect with readers
                        </div>

                        <div className="step-feature">
                            <span>✓</span>
                            Safe local exchange
                        </div>

                        <div className="step-feature">
                            <span>✓</span>
                            Build a reading community
                        </div>

                    </div>

                </div>


                {/* ================= CTA ================= */}

                <div className="how-cta">

                    <div className="cta-icon">
                        ✨
                    </div>

                    <div className="cta-content">

                        <h3>
                            Ready to give your books
                            a new journey?
                        </h3>

                        <p>
                            Join readers around you and
                            start swapping today.
                        </p>

                    </div>

                    <button
                        onClick={() =>
                            navigate("/browsebooks")
                        }
                    >
                        Start Swapping
                        <span>→</span>
                    </button>

                </div>

            </section>

        </div>
    );
}

export default Navbar;