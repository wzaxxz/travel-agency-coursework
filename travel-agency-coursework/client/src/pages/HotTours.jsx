import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TourCard from '../components/TourCard';
import '../pages/HotTours.css';

const HotTours = () => {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await axios.get('https://travel-agency-coursework.onrender.com/api/tours');
                const featuredTours = res.data.data ? res.data.data.filter(tour => tour.featured) : res.data.filter(tour => tour.featured);
                setTours(featuredTours);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    return (
        <div className="hot-tours-container">
            <div className="hot-header">
                <h1>🔥 Гарячі путівки</h1>
                <p>Найкращі пропозиції, відібрані нашими експертами спеціально для вас.</p>
            </div>

            {loading ? (
                <h4>Завантаження...</h4>
            ) : (
                <div className="tours-grid">
                    {tours.length > 0 ? (
                        tours.map(tour => <TourCard tour={tour} key={tour._id} />)
                    ) : (
                        <h3>На жаль, зараз немає гарячих пропозицій. Завітайте пізніше!</h3>
                    )}
                </div>
            )}
        </div>
    );
};

export default HotTours;