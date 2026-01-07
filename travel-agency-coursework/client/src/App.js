import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import TourDetails from './pages/TourDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import HotTours from './pages/HotTours';
import About from './pages/About';
import Insurance from './pages/Insurance';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';

function App() {
    return (
        <BrowserRouter>
            <Header />
            <div style={{minHeight: '80vh'}}>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/tours/:id" element={<TourDetails/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/admin" element={<AdminPanel/>}/>
                    <Route path="/hot-tours" element={<HotTours/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/insurance" element={<Insurance/>}/>
                    <Route path="/faq" element={<FAQ/>}/>
                    <Route path="/privacy" element={<Privacy/>}/>
                </Routes>
            </div>
            <Footer/>
        </BrowserRouter>
    );
}

export default App;