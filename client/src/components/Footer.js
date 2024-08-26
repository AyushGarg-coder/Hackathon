import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import './Card.css';
const Footer = () => {
    return (
        <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
            <div className="container-fluid">
                <Link className="navbar-brand me-auto d-lg-flex d-md-flex" to="/"><p>Copyright</p><span>&#169;</span><p>2024</p></Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <div className='ms-auto me-auto'>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="link nav-link active" aria-current="page" to="/">Terms of use</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="link nav-link" to="/">Privacy Policy</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="link nav-link" to="/">Sitemap</Link>
                            </li>
                        </ul>
                        <ToastContainer></ToastContainer>
                    </div>
                </div>
            </div>
        </nav>
    )
}


export default Footer;