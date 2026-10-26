import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Navbar from './auth/Navbar';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Browsebooks from './auth/Browsebooks';
import Categories from './auth/Categories';
import Login from './auth/Login';
import Register from './auth/Register';
import Add from './book/Add';
import Cart from './marketplace/Cart';
import Payment from './marketplace/Payment';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Open the landing/navbar page directly when the app starts. */}
        <Route path="/" element={<Navbar />} />
        <Route path="/Navbar" element={<Navbar />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/browsebooks" element={<Browsebooks />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add" element={<Add />} />
        <Route path="/Add" element={<Navigate to="/add" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
         <Route path="/cart" element={<Cart />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
