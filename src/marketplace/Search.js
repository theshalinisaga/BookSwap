
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Search.css";

function Search({ onSearch }) {
    const [arr, setA] = useState([]);
    const [result, setR] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const fetchBooks = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/books/"
                );

                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.results)
                        ? response.data.results
                        : [];

                if (active) {
                    setA(data);
                    setError("");
                }
            } catch (err) {
                console.error("Failed to fetch books:", err);

                if (active) {
                    setError("Unable to load books. Please check Django.");
                }
            }
        };

        fetchBooks();

        return () => {
            active = false;
        };
    }, []);

    function ser(e) {
        const value = e.target.value;
        const query = value.trim().toLowerCase();

        setKeyword(value);

        if (onSearch) {
            onSearch(value);
        }

        if (!query) {
            setR([]);
            return;
        }

        const matches = arr.filter((book) =>
            [book.title, book.author, book.category].some((field) =>
                String(field || "").toLowerCase().includes(query)
            )
        );

        setR(matches);
    }

    function rel(book) {
        const title = book.title || "";

        setKeyword(title);
        setR([]);

        if (onSearch) {
            onSearch(title);
        }
    }

    return (
        <div className="book-search">
            <li id="ser">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search by book title, author, or category..."
                    value={keyword}
                    onChange={ser}
                    autoComplete="off"
                />
            </li>

            {error && <p role="alert">{error}</p>}

            {keyword.trim() !== "" && result.length > 0 && (
                <ul id="ser1">
                    {result.map((item) => (
                        <li
                            key={item.id}
                            onClick={() => rel(item)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") rel(item);
                            }}
                            role="button"
                            tabIndex={0}
                        >
                            {item.image && (
                                <img
                                    src={
                                        item.image.startsWith("http")
                                            ? item.image
                                            : `http://127.0.0.1:8000${item.image.startsWith("/") ? "" : "/"}${item.image}`
                                    }
                                    id="img"
                                    alt={item.title || "Book"}
                                />
                            )}

                            <span>
                                {item.title}
                                {item.author ? ` — ${item.author}` : ""}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {keyword.trim() !== "" &&
                !error &&
                result.length === 0 && (
                    <p className="search-empty">
                        No matching books found.
                    </p>
                )}
        </div>
    );
}

export default Search;
