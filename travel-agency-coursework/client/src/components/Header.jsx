import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
    const { user, dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'LOGOUT' });
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-container">
                {}
                <Link to="/" className="logo">
                    ✈️ HORIZON
                </Link>

                {}
                <div className="nav-actions">
                    {user ? (
                        <>
                            {}
                            {user.role === 'admin' && (
                                <Link to="/admin" className="admin-btn">
                                    <i className="ri-settings-3-fill"></i> Адмін-панель
                                </Link>
                            )}

                            {}
                            <Link to="/profile" className="user-profile">
                                <span className="user-avatar">
                                    {user.username.charAt(0).toUpperCase()}
                                </span>
                                <span className="user-name">{user.username}</span>
                            </Link>

                            {}
                            <button onClick={logout} className="logout-btn">
                                <i className="ri-logout-box-r-line"></i>
                            </button>
                        </>
                    ) : (
                        <div className="guest-actions">
                            <Link to="/login" className="login-btn">Вхід</Link>
                            <Link to="/register" className="register-btn">Реєстрація</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;