
import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

function textLimiter(str, limit) {
    return str.length > limit ? str.substring(0, limit) + '...' : str;
}

const Addtocartcard = ({ item, setChange }) => {
    const [quantity, setQuantity] = useState(item.quantity);
    const [title, setTitle] = useState(item.title); // Adjusted from 'name'
    const [price, setPrice] = useState(item.price);
    
    // Calculate estimated delivery date
    const date = new Date();
    date.setDate(date.getDate() + 2);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const estimatedDate = date.toLocaleDateString('en-US', options);

    // Decrease quantity
    const handleQuantityDecrease = async (e) => {
        e.preventDefault();
        try {
            if (quantity > 1) {
                setQuantity(quantity - 1);
                updateItemQuantity(item._id, quantity - 1);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Increase quantity
    const handleQuantityIncrease = async (e) => {
        e.preventDefault();
        try {
            setQuantity(quantity + 1);
            updateItemQuantity(item._id, quantity + 1);
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Remove item from cart
    const handleRemove = async () => {
        try {
            const user = sessionStorage.getItem('username');
            const id = item._id;
            const response = await axios.post('https://hackathon-r38q.onrender.com/removecart', { id, user });
            if (response.status === 200) {
                setChange(true);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Update item quantity in cart
    const updateItemQuantity = async (id, count) => {
        try {
            const user = sessionStorage.getItem('username');
            const response = await axios.post('https://hackathon-r38q.onrender.com/updatequantity', { count, id, user });
            if (response.status === 200) {
                setChange(true);
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    // Handle manual input change for quantity
    const handleChange = async (e) => {
        e.preventDefault();
        try {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value) && value >= 1) {
                setQuantity(value);
            }
        } catch (err) {
            console.log(err.message);
        }
    };

    return (
        <div className="container border mt-2 rounded">
            <div className="row">
                <div className="card mt-2 mb-3 border-0">
                    <div className="row g-0">
                        <div className="col-md-4 d-flex flex-column align-items-center">
                            <img
                                src={item.img}
                                className="img-fluid mb-2"
                                style={{ objectFit: 'cover', width: '100%', height: '14rem', width: '10rem' }}
                                alt={title}
                            />
                            <div className="container-fluid d-flex flex-row mb-2">
                                <button className="btn btn-outline-primary w-25" onClick={handleQuantityDecrease}>-</button>
                                <input
                                    type="number"
                                    className="text-center w-75 form-control"
                                    placeholder="1"
                                    onChange={handleChange}
                                    value={quantity}
                                    min={1}
                                    readOnly
                                />
                                <button className="btn btn-outline-primary w-25" onClick={handleQuantityIncrease}>+</button>
                            </div>
                        </div>
                        <div className="col-md-8 mt-0">
                            <div className="card-body">
                                <h1 className="alert alert-warning fs-3">{textLimiter(title, 35)}</h1>
                                <p className="mb-1">Format: Digital</p> {/* Updated format */}
                                <p className="fw-bold mb-1 mt-25 mb-2">Rs. {price}</p>
                                <div className="d-flex flex-row flex-wrap justify-content-between">
                                    <div>
                                        <p className="fw-bold mb-1">{estimatedDate}</p>
                                        <p className="mb-0">Estimated Delivery</p>
                                    </div>
                                    <div>
                                        <p className="fw-bold mb-1">Rs. 10</p>
                                        <p className="mb-0">Shipping and Handling</p>
                                    </div>
                                </div>
                                <button type="button" className="btn btn-outline-primary mt-2 p-3" onClick={handleRemove}>
                                    <i className="fa fa-trash-o me-1"></i> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Addtocartcard;
