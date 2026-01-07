import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TourCard from '../components/TourCard';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
    const [bookings, setBookings] = useState([]);
    const [favorites, setFavorites] = useState([]);

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchUserBookings(user._id);
            fetchUserData(user._id);
        }
    }, [user, navigate]);

    const fetchUserBookings = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:4000/api/bookings/user/${userId}`, {
                withCredentials: true
            });

            const data = res.data.data ? res.data.data : res.data;
            setBookings(data);
        } catch (err) {
            console.error("Помилка завантаження бронювань:", err);
        }
    };

    const fetchUserData = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:4000/api/users/${userId}`, {
                withCredentials: true
            });

            const userData = res.data.data;
            setFavorites(userData.favorites || []);

        } catch (err) {
            console.error("Помилка завантаження профілю:", err);
        }
    };

    if (!user) return <h2 style={{textAlign: 'center', marginTop: '50px', color: 'white'}}>Завантаження профілю...</h2>;

    return (
        <div className="profile-container">
            {}
            <div className="profile-header">
                <div className="header-content">
                    <h1>Привіт, {user.username}! 👋</h1>
                    <p>Email: {user.email}</p>
                    {user.role === 'admin' && <span className="admin-badge">👑 Адміністратор</span>}
                </div>
            </div>

            {}
            <div className="profile-section">
                <h2>📅 Мої бронювання</h2>

                {bookings.length === 0 ? (
                    <p className="empty-msg">У вас поки немає активних бронювань.</p>
                ) : (
                    <div className="bookings-list">
                        {bookings.map((item) => (
                            <div key={item._id} className="booking-card">
                                <div className="booking-info">
                                    <h3>✈️ {item.tourName}</h3>

                                    <p><strong>Дата туру:</strong> {new Date(item.bookAt).toLocaleDateString()}</p>
                                    <p><strong>Гостей:</strong> {item.guestSize}</p>

                                    <p>
                                        <strong>Вартість: </strong>
                                        {item.price ? `$${item.price}` : <span style={{color:'grey', fontSize:'0.9rem'}}>(ціна не вказана)</span>}
                                    </p>
                                </div>

                                <div className="booking-status-box">
                                    <span className={`status-badge ${item.status}`}>
                                        {item.status === 'pending' ? '⏳ Очікує підтвердження' :
                                            (item.status === 'confirmed' || item.status === 'approved') ? '✅ Підтверджено' :
                                                '❌ Скасовано'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <hr className="profile-divider" />

            {}
            <div className="profile-section">
                <h2>❤️ Улюблені тури</h2>

                {favorites.length === 0 ? (
                    <p className="empty-msg">Ви ще не додали жодного туру в улюблені.</p>
                ) : (
                    <div className="favorites-grid">
                        {favorites.map((tour) => (
                            <TourCard key={tour._id} tour={tour} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;