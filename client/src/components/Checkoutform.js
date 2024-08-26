import React, { useContext, useEffect, useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CheckoutForm = ({ price, email, username,title,director,img}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(price);
    
    console.log("checkout from", username, email)

    // console.log(account)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        if (!stripe || !elements) {
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,

                billing_details: {
                    email: sessionStorage.getItem('email'),
                    name: sessionStorage.getItem('username')
                }
            }, {
                amount: amount * 100, // Convert to cents
                currency: 'inr', // Indian Rupees
            }
            );
            if (error) {
                console.error('Error creating payment method:', error);
                setError(error.message);
            } else {
                console.log('Payment Method created:', paymentMethod);


                const response = await fetch('http://localhost:3001/api/checkout/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ payment_method_id: paymentMethod.id, amount: amount * 100, email: sessionStorage.getItem('email'), username: sessionStorage.getItem('username'),title:title,director:director,img:img }),
                })
                if (response.ok) {
                    toast.success('Payment Sucessfull', { position: 'top-right' });
                    if (cardElement) {
                        cardElement.clear();
                    }
                }
                else {
                    toast.error('Payment Unsuccessfull');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Payment failed. Please try again.');
            toast.error('Payment failed. Please try again.', { position: 'top-right' });
        }

        setLoading(false);
    };


    return (
        <form onSubmit={handleSubmit} className='p-3'>
            <ToastContainer />
            <div style={{ maxWidth: '600px', margin: 'auto' }}>
                <h1 htmlFor="card-element" className='alert alert-primary fs-6' style={{ textAlign: 'center' }}>
                    Payment Gateway
                </h1>
                <CardElement
                    id="card-element" className='mt-4'
                    options={{
                        style: {
                            base: {
                                fontSize: '16px',
                                fontFamily: 'Arial, sans-serif',
                                color: '#424770',
                                '::placeholder': {
                                    color: '#aab7c4',
                                },
                            },
                            invalid: {
                                color: '#9e2146',
                            },
                        },
                    }}
                />
                {error && (
                    <div className="alert alert-danger mt-3" role="alert">
                        {error}
                    </div>
                )}
                <button
                    className="btn btn-primary mt-4"
                    type="submit"
                    disabled={!stripe || loading}
                >
                    {loading ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </form>
    );
};

export default CheckoutForm;