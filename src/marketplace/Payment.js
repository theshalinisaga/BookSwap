
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
    const [messageType, setMessageType] = useState("error");
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
        (sum, item) => sum + (Number(item.quantity) || 0),
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
            [name]:
                name === "phone" || name === "pincode"
                    ? value.replace(/\D/g, "")
                    : value,
        }));

        if (message) {
            setMessage("");
        }
    }

    async function handlePlaceOrder(event) {
        event.preventDefault();

        if (loading || cart.length === 0) return;

        setMessage("");
        setMessageType("error");

        const token =
            localStorage.getItem("token") ||
            localStorage.getItem("authToken");

        if (!token) {
            setMessage("Please log in before placing your order.");
            return;
        }

        if (!/^[0-9]{10}$/.test(address.phone.trim())) {
            setMessage("Please enter a valid 10-digit phone number.");
            return;
        }

        if (!/^[0-9]{6}$/.test(address.pincode.trim())) {
            setMessage("Please enter a valid 6-digit PIN code.");
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

            const rawResponse = await response.text();
            let data = {};

            try {
                data = rawResponse ? JSON.parse(rawResponse) : {};
            } catch {
                throw new Error(
                    "The server returned an unexpected response. Please try again."
                );
            }

            if (!response.ok) {
                const details =
                    data.error ||
                    data.detail ||
                    (data.errors
                        ? JSON.stringify(data.errors)
                        : Object.values(data)
                              .flat()
                              .join(" "));

                throw new Error(
                    details || "Unable to place your order."
                );
            }

            const savedOrder = data.order || data;

            if (!savedOrder || !savedOrder.id) {
                throw new Error(
                    "The server did not return an order ID. Please check your orders before trying again."
                );
            }

            setOrderInfo(savedOrder);
            setMessageType("success");
            setMessage("Your order has been placed successfully!");

            localStorage.removeItem(CART_KEY);
            setCart([]);
        } catch (error) {
            setMessage(
                error.message ||
                    "Unable to connect to the server. Please try again."
            );
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    }

    if (orderInfo) {
        return (
            <div className="payment-page">
                <section className="order-success-card">
                    <div className="success-checkmark">✓</div>

                    <p className="payment-eyebrow">BOOKSWAP ORDER CONFIRMATION</p>

                    <h1>Order Placed Successfully!</h1>

                    <p className="success-description">
                        Thank you for shopping with BookSwap. Your order
                        has been received.
                    </p>

                    <div className="order-number-box">
                        <span>ORDER NUMBER</span>
                        <strong>#{orderInfo.id}</strong>
                    </div>

                    <div className="confirmation-details">
                        <div>
                            <span>Payment method</span>
                            <strong>Cash on Delivery</strong>
                        </div>

                        <div>
                            <span>Amount to pay</span>
                            <strong>
                                ₹
                                {Number(
                                    orderInfo.total_amount ?? totalPrice
                                ).toFixed(2)}
                            </strong>
                        </div>

                        <div>
                            <span>Order status</span>
                            <strong className="order-status">
                                {orderInfo.status || "Placed"}
                            </strong>
                        </div>

                        <div>
                            <span>Estimated delivery</span>
                            <strong>
                                {orderInfo.estimated_delivery ||
                                    "To be confirmed"}
                            </strong>
                        </div>
                    </div>

                    <p className="success-note">
                        Please keep the payment amount ready when your
                        books arrive.
                    </p>

                    <Link to="/" className="success-shopping-btn">
                        Continue Shopping →
                    </Link>
                </section>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-header">
                <p className="payment-eyebrow">BOOKSWAP CHECKOUT</p>
                <h1>Complete Your Order</h1>
                <p>
                    Add your delivery details and place your order securely.
                </p>

                <div className="checkout-progress">
                    <span className="progress-step completed">
                        <span>✓</span> Cart
                    </span>
                    <span className="progress-line"></span>
                    <span className="progress-step active">
                        <span>2</span> Delivery
                    </span>
                    <span className="progress-line"></span>
                    <span className="progress-step">
                        <span>3</span> Confirmation
                    </span>
                </div>
            </div>

            <div className="payment-layout">
                <form
                    className="payment-methods"
                    onSubmit={handlePlaceOrder}
                >
                    <div className="section-heading">
                        <div className="section-heading-icon">⌖</div>
                        <div>
                            <h2>Delivery Details</h2>
                            <p>
                                Where should we deliver your books?
                            </p>
                        </div>
                    </div>

                    <div className="delivery-form-grid">
                        <label className="form-field full-width">
                            <span>Full Name <b>*</b></span>
                            <input
                                name="full_name"
                                type="text"
                                value={address.full_name}
                                onChange={handleChange}
                                placeholder="Enter recipient's full name"
                                required
                                maxLength={150}
                                autoComplete="name"
                            />
                        </label>

                        <label className="form-field full-width">
                            <span>Phone Number <b>*</b></span>
                            <div className="phone-input-wrap">
                                <span className="country-code">+91</span>
                                <input
                                    name="phone"
                                    type="tel"
                                    value={address.phone}
                                    onChange={handleChange}
                                    placeholder="10-digit mobile number"
                                    required
                                    maxLength={10}
                                    inputMode="numeric"
                                    pattern="[0-9]{10}"
                                    autoComplete="tel-national"
                                />
                            </div>
                        </label>

                        <label className="form-field full-width">
                            <span>Complete Address <b>*</b></span>
                            <textarea
                                name="address_line"
                                value={address.address_line}
                                onChange={handleChange}
                                placeholder="House/flat number, street, area, landmark"
                                required
                                maxLength={255}
                                rows={4}
                                autoComplete="street-address"
                            />
                            <small>
                                Include your house number and nearby landmark.
                            </small>
                        </label>

                        <label className="form-field">
                            <span>City <b>*</b></span>
                            <input
                                name="city"
                                type="text"
                                value={address.city}
                                onChange={handleChange}
                                placeholder="Your city"
                                required
                                autoComplete="address-level2"
                            />
                        </label>

                        <label className="form-field">
                            <span>State <b>*</b></span>
                            <input
                                name="state"
                                type="text"
                                value={address.state}
                                onChange={handleChange}
                                placeholder="Your state"
                                required
                                autoComplete="address-level1"
                            />
                        </label>

                        <label className="form-field full-width">
                            <span>PIN Code <b>*</b></span>
                            <input
                                name="pincode"
                                type="text"
                                value={address.pincode}
                                onChange={handleChange}
                                placeholder="6-digit PIN code"
                                required
                                maxLength={6}
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                autoComplete="postal-code"
                            />
                        </label>
                    </div>

                    <div className="payment-divider"></div>

                    <div className="section-heading payment-heading">
                        <div className="section-heading-icon">₹</div>
                        <div>
                            <h2>Payment Method</h2>
                            <p>Simple and convenient payment on delivery.</p>
                        </div>
                    </div>

                    <div className="payment-option selected">
                        <span className="payment-icon">₹</span>
                        <span className="payment-option-text">
                            <strong>Cash on Delivery</strong>
                            <small>
                                Pay when your books are delivered to you.
                            </small>
                        </span>
                        <span className="selected-indicator">✓</span>
                    </div>

                    {message && (
                        <div
                            className={`payment-message ${messageType}`}
                            role="alert"
                            aria-live="polite"
                        >
                            <span>
                                {messageType === "success" ? "✓" : "!"}
                            </span>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="pay-now-btn"
                        disabled={loading || cart.length === 0}
                    >
                        {loading ? (
                            <>
                                <span className="button-spinner"></span>
                                Processing Your Order...
                            </>
                        ) : (
                            <>
                                Place COD Order
                                <span>₹{totalPrice.toFixed(2)} →</span>
                            </>
                        )}
                    </button>

                    <div className="checkout-assurance">
                        <span>✓</span>
                        No online payment required. Pay cash on delivery.
                    </div>

                    <Link to="/cart" className="back-to-cart">
                        ← Back to Cart
                    </Link>
                </form>

                <aside className="payment-summary">
                    <div className="summary-heading">
                        <div>
                            <h2>Order Summary</h2>
                            <p>
                                {totalItems}{" "}
                                {totalItems === 1 ? "book" : "books"} in your cart
                            </p>
                        </div>
                        <span className="summary-bag">▤</span>
                    </div>

                    <div className="summary-books">
                        {cart.map((item) => (
                            <div
                                className="payment-book-row"
                                key={item.id}
                            >
                                <div className="book-quantity-badge">
                                    {item.quantity || 1}
                                </div>

                                <div className="summary-book-info">
                                    <strong>{item.title}</strong>
                                    <small>
                                        {item.author || "BookSwap collection"}
                                    </small>
                                    <small>
                                        Qty: {item.quantity || 1}
                                    </small>
                                </div>

                                <span className="book-line-price">
                                    ₹
                                    {(
                                        (Number(item.price) || 0) *
                                        (Number(item.quantity) || 0)
                                    ).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="summary-calculations">
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
                    </div>

                    <div className="summary-delivery-note">
                        <span>🚚</span>
                        <div>
                            <strong>Delivery estimate</strong>
                            <p>
                                Confirmed after your order is processed.
                            </p>
                        </div>
                    </div>

                    <div className="payment-security">
                        <span>✓</span>
                        Your order details will be submitted securely over
                        HTTPS.
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default Payment;
