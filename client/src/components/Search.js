import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import './Card.css';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const initialvalue = {
    title: '',
    id: '',
    time: '',
    director: '',
    price: '',
    url1: '',
}

const Search = () => {
    const [data, setData] = useState(initialvalue);
    const location = useLocation();
    const { search } = location.state || {};
    const navigate=useNavigate();

    useEffect(() => {
        async function fetchdata() {
            try {
                console.log(search);
                const response = await axios.post(`http://localhost:3001/search`, { search });
                if (response.status === 200) {
                    // console.log(response.data);
                    setData({ ...data, title: response.data.title, id: response.data._id, time: response.data.time, director: response.data.director, price: response.data.price, url1: response.data.url1 });
                }
                else {
                    toast.error(response.data,{pauseOnHover:false});
                    setTimeout(()=>{
                        window.location.reload('/')
                    },(1000))
                }
            }
            catch (err) {
                if (err.response.data) {
                    toast.error(err.response.data, { position: 'top-center' });
                    setTimeout(()=>{
                        window.location.reload('/')
                    },(1000))
                }
                else {
                    toast.error(err.message, { position: 'top-center' });
                    setTimeout(()=>{
                        window.location.reload('/')
                    },(1000))
                }
            }
        }
        fetchdata();
    }, [search])


    function textLimiter(str, limit) {
        return str.length > limit ? str.substring(0, limit) + '...' : str;
    }

    return (

        <div className='min-vh-100'>
            <Link to={`/carddetail/${data.id}`} className="card ms-2 m-3 Card text-decoration-none" style={{ width: '30rem', marginTop: '-19px !important' }}>
                <div className="row g-0">
                    <div className="col-md-5 Img-container">
                        <img src={data.url1} alt={data.title} className="img-fluid" style={{ objectFit: 'cover', height: '100%', marginLeft: 'auto', marginRight: 'auto', width: '12rem' }} />
                    </div>
                    <div className="col-md-7">
                        <div className="card-body d-flex flex-column justify-content-between h-100">
                            <h5 className="card-title alert alert-dark text-center fw-bold">{textLimiter(data.title, 40)}</h5>
                            <p className="card-text text-success">{textLimiter(data.director, 40)}</p>
                            <p className="card-text text-dark-emphasis">{textLimiter(data.time, 40)}</p>
                            <p className="card-text text-primary">MRP: Rs. {data.price}</p>
                            <ToastContainer></ToastContainer>
                            <button onClick={() => console.log('Buy Now clicked')} className="btn btn-warning mt-2">Buy Now</button>
                        </div>
                    </div>
                </div>
            </Link>
        </div>

    );
}

export default Search;
