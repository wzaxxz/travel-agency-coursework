import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/Home.css';
import TourCard from '../components/TourCard';

const Home = () => {
    const [tours, setTours] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [city, setCity] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await axios.get('https://travel-agency-coursework.onrender.com/api/tours');
                const data = res.data.data ? res.data.data : res.data;
                setTours(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    const searchHandler = async () => {
        if (city.trim() === '') {
            setIsSearching(false);
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`https://travel-agency-coursework.onrender.com/api/tours/search/getTourBySearch?city=${city}`);
            const data = res.data.data ? res.data.data : res.data;

            setSearchResults(data);
            setIsSearching(true);
            setLoading(false);
        } catch (err) {
            alert("Помилка пошуку: " + err.message);
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            searchHandler();
        }
    };

    const resetSearch = () => {
        setCity('');
        setIsSearching(false);
        setSearchResults([]);
    };

    return (
        <div className="home-container" style={{maxWidth: '1200px', margin: '0 auto', padding: '0 20px'}}>

            {}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="section-subtitle">Відкривай світ разом з нами ✈️</div>
                    <h1>Знайди свою <span className="highlight">ідеальну подорож</span> 🌍</h1>
                    <p>Пошук найкращих турів для незабутніх емоцій. Бронюй онлайн швидко та безпечно.</p>

                    {}
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Куди хочете поїхати? (напр. Лондон)"
                            value={city}
                            onChange={e => {
                                setCity(e.target.value);
                                if(e.target.value === '') setIsSearching(false);
                            }}
                            onKeyDown={handleKeyDown}
                        />
                        <button className="search-btn" onClick={searchHandler}>Знайти</button>
                    </div>
                </div>
            </section>

            {}
            <section>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px'}}>
                    <div className="section-title">
                        {isSearching ? `🔍 Результати пошуку для: "${city}"` : "🔥 Всі доступні тури"}
                    </div>

                    {}
                    {isSearching && (
                        <button
                            onClick={resetSearch}
                            style={{
                                background: 'transparent',
                                color: '#f59e0b',
                                border: '1px solid #f59e0b',
                                padding: '8px 16px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            ✕ Скинути пошук
                        </button>
                    )}
                </div>

                {loading && <h4 style={{color: 'white', textAlign: 'center'}}>Завантаження...</h4>}
                {error && <h4 style={{color: 'red', textAlign: 'center'}}>Помилка: {error}</h4>}

                {}
                {!loading && !error && (
                    <div className="featured-tour-list">
                        {}
                        {isSearching ? (
                            searchResults.length === 0 ? (
                                <h4 style={{color: '#94a3b8', width: '100%'}}>На жаль, турів у цьому місті не знайдено 😔</h4>
                            ) : (
                                searchResults.map(tour => <TourCard tour={tour} key={tour._id} />)
                            )
                        ) : (
                            tours.map(tour => <TourCard tour={tour} key={tour._id} />)
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;