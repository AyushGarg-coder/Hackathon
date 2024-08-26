import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import Footer from './components/Footer';
import Card from './components/Card';
import Navbar from './components/Navbar';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Cardcall from './components/Cardcall';
import Carddetail from './components/Carddetail';
import AddBooks from './components/AddBooks';
import Login from './components/Login';
import { useState } from 'react';
import DataProvider from './components/DataProvider';
import Search from './components/Search';
import Addtocart from './components/Addtocart';
import Aboutus from './components/Aboutus';
import Profile from './components/Profile';


const PrivateRoute = ({ isAuthenticated, ...props }) => {
  // isAuthenticated = true;
  return isAuthenticated ? (
    <>
      <Navbar />
      <Outlet {...props} />
      <Footer />
    </>) : (<Navigate replace to="/login" />)
}

function App() {

  const [isAuthenticated, isUserAuthenticated] = useState(false);

  return (
    <>
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login isUserAuthenticated={isUserAuthenticated} />} />

          <Route path="/" element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
            <Route path='/' element={<Cardcall />} />
            <Route path="addmovies" element={<AddBooks />} />
            <Route path="carddetail/:id" element={<Carddetail />} />
            <Route path="about" element={<Aboutus/>} />
            <Route path="contact" element={''} />
            <Route path='search' element={<Search/>}/>
            <Route path='/addtocart' element={<Addtocart/>}/>
            <Route path='/profile' element={<Profile/>}/>
          </Route>

        </Routes>
      </BrowserRouter>
      </DataProvider>

    </>
  );
}

export default App;
