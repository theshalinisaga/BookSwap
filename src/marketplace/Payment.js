
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Payment.css";

const CART_KEY = "bookswap_cart";
const API_URL = "https://bookswap-backend-five.vercel.app/api/orders/";
const SHIPPING_FEE = 50;

function readCart() {
    try {
        const data = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

function Payment() {
    const [cart, setCart] = useState(readCart);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderInfo, setOrderInfo] = useState(null);
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: "",
    });

    useEffect(() => {
        if (cart.length === 0 && !orderInfo) {
            navigate("/cart", { replace: true });
        }
    }, [cart.length, orderInfo, navigate]);

    const totalItems = cart.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
    );

    const subtotal = cart.reduce(
        (sum, item) =>
            sum +
            (Number(item.price) || 0) *
                (Number(item.quantity) || 0),
        0
    );

    const totalPrice = subtotal + SHIPPING_FEE;

    function handleChange(event) {
        const { name, value } = event.target;

        setAddress((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handlePlaceOrder(event) {
        event.preventDefault();
        setMessage("");

        if (loading || cart.length === 0) return;

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("authToken");

        if (!token) {
            setMessage(
                "Please log in first. Your login token was not found."
            );
            return;
        }

        if (!/^[0-9]{10}$/.test(address.phone.trim())) {
            setMessage("Enter a valid 10-digit phone number.");
            return;
        }

        if (!/^[0-9]{6}$/.test(address.pincode.trim())) {
            setMessage("Enter a valid 6-digit PIN code.");
            return;
        }

        const payload = {
            ...address,
            items: cart.map((item) => ({
                book: item.id,
                quantity: Number(item.quantity) || 1,
            })),
        };

        setLoading(true);

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) {
                const details = data.error ||
                    data.detail ||
                    Object.values(data).flat().join(" ");

                throw new Error(
                    details || "Unable to place your order."
                );
            }

            const savedOrder = data.order;

            if (!savedOrder || !savedOrder.id) {
                throw new Error(
                    "The server response did not include an order ID."
                );
            }

            localStorage.removeItem(CART_KEY);
            setCart([]);
            setOrderInfo(savedOrder);
            setMessage("Your COD order was placed successfully!");
        } catch (error) {
            setMessage(
                error.message ||
                    "Could not connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    if (orderInfo) {
        return (
            <div className="payment-page">
                <section className="payment-methods">
                    <h1>Order Placed Successfully!</h1>
                    <p>{message}</p>
                    <h2>Order #{orderInfo.id}</h2>
                    <p>Payment: Cash on Delivery</p>
                    <p>
                        Amount to pay on delivery: ₹
                        {Number(orderInfo.total_amount).toFixed(2)}
                    </p>
                    <p>
                        Order status: {orderInfo.status}
                    </p>
                    <p>
                        Estimated delivery:{" "}
                        {orderInfo.estimated_delivery || "To be confirmed"}
                    </p>
                    <Link to="/" className="back-to-cart">
                        Continue Shopping
                    </Link>
                </section>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-header">
                <p className="payment-eyebrow">BOOKSWAP CHECKOUT</p>
                <h1>Cash on Delivery</h1>
                <p>Pay in cash when your books arrive.</p>
            </div>

            <div className="payment-layout">
                <form
                    className="payment-methods"
                    onSubmit={handlePlaceOrder}
                >
                    <h2>Delivery Details</h2>

                    <label>
                        Full Name
                        <input
                            name="full_name"
                            value={address.full_name}
                            onChange={handleChange}
                            required
                            maxLength={150}
                            autoComplete="name"
                        />
                    </label>

                    <label>
                        Phone Number
                        <input
                            name="phone"
                            type="tel"
                            value={address.phone}
                            onChange={handleChange}
                            required
                            maxLength={10}
                            inputMode="numeric"
                            autoComplete="tel"
                        />
                    </label>

                    <label>
                        Delivery Address
                        <textarea
                            name="address_line"
                            value={address.address_line}
                            onChange={handleChange}
                            required
                            maxLength={255}
                            autoComplete="street-address"
                        />
                    </label>

                    <label>
                        City
                        <input
                            name="city"
                            value={address.city}
                            onChange={handleChange}
                            required
                            autoComplete="address-level2"
                        />
                    </label>

                    <label>
                        State
                        <input
                            name="state"
                            value={address.state}
                            onChange={handleChange}
                            required
                            autoComplete="address-level1"
                        />
                    </label>

                    <label>
                        PIN Code
                        <input
                            name="pincode"
                            value={address.pincode}
                            onChange={handleChange}
                            required
                            maxLength={6}
                            inputMode="numeric"
                            autoComplete="postal-code"
                        />
                    </label>

                    <div className="payment-option selected">
                        <span className="payment-icon">₹</span>
                        <span className="payment-option-text">
                            <strong>Cash on Delivery</strong>
                            <small>
                                Pay cash when the order is delivered.
                            </small>
                        </span>
                    </div>

                    {message && (
                        <div className="payment-message" role="status">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="pay-now-btn"
                        disabled={loading || cart.length === 0}
                    >
                        {loading
                            ? "Placing Order..."
                            : `Place COD Order · ₹${totalPrice.toFixed(2)}`}
                    </button>

                    <p className="payment-disclaimer">
                        No online payment is required.
                    </p>

                    <Link to="/cart" className="back-to-cart">
                        ← Back to Cart
                    </Link>
                </form>

                <aside className="payment-summary">
                    <h2>Order Summary</h2>

                    {cart.map((item) => (
                        <div
                            className="payment-book-row"
                            key={item.id}
                        >
                            <div>
                                <strong>{item.title}</strong>
                                <small>
                                    Quantity: {item.quantity}
                                </small>
                            </div>
                            <span>
                                ₹
                                {(
                                    (Number(item.price) || 0) *
                                    (Number(item.quantity) || 0)
                                ).toFixed(2)}
                            </span>
                        </div>
                    ))}

                    <div className="payment-total-row">
                        <span>Total books</span>
                        <span>{totalItems}</span>
                    </div>

                    <div className="payment-total-row">
                        <span>Subtotal</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                    </div>

                    <div className="payment-total-row">
                        <span>Delivery fee</span>
                        <span>₹{SHIPPING_FEE.toFixed(2)}</span>
                    </div>

                    <div className="payment-total-row grand-total">
                        <strong>Total Amount</strong>
                        <strong>₹{totalPrice.toFixed(2)}</strong>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Payment;
