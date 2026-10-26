import React, { useState } from "react";
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

    const handleSubmit = async (e) => {

        e.preventDefault();

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
                "http://127.0.0.1:8000/books/",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log("Book added successfully:", response.data);

            alert("🎉 Book added successfully!");

            // Clear form
            setBooktitle("");
            setAuthor("");
            setPrice("");
            setCategories("Educational");
            setDescription("");
            setBookimg(null);

            // Go to Navbar/Home
            navigate("/Navbar");

        } catch (error) {

            console.log(
                "Book upload error:",
                error.response?.data || error.message
            );

            alert(
                JSON.stringify(
                    error.response?.data ||
                    "Book upload failed"
                )
            );
        }
    };

    return (
        <div id="add">

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

                        <option value="Educational">
                            Educational
                        </option>

                        <option value="Fiction">
                            Fiction
                        </option>

                        <option value="Science">
                            Science
                        </option>

                        <option value="Technology">
                            Technology
                        </option>

                        <option value="Programming">
                            Programming
                        </option>

                        <option value="Novel">
                            Novel
                        </option>

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
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setBookimg(e.target.files[0])
                        }
                    />

                </label>


                <button type="submit">
                    Add Book
                </button>

            </form>

        </div>
    );
}

export default Add;