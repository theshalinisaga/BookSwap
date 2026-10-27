
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Add.css";

function Add() {
    const navigate = useNavigate();

    const [booktitle, setBooktitle] = useState("");
    const [author, setAuthor] = useState("");
    const [price, setPrice] = useState("");
    const [categories, setCategories] = useState("Educational");
    const [description, setDescription] = useState("");
    const [bookimg, setBookimg] = useState(null);

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setToast({ message: "", type: "" });

        try {
            const formData = new FormData();

            formData.append("title", booktitle);
            formData.append("author", author);
            formData.append("price", price);
            formData.append("category", categories);
            formData.append("description", description);

            if (bookimg) {
                formData.append("image", bookimg);
            }

            const response = await axios.post(
                "https://bookswap-backend-five.vercel.app/books/",
                formData
            );

            console.log("Book added successfully:", response.data);

            setToast({
                message: `"${booktitle}" has been added successfully!`,
                type: "success"
            });

            setBooktitle("");
            setAuthor("");
            setPrice("");
            setCategories("Educational");
            setDescription("");
            setBookimg(null);

            const fileInput = document.getElementById("book-image");
            if (fileInput) {
                fileInput.value = "";
            }

            setTimeout(() => {
                navigate("/Navbar");
            }, 1800);

        } catch (error) {
            console.error(
                "Book upload error:",
                error.response?.data || error.message
            );

            const errorData = error.response?.data;
            let errorMessage = "Unable to add the book. Please try again.";

            if (errorData?.detail) {
                errorMessage = errorData.detail;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            } else if (errorData && typeof errorData === "object") {
                errorMessage = Object.entries(errorData)
                    .map(([field, messages]) => {
                        const message = Array.isArray(messages)
                            ? messages.join(", ")
                            : String(messages);

                        return `${field}: ${message}`;
                    })
                    .join(" | ");
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
        <div id="add">

            {toast.message && (
                <div
                    className={`add-toast ${toast.type}`}
                    role="status"
                    aria-live="polite"
                >
                    <span className="toast-icon">
                        {toast.type === "success" ? "✓" : "!"}
                    </span>

                    <div className="toast-content">
                        <strong>
                            {toast.type === "success"
                                ? "Book Added Successfully"
                                : "Unable to Add Book"}
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

                <h1>Add New Book</h1>

                <p>
                    Share your book with thousands of readers.
                </p>

                <label>
                    Enter Book Title:

                    <input
                        type="text"
                        value={booktitle}
                        onChange={(e) =>
                            setBooktitle(e.target.value)
                        }
                        required
                    />
                </label>

                <label>
                    Enter Author:

                    <input
                        type="text"
                        value={author}
                        onChange={(e) =>
                            setAuthor(e.target.value)
                        }
                        required
                    />
                </label>

                <label>
                    Enter Price:

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) =>
                            setPrice(e.target.value)
                        }
                        required
                    />
                </label>

                <label>
                    Enter Category:

                    <select
                        value={categories}
                        onChange={(e) =>
                            setCategories(e.target.value)
                        }
                    >
                        <option value="Educational">Educational</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Science">Science</option>
                        <option value="Technology">Technology</option>
                        <option value="Programming">Programming</option>
                        <option value="Novel">Novel</option>
                    </select>
                </label>

                <label>
                    Enter Description:

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        required
                    />
                </label>

                <label>
                    Upload Book Image:

                    <input
                        id="book-image"
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setBookimg(e.target.files?.[0] || null)
                        }
                    />
                </label>

                <button type="submit" disabled={loading}>
                    {loading ? "Adding Book..." : "Add Book"}
                </button>

            </form>

        </div>
    );
}

export default Add;
