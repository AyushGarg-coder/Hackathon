import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

const Navbar = () => {
    const {name,setName}=useState("");
    const [search, setSearch] = useState("");
    const navigate = useNavigate();


    const handleChange = (e) => {
        setSearch(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate('/search', { state: { search } })
        setSearch('')
    }

    const handleCart = () => {
        navigate('/addtocart')
    }


    const handleLogout = () => {
        sessionStorage.removeItem('auth_token');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('email');
        console.log(sessionStorage)
        navigate("/login");
    }
    return (
        <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand me-auto" to="/">Navbar</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className='ms-auto me-auto'>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="link nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="link nav-link" to="/about">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="link nav-link" to="/">Contact</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="link nav-link" to="/addmovies">Add Movie</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="link nav-link" to="/login" onClick={handleLogout}>Logout</Link>
                            </li>
                        </ul>
                        <ToastContainer></ToastContainer>
                    </div>
                    <form className="d-flex flex-column flex-lg-row" role="search" onSubmit={handleSubmit}>
                        <input className="form-control me-2 w-100" type="search" placeholder="Movie Title ..." onChange={handleChange} style={{ width: '15rem' }} />
                        <button className="btn btn-primary mt-2 mt-lg-0" type="submit">Search...</button>
                    </form>
                    {/* dropdown menu */}
                    <div class="btn-group ms-lg-3 mt-2 mt-lg-0 me-2">
                        {/* <button type="button" class="btn btn-danger">Action</button> */}
                        <button type="button" class="btn btn-outline-light dropdown-toggle dropdown-toggle-split rounded" data-bs-toggle="dropdown" aria-expanded="false">
                            <span class=""><i className='fas fa-user'></i>&nbsp;&nbsp;&nbsp;{name ? name : "Profile"}&nbsp;&nbsp;</span>
                        </button>
                        <ul class="dropdown-menu z-2">
                            <li><Link class="dropdown-item" to="/profile">My Profile</Link></li>
                            <li><hr class="dropdown-divider"/></li>
                            <li><a class="dropdown-item" href="#">Orders</a></li>
                            <li><hr class="dropdown-divider"/></li>
                            <li><Link className="dropdown-item" to="/login" onClick={handleLogout}>Logout</Link></li>
                            {/* <li><hr class="dropdown-divider"/></li> */}
                            {/* <li><a class="dropdown-item" href="#">Separated link</a></li> */}
                        </ul>
                    </div>
                    <button className='btn btn-outline-light ms-lg-3 mt-2 mt-lg-0 me-lg-2' style={{ width: '3rem' }} onClick={handleCart}><i className='fas fa-shopping-cart'></i></button>
                </div>
            </div>
        </nav>
    )
}
export default Navbar;