import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import CheckoutForm from './Checkoutform';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Billtocart({ totalquantity, totalamount, length }) {
    const [stripePromise, setStripePromise] = useState(null);
    const [title, setTitle] = useState({});
    const [author, setAuthor] = useState({});
    const [price, setPrice] = useState('');
    const [Movies, setMovies] = useState([]);

    useEffect(() => {
        try {
            if (price != '' && Movies != "") {
            }
            else {
                throw ('cannot fetch data')
            }
        }
        catch (err) {
            toast.error(err.message);
        }
    })

    const handlePayment = async () => {
        try {
            const stripe = await loadStripe(process.env.REACT_APP_PUBLIC_KEY);
            const user = sessionStorage.getItem('username');
//--------------------------------------------add books name function----------------------------------------------------------------------
            // const response = await axios.post('http://localhost:3001/bill', { user });
            // if (response.status === 200) {
            // console.log(response.data);
            // setBooks(response.data)
            // const titles=books.map(item=>item.title);
            // const authors=books.map(item=>item.author);
            // response.data.forEach(item => {
            //     titles[item.bookid]=item.title
            //     authors[item.bookid]=item.author
            // });
            // setAuthor(authors);
            // setTitle(titles);/
            // console.log(title)
            // console.log(titles)
            // }
//-------------------------------------------------------------------------------------------------------------------------------------------
            setStripePromise(stripe);
        } catch (error) {
            console.error('Error loading Stripe:', error);
        }
    };

    return (
        <div className="card mb-3 mt-2">
            <div className="card-body">
                <p className="text-primary fs-5 fw-bold">Price Details</p>
                <div className="d-flex flex-row">
                    <p className="me-auto">Price ({totalquantity} Movies)</p>
                    <p className="ms-auto">Rs. {totalamount}</p>
                </div>
                <div className="d-flex flex-row">
                    <p className="me-auto">Estimated Shipping</p>
                    <p className="ms-auto">Rs. {10 * length}</p>
                </div>
                <div className="d-flex flex-row">
                    <p className="me-auto">Total</p>
                    <p className="ms-auto">Rs. {totalamount + (10 * length)}</p>
                </div>

                {stripePromise ? (
                    <Elements className="container-fluid" stripe={stripePromise} key={1} >
                        <CheckoutForm price={totalamount + (10 * length)} />

                    </Elements>
                ) :
                    (
                        <button type="button" className="btn btn-outline-danger p-3 mt-2" onClick={handlePayment}>
                            Proceed to checkout
                        </button>
                    )
                }
            </div>
        </div>
    );
}
