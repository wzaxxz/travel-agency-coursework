import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css'; // Підключаємо той самий файл стилів

const Register = () => {
    const [credentials, setCredentials] = useState({
        username: '',
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/auth/register", credentials);
            alert("Реєстрація успішна! Тепер ви можете увійти.");
            navigate("/login");
        } catch (err) {
            alert("Помилка реєстрації: " + (err.response?.data?.message || err.message));
        }
    };

    const googleLogin = () => {
        alert("Google login coming soon!");
    }

    return (
        <section className="auth-page">
            <div className="auth-card">
                <h2>Реєстрація</h2>

                <form onSubmit={handleClick}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Ім'я користувача"
                            id="username"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            id="email"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Пароль"
                            id="password"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn">Зареєструватися</button>
                </form>
                <p>Вже є акаунт? <Link to="/login">Увійти</Link></p>
            </div>
        </section>
    );
};

export default Register;