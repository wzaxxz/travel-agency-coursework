import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './TourDetails.css';

const TourDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [credentials, setCredentials] = useState({
        userId: user?._id || 'guest',
        userEmail: user?.email || '',
        fullName: user?.username || '',
        phone: '',
        guestSize: 1,
        bookAt: ''
    });

    const [guests, setGuests] = useState([{ fullName: '', ageGroup: 'adult' }]);

    const [reviewText, setReviewText] = useState('');
    const [reviewRating, setReviewRating] = useState(5);

    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        if (user) {
            setCredentials(prev => ({ ...prev, userId: user._id, userEmail: user.email, fullName: user.username }));
        }
    }, [user]);

    const fetchTour = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/tours/${id}`);
            const data = res.data.data ? res.data.data : res.data;
            setTour(data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTour();
    }, [id]);

    const handleChange = (e) => setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));

    const handleGuestSizeChange = (e) => {
        const size = parseInt(e.target.value);
        if (size < 1 || size > (tour?.maxGroupSize || 10)) return;

        setCredentials(prev => ({ ...prev, guestSize: size }));
        const newGuests = Array.from({ length: size }, (_, index) => guests[index] || { fullName: '', ageGroup: 'adult' });
        setGuests(newGuests);
    };

    const handleGuestInfoChange = (index, field, value) => {
        const updatedGuests = [...guests];
        updatedGuests[index][field] = value;
        setGuests(updatedGuests);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/api/bookings', {
                ...credentials,
                tourName: tour.title,
                tourId: tour._id,
                guests,
                phone: String(credentials.phone),
                price: tour.price * credentials.guestSize
            }, { withCredentials: true });

            alert("Бронювання підтверджено ✅");
            navigate('/profile');
        } catch (err) {
            alert("Помилка: " + (err.response?.data?.message || err.message));
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) return alert("Будь ласка, увійдіть!");

        try {
            await axios.post(`http://localhost:4000/api/tours/${id}/reviews`, {
                username: user.username,
                rating: reviewRating,
                comment: reviewText
            });
            alert("Дякуємо за відгук!");
            setReviewText('');
            setReviewRating(5);
            fetchTour();
        } catch (err) {
            alert("Помилка додавання відгуку");
        }
    };

    const submitAdminReply = async (reviewId) => {
        try {
            await axios.put(`http://localhost:4000/api/tours/${id}/reviews/${reviewId}/reply`, {
                replyText: replyText
            });
            alert("Відповідь додано!");
            setReplyingTo(null);
            setReplyText('');
            fetchTour();
        } catch (err) {
            alert("Помилка відповіді");
        }
    };

    const renderDateOption = (dateItem) => {
        if (!dateItem) return "";
        if (typeof dateItem === 'object' && dateItem.start) {
            return `${new Date(dateItem.start).toLocaleDateString()} — ${new Date(dateItem.end).toLocaleDateString()}`;
        }
        return new Date(dateItem).toLocaleDateString();
    };

    const getDateValue = (dateItem) => {
        if (typeof dateItem === 'object' && dateItem.start) return dateItem.start;
        return dateItem;
    };

    if (loading) return <h2 style={{textAlign:'center', marginTop:'50px', color:'white'}}>Завантаження...</h2>;
    if (error) return <h2 style={{color: 'red', textAlign:'center', marginTop:'50px'}}>Помилка: {error}</h2>;
    if (!tour) return <h2 style={{textAlign:'center', marginTop:'50px', color:'white'}}>Тур не знайдено</h2>;

    const isSoldOut = tour.maxGroupSize <= 0;

    const discount = tour.originalPrice && tour.originalPrice > tour.price
        ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
        : 0;

    const photoUrl = tour.photo ? tour.photo : "https://via.placeholder.com/800x500?text=No+Image";

    return (
        <div className="tour-details-container">
            <div className="details-wrapper">
                <div className="left-column">
                    <div style={{position: 'relative'}}>
                        <img
                            src={photoUrl}
                            alt={tour.title}
                            className="details-img"
                            style={isSoldOut ? {filter: 'grayscale(100%)'} : {}}
                        />

                        {isSoldOut ? (
                            <span style={{
                                position: 'absolute', top: '20px', left: '20px',
                                background: '#333', color: 'white', padding: '10px 20px',
                                borderRadius: '8px', fontWeight: 'bold', fontSize: '1.5rem',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.5)', border: '2px solid red'
                            }}>
                                SOLD OUT ❌
                            </span>
                        ) : (
                            discount > 0 && (
                                <span style={{
                                    position: 'absolute', top: '20px', left: '20px',
                                    background: '#ef4444', color: 'white', padding: '5px 12px',
                                    borderRadius: '20px', fontWeight: 'bold', fontSize: '1.1rem',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                                }}>
                                    SALE -{discount}%
                                </span>
                            )
                        )}
                    </div>

                    <div className="details-desc">
                        <h3>Опис подорожі</h3>
                        <p>{tour.desc || "Опис відсутній"}</p>
                    </div>

                    <div className="reviews-section">
                        <h3>💬 Відгуки ({tour.reviews?.length || 0})</h3>
                        <div className="reviews-list">
                            {tour.reviews?.map((review, index) => (
                                <div key={review._id || index} className="review-item">
                                    <div className="review-header">
                                        <strong>{review.username}</strong>
                                        <span className="review-stars">{'⭐'.repeat(review.rating)}</span>
                                        <span className="review-date">
                                            {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}
                                        </span>
                                    </div>
                                    <p className="review-text">"{review.comment}"</p>

                                    {review.reply && (
                                        <div className="admin-reply">
                                            <strong>👨‍💼 Менеджер:</strong> {review.reply}
                                        </div>
                                    )}

                                    {user?.role === 'admin' && !review.reply && (
                                        <div className="admin-actions">
                                            {replyingTo === review._id ? (
                                                <div className="reply-form">
                                                    <input
                                                        type="text"
                                                        placeholder="Ваша відповідь..."
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                    />
                                                    <button onClick={() => submitAdminReply(review._id)} className="save-btn">✓</button>
                                                    <button onClick={() => setReplyingTo(null)} className="cancel-btn">✕</button>
                                                </div>
                                            ) : (
                                                <button onClick={() => setReplyingTo(review._id)} className="reply-btn">↩️ Відповісти</button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {user ? (
                            <div className="add-review">
                                <h4>Залишити свій відгук</h4>
                                <form onSubmit={submitReview}>
                                    <div className="rating-select">
                                        <span>Оцінка: </span>
                                        <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))}>
                                            <option value="5">5 - Відмінно ⭐⭐⭐⭐⭐</option>
                                            <option value="4">4 - Добре ⭐⭐⭐⭐</option>
                                            <option value="3">3 - Нормально ⭐⭐⭐</option>
                                            <option value="2">2 - Погано ⭐⭐</option>
                                            <option value="1">1 - Жахливо ⭐</option>
                                        </select>
                                    </div>
                                    <textarea
                                        placeholder="Напишіть ваші враження..."
                                        required
                                        value={reviewText}
                                        onChange={e => setReviewText(e.target.value)}
                                    ></textarea>
                                    <button type="submit" className="submit-review-btn">Опублікувати</button>
                                </form>
                            </div>
                        ) : (
                            <p className="login-hint" style={{marginTop:'20px', color:'#94a3b8'}}>Увійдіть, щоб залишити відгук.</p>
                        )}
                    </div>
                </div>

                <div className="right-column">
                    <h1>{tour.title}</h1>
                    <div className="details-meta">
                        <span>📍 {tour.city}</span>
                        <span>⭐ {tour.rating || "New"}</span>
                        <span style={{color: isSoldOut ? 'red' : (tour.maxGroupSize < 5 ? '#f59e0b' : 'inherit'), fontWeight: 'bold'}}>
                            👥 {isSoldOut ? "Місць немає" : `Залишилось: ${tour.maxGroupSize}`}
                        </span>
                    </div>

                    <div className="price-tag-wrapper" style={{margin: '20px 0'}}>
                        {discount > 0 ? (
                            <div style={{display: 'flex', alignItems: 'flex-end', gap: '10px'}}>
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <span style={{textDecoration: 'line-through', color: '#94a3b8', fontSize: '1.2rem'}}>
                                        ${tour.originalPrice}
                                    </span>
                                    <span style={{background: '#ef4444', color: 'white', fontSize: '0.9rem', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', width: 'fit-content'}}>
                                        SALE -{discount}%
                                    </span>
                                </div>
                                <span className="price-tag" style={{color: '#ef4444', fontSize: '2.5rem', fontWeight: '800'}}>
                                    ${tour.price}
                                </span>
                            </div>
                        ) : (
                            <p className="price-tag">${tour.price}</p>
                        )}
                    </div>

                    {isSoldOut ? (
                        <div className="booking-form" style={{textAlign: 'center', padding: '40px', background: '#222', border: '1px solid #444'}}>
                            <h2 style={{color: '#ef4444', marginBottom: '10px'}}>❌ ТУР РОЗПРОДАНО</h2>
                            <p style={{color: '#ccc'}}>На жаль, вільних місць на цей тур більше немає.</p>
                            <Link to="/" style={{display: 'inline-block', marginTop: '20px', color: '#0ea5e9', textDecoration: 'none'}}>
                                ← Знайти інші тури
                            </Link>
                        </div>
                    ) : (
                        user ? (
                            <div className="booking-form">
                                <h3 style={{marginBottom:'15px', color:'white'}}>Бронювання для {user.username}</h3>
                                <form onSubmit={handleSubmit} className="actual-form">
                                    <div className="form-group-row">
                                        <div className="input-wrapper">
                                            <label>Ваше ім'я</label>
                                            <input type="text" id="fullName" value={credentials.fullName} required onChange={handleChange} />
                                        </div>
                                        <div className="input-wrapper">
                                            <label>Телефон</label>
                                            <input type="text" id="phone" value={credentials.phone} required onChange={handleChange} placeholder="+380..." />
                                        </div>
                                    </div>
                                    <div className="form-group-row">
                                        <div className="input-wrapper" style={{flex: 2}}>
                                            <label>Оберіть дату туру</label>
                                            <select id="bookAt" required onChange={handleChange} className="date-select">
                                                <option value="">-- Виберіть дату --</option>
                                                {tour.startDates && tour.startDates.map((date, index) => (
                                                    <option key={index} value={getDateValue(date)}>
                                                        {renderDateOption(date)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="input-wrapper small-wrapper" style={{flex: 1}}>
                                            <label>Людей</label>
                                            <input
                                                type="number"
                                                id="guestSize"
                                                min="1"
                                                max={tour.maxGroupSize}
                                                value={credentials.guestSize}
                                                required
                                                onChange={handleGuestSizeChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="guests-section">
                                        <h4>Туристи:</h4>
                                        {guests.map((guest, index) => (
                                            <div key={index} className="guest-row">
                                                <span className="guest-number">#{index+1}</span>
                                                <input type="text" value={guest.fullName} onChange={(e) => handleGuestInfoChange(index, 'fullName', e.target.value)} required placeholder="ПІБ"/>
                                                <select value={guest.ageGroup} onChange={(e) => handleGuestInfoChange(index, 'ageGroup', e.target.value)}>
                                                    <option value="adult">14+</option>
                                                    <option value="child">До 13</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{display:'flex', justifyContent:'space-between', color:'white', fontWeight:'bold', marginTop:'15px', fontSize:'1.1rem'}}>
                                        <span>Всього до сплати:</span>
                                        <span style={{color:'#ef4444'}}>${tour.price * credentials.guestSize}</span>
                                    </div>

                                    <button type="submit" className="book-btn-large">Підтвердити</button>
                                </form>
                            </div>
                        ) : (
                            <div className="auth-warning">
                                <h3>🔒 Бронювання</h3>
                                <p>Увійдіть для бронювання.</p>
                                <div className="auth-buttons"><Link to="/login" className="login-link">Вхід</Link></div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default TourDetails;