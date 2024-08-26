
import { useEffect, useState } from 'react';
import './Addbooks.css'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const initialValue = {
    title: '',
    description: '',
    time: '',
    cast: '',
    url1: '',
    url2: '',
    price: '',
    genre: '',
    language: '',
    director: '',
};

const AddMovies = () => {
    const [movie, setMovie] = useState(initialValue);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    };

    const handleClick = async () => {
        try {
            if (movie.title.trim() !== '') {
                const response = await axios.post('https://hackathon-r38q.onrender.com/addmovies', movie);
                if (response.status === 200) {
                    toast.success('Movie added successfully!', { position: 'top-right' });
                    setMovie(initialValue);
                    navigate('/');
                }
            } else {
                toast.error('Title cannot be empty!');
            }
        } catch (err) {
            toast.error(`Error: ${err.response?.data || err.message}`);
        }
    };

    return (
        <div className='min-vh-100'>
            <ToastContainer />
            <div className="container text-center border border-2 mt-2 mb-1">
                <div className='mt-3'>
                    <h1 className="alert alert-primary mt-1">Add Movie</h1>
                </div>
                <div>
                    <input onChange={handleChange} name='title' value={movie.title} className="form-control mt-2 p-2" placeholder="Enter Movie Title" required />
                    <input onChange={handleChange} name='price' value={movie.price} className="form-control mt-2 p-2" placeholder="Enter Price" required />
                    <input onChange={handleChange} name='time' value={movie.time} className="form-control mt-2 p-2" placeholder="Enter Duration" required />
                    <input onChange={handleChange} name='description' value={movie.description} className="form-control mt-2 p-2" placeholder="Enter Movie Description" required />
                    <input onChange={handleChange} name='cast' value={movie.cast} className="form-control mt-2 p-2" placeholder="Enter Cast" required />
                    <input onChange={handleChange} name='genre' value={movie.genre} className="form-control mt-2 p-2" placeholder="Enter Genre" required />
                    <input onChange={handleChange} name='url1' value={movie.url1} className="form-control mt-2 p-2" placeholder="Enter Front Image URL" required />
                    <input onChange={handleChange} name='url2' value={movie.url2} className="form-control mt-2 p-2" placeholder="Enter Background Image URL" required />
                    <input onChange={handleChange} name='language' value={movie.language} className="form-control mt-2 p-2" placeholder="Enter Language" required />
                    <input onChange={handleChange} name='director' value={movie.director} className='form-control mt-2 p-2' placeholder='Enter Director Name' />
                </div>
                <div>
                    <button className="btn btn-outline-danger mt-4 mb-4 p-2 w-25 fs-5 fw-bold" onClick={handleClick}>ADD</button>
                </div>
            </div>
        </div>
    );
}

export default AddMovies;
