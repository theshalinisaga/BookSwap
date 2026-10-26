
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";

const CART_KEY = "bookswap_cart";
const API_BASE = "http://127.0.0.1:8000";

function readCart() {
    try {
        const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function getImageUrl(image) {
    if (!image) return "";

    if (image.startsWith("http")) return image;

    return `${API_BASE}${image.startsWith("/") ? "" : "/"}${image}`;
}

function Cart() {
    const [cart, setCart] = useState(readCart);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }, [cart]);

    function updateCart(updatedCart) {
        setCart(updatedCart);
        localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
    }

    function increaseQuantity(id) {
        updateCart(
            cart.map((item) =>
                String(item.id) === String(id)
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }

    function decreaseQuantity(id) {
        updateCart(
            cart
                .map((item) =>
                    String(item.id) === String(id)
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeBook(id) {
        updateCart(
            cart.filter((item) => String(item.id) !== String(id))
        );
    }

    function clearCart() {
        updateCart([]);
    }

    const totalItems = cart.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    const totalPrice = cart.reduce(
        (sum, item) =>
            sum +
            (Number(item.price) || 0) *
            (Number(item.quantity) || 0),
        0
    );

    return (
        <div className="cart-page">
            <div className="cart-heading">
                <div>
                    <p className="cart-eyebrow">YOUR BOOK COLLECTION</p>
                    <h1>Shopping Cart</h1>
                    <p className="cart-subtitle">
                        Review your books before checkout.
                    </p>
                </div>

                <Link to="/browsebooks" className="continue-shopping">
                    ← Continue Shopping
                </Link>
            </div>

            {cart.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-cart-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>
                        Browse our collection and add books you love.
                    </p>

                    <Link to="/browsebooks" className="checkout-btn">
                        Browse Books
                    </Link>
                </div>
            ) : (
                <>
                    <div className="cart-layout">
                        <section className="cart-items">
                            <div className="cart-items-heading">
                                <h2>Your Books ({totalItems})</h2>

                                <button
                                    type="button"
                                    className="clear-cart-btn"
                                    onClick={clearCart}
                                >
                                    Clear Cart
                                </button>
                            </div>

                            {cart.map((item) => (
                                <article
                                    className="cart-item"
                                    key={item.id}
                                >
                                    {item.image ? (
                                        <img
                                            src={getImageUrl(item.image)}
                                            alt={item.title}
                                            className="cart-item-image"
                                            onError={(event) => {
                                                event.currentTarget.style.display =
                                                    "none";
                                            }}
                                        />
                                    ) : (
                                        <div className="cart-item-placeholder">
                                            📚
                                        </div>
                                    )}

                                    <div className="cart-item-info">
                                        <h3>{item.title}</h3>
                                        <p>
                                            By {item.author || "Unknown Author"}
                                        </p>
                                        <strong>
                                            ₹{(Number(item.price) || 0).toFixed(2)}
                                        </strong>

                                        <div className="quantity-control">
                                            <button
                                                type="button"
                                                aria-label={`Decrease quantity of ${item.title}`}
                                                onClick={() =>
                                                    decreaseQuantity(item.id)
                                                }
                                            >
                                                −
                                            </button>

                                            <span>{item.quantity}</span>

                                            <button
                                                type="button"
                                                aria-label={`Increase quantity of ${item.title}`}
                                                onClick={() =>
                                                    increaseQuantity(item.id)
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    <div className="cart-item-end">
                                        <strong>
                                            ₹
                                            {(
                                                (Number(item.price) || 0) *
                                                item.quantity
                                            ).toFixed(2)}
                                        </strong>

                                        <button
                                            type="button"
                                            className="remove-book-btn"
                                            onClick={() => removeBook(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </section>

                        <aside className="cart-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Total books</span>
                                <span>{totalItems}</span>
                            </div>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>₹{totalPrice.toFixed(2)}</span>
                            </div>

                            <div className="summary-row">
                                <span>Delivery</span>
                                <span>Calculated at checkout</span>
                            </div>

                            <div className="summary-total">
                                <span>Book total</span>
                                <strong>₹{totalPrice.toFixed(2)}</strong>
                            </div>

                            <p className="cart-note">
                                Delivery charges, if applicable, may be added
                                during checkout.
                            </p>

                            <button
                                type="button"
                                className="checkout-btn"
                                onClick={() => navigate("/payment")}
                            >
                                Proceed to Payment →
                            </button>

                            <p className="secure-note">
                                🔒 Secure checkout
                            </p>
                        </aside>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;
