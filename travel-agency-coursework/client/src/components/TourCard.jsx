import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './TourCard.css';

const TourCard = ({ tour }) => {
    const [isFav, setIsFav] = useState(false);
    const { user, dispatch } = useContext(AuthContext);

    const isSoldOut = tour.maxGroupSize <= 0;

    const discount = tour.originalPrice && tour.originalPrice > tour.price
        ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
        : 0;

    useEffect(() => {
        if (user && user.favorites) {
            const isFavorite = user.favorites.some(fav => {
                const favId = typeof fav === 'object' ? fav._id : fav;
                return favId === tour._id;
            });
            setIsFav(isFavorite);
        } else {
            setIsFav(false);
        }
    }, [user, tour._id]);

    const handleLike = async (e) => {
        e.preventDefault();
        if (!user) return alert("Будь ласка, увійдіть!");

        setIsFav(!isFav);

        try {
            const res = await axios.put(
                `https://travel-agency-coursework.onrender.com/api/users/${user._id}/favorites`,
                { tourId: tour._id },
                { withCredentials: true } // 🔥 ВАЖЛИВО: передаємо куки
            );

            if (res.data.success) {
                dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
            }
        } catch (err) {
            setIsFav(!isFav);
            alert("Помилка: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="tour-card" style={isSoldOut ? {filter: 'grayscale(100%)', opacity: '0.8'} : {}}>
            <div className="card-top">
                <img src={tour.photo} alt={tour.title} className="tour-img" />

                {}
                {isSoldOut ? (
                    <span className="featured-badge" style={{background: '#333', color: '#fff'}}>
                        SOLD OUT ❌
                    </span>
                ) : (
                    <>
                        <span className="like-btn" onClick={handleLike} style={{cursor: 'pointer'}}>
                            {}
                            {isFav ? '❤️' : '🤍'}
                        </span>

                        {tour.featured && <span className="featured-badge">Топ 🔥</span>}

                        {discount > 0 && (
                            <span className="featured-badge" style={{left: '10px', right: 'auto', background: '#ef4444'}}>
                                SALE -{discount}%
                            </span>
                        )}
                    </>
                )}
            </div>

            <div className="tour-info">
                <div className="tour-header">
                    <h3>{tour.title}</h3>
                    <span className="rating">⭐ {tour.rating || 4.5}</span>
                </div>

                <div style={{display:'flex', justifyContent:'space-between', fontSize:'0.9rem', color:'#777', marginBottom:'10px'}}>
                    <span>📍 {tour.city}</span>
                    <span style={{color: isSoldOut ? 'red' : 'green', fontWeight:'bold'}}>
                        {isSoldOut ? "Місць немає" : `Залишилось: ${tour.maxGroupSize}`}
                    </span>
                </div>

                <div className="tour-bottom">
                    {discount > 0 && !isSoldOut ? (
                        <div className="price-box">
                            <span style={{textDecoration: 'line-through', color: '#999', fontSize: '0.8rem'}}>${tour.originalPrice}</span>
                            <div className="tour-price" style={{color: '#ef4444', fontWeight: 'bold'}}>
                                ${tour.price} <span className="per-person">/ос.</span>
                            </div>
                        </div>
                    ) : (
                        <div className="tour-price">
                            ${tour.price} <span className="per-person">/ос.</span>
                        </div>
                    )}

                    {isSoldOut ? (
                        <button className="btn-book" disabled style={{background: '#ccc', cursor: 'not-allowed'}}>
                            Розпродано
                        </button>
                    ) : (
                        <Link to={`/tours/${tour._id}`}>
                            <button className="btn-book">Детальніше</button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TourCard;