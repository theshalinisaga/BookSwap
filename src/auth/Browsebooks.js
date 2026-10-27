
import React, { useEffect, useState } from "react";
import axios from "axios";
import Search from "../marketplace/Search";
import "../marketplace/Search.css";
import "./Browsebooks.css";

const CART_KEY = "bookswap_cart";

function Browsebooks() {
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cartCount, setCartCount] = useState(0);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(() => {
            setToast(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        const updateCartCount = () => {
            try {
                const cart = JSON.parse(
                    localStorage.getItem(CART_KEY) || "[]"
                );

                setCartCount(
                    cart.reduce(
                        (total, item) => total + (Number(item.quantity) || 0),
                        0
                    )
                );
            } catch {
                setCartCount(0);
            }
        };

        updateCartCount();
        window.addEventListener("storage", updateCartCount);

        return () => {
            window.removeEventListener("storage", updateCartCount);
        };
    }, []);

    useEffect(() => {
        let active = true;

        async function fetchBooks() {
            try {
                setLoading(true);
                setError("");

                const response = await axios.get(
                    "https://bookswap-backend-five.vercel.app/books/"
                );

                const data = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response.data?.results)
                        ? response.data.results
                        : [];

                if (active) {
                    setBooks(data);
                    setFilteredBooks(data);
                }
            } catch (err) {
                console.error("Error fetching books:", err);

                if (active) {
                    setError(
                        "Unable to load books. Please check the Django server."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        fetchBooks();

        return () => {
            active = false;
        };
    }, []);

    function handleSearch(value) {
        const query = value.trim().toLowerCase();

        if (!query) {
            setFilteredBooks(books);
            return;
        }

        setFilteredBooks(
            books.filter((book) =>
                [
                    book.title,
                    book.author,
                    book.category,
                    book.description
                ].some((field) =>
                    String(field || "").toLowerCase().includes(query)
                )
            )
        );
    }

    function addToCart(book) {
        try {
            const cart = JSON.parse(
                localStorage.getItem(CART_KEY) || "[]"
            );

            if (!Array.isArray(cart)) {
                throw new Error("Invalid cart data");
            }

            const existingBook = cart.find(
                (item) => String(item.id) === String(book.id)
            );

            if (existingBook) {
                existingBook.quantity =
                    (Number(existingBook.quantity) || 0) + 1;
            } else {
                cart.push({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    price: Number(book.price) || 0,
                    image: book.image || "",
                    quantity: 1
                });
            }

            localStorage.setItem(CART_KEY, JSON.stringify(cart));

            setCartCount(
                cart.reduce(
                    (total, item) => total + (Number(item.quantity) || 0),
                    0
                )
            );

            setToast({
                type: "success",
                title: "Added to Your Cart!",
                message: `${book.title} has been added to your cart successfully.`
            });
        } catch (err) {
            console.error("Could not update cart:", err);

            setToast({
                type: "error",
                title: "Unable to Add Book",
                message: "Something went wrong. Please try again."
            });
        }
    }

    function openCart() {
        window.location.href = "/cart";
    }

    return (
        <div id="browsebooks">
            {toast && (
                <div
                    className={`cart-toast ${toast.type}`}
                    role="status"
                    aria-live="polite"
                >
                    <span className="cart-toast-icon">
                        {toast.type === "success" ? "✓" : "!"}
                    </span>

                    <div className="cart-toast-content">
                        <strong>{toast.title}</strong>
                        <p>{toast.message}</p>
                    </div>

                    <button
                        type="button"
                        className="cart-toast-close"
                        onClick={() => setToast(null)}
                        aria-label="Close notification"
                    >
                        ×
                    </button>
                </div>
            )}

            <div id="d">
                <h1>Browse Books</h1>
                <h3>
                    Discover great books and give them a new home.
                </h3>
            </div>

            <div id="d1">
                <button
                    type="button"
                    onClick={() => setFilteredBooks(books)}
                >
                    All Categories
                </button>

                <button
                    type="button"
                    onClick={() => window.location.reload()}
                >
                    Refresh Books
                </button>

                <button
                    type="button"
                    className="cart-top-btn"
                    onClick={openCart}
                >
                    🛒 Cart ({cartCount})
                </button>
            </div>

            <Search onSearch={handleSearch} />

            <div id="books">
                {loading ? (
                    <h2 className="loading">Loading books...</h2>
                ) : error ? (
                    <div className="loading">
                        <h2>{error}</h2>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                        >
                            Try Again
                        </button>
                    </div>
                ) : filteredBooks.length === 0 ? (
                    <h2 className="loading">
                        {books.length === 0
                            ? "No books available yet."
                            : "No matching books found."}
                    </h2>
                ) : (
                    <div className="books-container">
                        {filteredBooks.map((book) => (
                            <div className="book-card" key={book.id}>
                                {book.image ? (
                                    <img
                                        src={
                                            book.image.startsWith("http")
                                                ? book.image
                                                : `http://127.0.0.1:8000${book.image.startsWith("/") ? "" : "/"}${book.image}`
                                        }
                                        alt={book.title}
                                        className="book-image"
                                        onError={(e) => {
                                            e.currentTarget.style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <div className="no-image">
                                        No Image
                                    </div>
                                )}

                                <span className="category">
                                    {book.category || "General"}
                                </span>

                                <h3 className="book-title">
                                    {book.title}
                                </h3>

                                <p className="book-author">
                                    By {book.author || "Unknown"}
                                </p>

                                <p className="book-description">
                                    {book.description || "No description available."}
                                </p>

                                <div className="book-price">
                                    ₹{Number(book.price || 0).toFixed(2)}
                                </div>

                                <button
                                    type="button"
                                    className="book-btn"
                                    onClick={() => addToCart(book)}
                                >
                                    🛒 Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Browsebooks;
