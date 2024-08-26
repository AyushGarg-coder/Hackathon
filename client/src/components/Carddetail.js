
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useLocation, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './Checkoutform';
import './Addbooks.css';
import { toast, ToastContainer } from 'react-toastify';

const pincodeInitialValue = {
    title: '',
    pincode: '',
    director: '' // Changed from 'author' to 'director'
};

const Carddetail = () => {
    const [stripePromise, setStripePromise] = useState(null);
    const [price, setPrice] = useState(0);
    const { id } = useParams();
    const location = useLocation();
    const { email, username } = location.state || {};
    const [data, setData] = useState(null);
    const [pincode, setPincode] = useState(pincodeInitialValue);
    const [response, setResponse] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get(`http://localhost:3001/moviedata?id=${id}`); // Updated endpoint to movie-specific
                setData(result.data);
                setPrice(parseFloat(result.data.price));
            } catch (error) {
                toast.error('Error fetching movie data');
            }
        };

        const fetchStripe = async () => {
            const stripe = await loadStripe(process.env.REACT_APP_PUBLIC_KEY);
            setStripePromise(stripe);
        };

        fetchData();
        fetchStripe();
    }, [id]);

    const handlePincodeChange = (e) => {
        if (e.target.value) {
            setPincode({ ...pincode, [e.target.name]: e.target.value, title: data.title, director: data.director });
        } else {
            toast.error('Invalid Pincode', { autoClose: 2000 });
            setPincode(pincodeInitialValue);
        }
    };

    const handlePincode = async (e) => {
        e.preventDefault();
        try {
            const result = await axios.post('http://localhost:3001/moviedate', { pincode });
            if (result.status === 200) {
                setResponse('Pincode is valid');
                toast.success('Pincode validated successfully');
            } else {
                setResponse(result.data);
                toast.info(result.data);
                setPincode(pincodeInitialValue);
            }
        } catch (error) {
            toast.error('Error validating pincode');
        }
    };

    const handleCart = async () => {
        try {
            const user = sessionStorage.getItem('username');
            const response = await axios.post('http://localhost:3001/addtocart/save', { data, user });
            if (response.status === 200) {
                toast.success('Added to cart successfully');
            }
        } catch (error) {
            toast.error('Error adding to cart');
        }
    };

    const handlePayment = () => {
        try {
            ReactDOM.render(
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        price={price}
                        email={email}
                        username={username}
                        title={data.title}
                        director={data.director} // Updated from 'author' to 'director'
                        img={data.url1}
                    />
                </Elements>,
                document.getElementById('checkout-form-container')
            );
        } catch (error) {
            toast.error('Error rendering CheckoutForm:', error);
        }
    };

    return (
        data && (
            <div className="container-fluid mt-1 mb-5 min-vh-100">
                <div className="row g-0 mt-5 d-flex">
                    <div className="col-3 me-auto ms-auto mb-md-5 mb-sm-5" style={{ width: '273px' }}>
                        <img
                            src={data.url2}
                            alt="Movie Poster"
                            className="img-fluid border"
                            width='300px'
                            height='auto'
                        />
                    </div>
                    <div className="col-6 ms-auto me-auto mb-md-5 mb-sm-5 small">
                        <p className='fw-bold fs-1 mb-0'>{data.title}</p>
                        <div className='d-flex flex-row text-success mt-3' style={{ fontSize: '13px' }}>
                            <p>Director: {data.director}</p> {/* Updated from 'author' to 'director' */}
                            <p className='mx-1'>|</p>
                            <p className='mx-2'>Format: {data.format || 'Digital'}</p>
                            <p className='mx-1'>|</p>
                            <p>Genre: {data.genre}</p>
                        </div>
                        <hr className=''/>
                        <div>
                            <p>{data.description}</p>
                        </div>
                        <div>
                            <button className='btn btn-outline-primary p-2'>Book Ticket @ Rs.{data.price}</button>
                        </div>
                        <div className='mt-4 fw-bold'>
                            {/* Also Available On */}
                            <p className='fw-bold fs-4 text-dark-emphasis mb-0'>Casts</p>
                        </div>
                        <hr />
                        <div className='mt-0'>
                            <p className='mt-0'>{data.cast}</p>
                        </div>
                    </div>
                    <div className="col-3 border border-2 ms-auto me-auto small" id="checkout-form-container" style={{ width: '350px' }}>
                        <div>
                            <div className='d-flex flex-row me-3 ms-3 mt-4'>
                                <p className='me-2 text-dark m-2 fw-bold'>Digital</p>
                                <p className='text-danger fs-4 fw-bold'>Rs. {price}</p>
                            </div>
                            <p className='ms-4 mt-0 fw-light' style={{ fontSize: '14px' }}>Inclusive of all Taxes</p>
                            <div className='border border-success border-2 m-auto rounded p-3' style={{ width: '310px', background: '#f8fff9' }}>
                                <p className='fs-5 fw-bold'>Tickets</p>
                                <div className='d-flex flex-row'>
                                    <input type='date' className='form-control no-border w-75' name="pincode" onChange={handlePincodeChange} value={pincode.pincode} placeholder='Date' maxLength={6} />
                                    <button className='btn btn-warning w-25 p-0' onClick={handlePincode}><span className="ms-auto me-auto fw-bold" style={{ fontSize: '10px' }}>Check</span></button>
                                </div>
                                <hr />
                                <div>
                                    <p className='text-success fw-bold mt-4 ms-4 me-4' style={{ fontSize: '15px' }}>{response || 'Estimated Delivery In 2 Days'}</p>
                                    <p className='text-dark fw-normal mb-0 ms-4 me-4' style={{ fontSize: '14px' }}>Enter Pincode to check Availability</p>
                                    <ToastContainer />
                                </div>
                            </div>
                            <div className='m-4'>
                                <button className='btn btn-outline-danger rounded-pill mb-3 ms-auto me-auto' onClick={handleCart} style={{ padding: '14px 40px 12px' }}>ADD TO CART</button>
                                <button className='btn btn-outline-danger rounded-pill mb-4 ms-auto me-auto' onClick={handlePayment} style={{ padding: '14px 40px 12px' }}>BUY NOW</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    );
};

export default Carddetail;

