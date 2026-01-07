import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './AdminPanel.css';

const AdminPanel = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tourData, setTourData] = useState({
        title: '', city: '', address: '', distance: '',
        photo: '', desc: '', price: '', originalPrice: '',
        maxGroupSize: '', featured: false
    });

    const [tempDate, setTempDate] = useState({ start: '', end: '' });
    const [addedDates, setAddedDates] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editTourId, setEditTourId] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [tours, setTours] = useState([]);

    useEffect(() => {
        if (!user || user.role !== 'admin') navigate('/');
        else fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const bookingsRes = await axios.get('http://localhost:4000/api/bookings', { withCredentials: true });
            setBookings(Array.isArray(bookingsRes.data) ? bookingsRes.data : (bookingsRes.data.data || []));

            const toursRes = await axios.get('http://localhost:4000/api/tours', { withCredentials: true });
            setTours(Array.isArray(toursRes.data) ? toursRes.data : (toursRes.data.data || []));
        } catch (err) {
            console.error("Помилка завантаження:", err);
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setTourData(prev => ({ ...prev, [e.target.id]: value }));
    };

    const addDate = () => {
        if (!tempDate.start || !tempDate.end) return alert("Оберіть обидві дати!");
        setAddedDates([...addedDates, tempDate]);
        setTempDate({ start: '', end: '' });
    };

    const removeDate = (index) => {
        setAddedDates(addedDates.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...tourData, startDates: addedDates };
            if (isEditing) {
                await axios.put(`http://localhost:4000/api/tours/${editTourId}`, payload, { withCredentials: true });
                alert('Тур оновлено! 📝');
                setIsEditing(false); setEditTourId(null);
            } else {
                await axios.post('http://localhost:4000/api/tours', payload, { withCredentials: true });
                alert('Тур створено! 🎉');
            }
            setTourData({
                title: '', city: '', address: '', distance: '', photo: '', desc: '',
                price: '', originalPrice: '', maxGroupSize: '', featured: false
            });
            setAddedDates([]);
            fetchData();
        } catch (err) {
            alert('Помилка збереження: ' + (err.response?.data?.message || err.message));
        }
    };

    const deleteTour = async (id) => {
        if (window.confirm("Видалити тур?")) {
            await axios.delete(`http://localhost:4000/api/tours/${id}`, { withCredentials: true });
            fetchData();
        }
    };

    const startEditTour = (tour) => {
        setIsEditing(true);
        setEditTourId(tour._id);
        setTourData({
            title: tour.title, city: tour.city, address: tour.address,
            distance: tour.distance, photo: tour.photo, desc: tour.desc,
            price: tour.price, originalPrice: tour.originalPrice || '',
            maxGroupSize: tour.maxGroupSize, featured: tour.featured
        });
        setAddedDates(tour.startDates || []);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const updateBookingStatus = async (id, status) => {
        await axios.put(`http://localhost:4000/api/bookings/${id}`, { status }, { withCredentials: true });
        fetchData();
    };

    const deleteBooking = async (id) => {
        if(window.confirm("Видалити бронювання?")) {
            await axios.delete(`http://localhost:4000/api/bookings/${id}`, { withCredentials: true });
            fetchData();
        }
    };

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="admin-container">
            <h1>⚙️ Панель Адміністратора</h1>

            <div className="admin-top-grid">
                <div className="admin-section">
                    <h2>
                        {isEditing ? '✏️ Редагування туру' : '➕ Створити новий тур'}
                        {isEditing && (
                            <button className="cancel-edit-btn" onClick={() => {
                                setIsEditing(false);
                                setTourData({ title: '', city: '', address: '', distance: '', photo: '', desc: '', price: '', originalPrice: '', maxGroupSize: '', featured: false });
                                setAddedDates([]);
                            }}>Скасувати</button>
                        )}
                    </h2>

                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="form-grid">
                            <input type="text" placeholder="Назва туру" id="title" onChange={handleChange} value={tourData.title} required />
                            <input type="text" placeholder="Місто" id="city" onChange={handleChange} value={tourData.city} required />
                        </div>

                        <input type="text" placeholder="Адреса" id="address" onChange={handleChange} value={tourData.address} required />
                        <input type="text" placeholder="URL фото" id="photo" onChange={handleChange} value={tourData.photo} required />

                        <div className="form-grid">
                            <input type="number" placeholder="Відстань (км)" id="distance" onChange={handleChange} value={tourData.distance} required />
                            <input type="number" placeholder="Макс. людей" id="maxGroupSize" onChange={handleChange} value={tourData.maxGroupSize} required />
                        </div>

                        <div className="price-group-wrapper">
                            <div className="form-grid">
                                <div>
                                    <span className="price-label">Продажна ціна ($)</span>
                                    <input type="number" placeholder="100" id="price" onChange={handleChange} value={tourData.price} required />
                                </div>
                                <div>
                                    <span className="price-label" style={{color:'#f87171'}}>Стара ціна (Знижка)</span>
                                    <input type="number" placeholder="150" id="originalPrice" onChange={handleChange} value={tourData.originalPrice} />
                                </div>
                            </div>
                        </div>

                        <textarea rows="4" placeholder="Опис туру..." id="desc" onChange={handleChange} value={tourData.desc} required />

                        <div className="date-manager">
                            <span className="price-label" style={{marginBottom:'10px'}}>📅 Дати турів (Заїзд — Виїзд)</span>
                            <div className="date-inputs">
                                <input type="date" value={tempDate.start} onChange={e => setTempDate({...tempDate, start: e.target.value})} />
                                <span style={{color:'white'}}>—</span>
                                <input type="date" value={tempDate.end} onChange={e => setTempDate({...tempDate, end: e.target.value})} />
                                <button type="button" onClick={addDate} className="add-date-btn">+</button>
                            </div>
                            <ul className="dates-list">
                                {addedDates.map((d, index) => (
                                    <li key={index}>
                                        {new Date(d.start).toLocaleDateString()} — {new Date(d.end).toLocaleDateString()}
                                        <span onClick={() => removeDate(index)} className="remove-date">✕</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="checkbox-container">
                            <label className="checkbox-label" style={{background: 'transparent', border:'none', padding:0}}>
                                <input type="checkbox" id="featured" onChange={handleChange} checked={tourData.featured} />
                                <span>Рекомендований тур (Featured)</span>
                            </label>
                        </div>

                        <button type="submit" className={`admin-btn ${isEditing ? 'update-btn' : 'create-btn'}`}>
                            {isEditing ? "Зберегти зміни" : "Створити Тур"}
                        </button>
                    </form>
                </div>

                <div className="admin-section">
                    <h2>🌍 Всі тури ({tours.length})</h2>
                    <div className="table-wrapper">
                        <table className="admin-table">
                            <thead>
                            <tr>
                                <th>Назва</th>
                                <th>Ціна</th>
                                <th>Дії</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tours.map(tour => (
                                <tr key={tour._id}>
                                    <td>
                                        <div style={{fontWeight:'bold', color:'white'}}>{tour.title}</div>
                                        <div style={{fontSize:'0.8rem'}}>{tour.city}</div>
                                    </td>
                                    <td>
                                        {tour.originalPrice && Number(tour.originalPrice) > Number(tour.price) ? (
                                            <div>
                                                <span style={{textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.8rem'}}>${tour.originalPrice}</span>
                                                <span style={{color: '#f87171', fontWeight: 'bold', marginLeft:'5px'}}>${tour.price}</span>
                                            </div>
                                        ) : (
                                            <span>${tour.price}</span>
                                        )}
                                    </td>
                                    <td>
                                        <button onClick={() => startEditTour(tour)} className="action-btn edit">✏️</button>
                                        <button onClick={() => deleteTour(tour._id)} className="action-btn delete">🗑️</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="admin-section">
                <h2>📦 Керування бронюваннями ({bookings.length})</h2>
                <div className="table-wrapper">
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>Тур</th>
                            <th>Клієнт</th>
                            <th>Дати</th>
                            <th>Людей</th>
                            <th>Статус</th>
                            <th>Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {bookings.length === 0 ? (
                            <tr><td colSpan="6" style={{textAlign:'center', padding:'20px'}}>Бронювань немає</td></tr>
                        ) : bookings.map(booking => (
                            <tr key={booking._id}>
                                <td><strong>{booking.tourName}</strong></td>
                                <td>
                                    {booking.fullName} <br/>
                                    <small>{booking.phone}</small>
                                </td>
                                <td>{new Date(booking.bookAt).toLocaleDateString()}</td>
                                <td>{booking.guestSize}</td>
                                <td>
                                        <span className={`status-badge ${booking.status}`}>
                                            {booking.status === 'pending' ? 'Очікує' :
                                                booking.status === 'approved' ? 'Підтверджено' : 'Скасовано'}
                                        </span>
                                </td>
                                <td>
                                    {booking.status === 'pending' && (
                                        <button onClick={() => updateBookingStatus(booking._id, 'approved')} className="action-btn approve" title="Підтвердити">✅</button>
                                    )}
                                    <button onClick={() => deleteBooking(booking._id)} className="action-btn delete" title="Видалити">🗑️</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default AdminPanel;