import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-modern">
            <div className="footer-content">

                {}
                <div className="footer-brand">
                    <Link to="/" className="brand-logo">
                        ✈️ HORIZON
                    </Link>
                    <p className="brand-desc">
                        Ми створюємо не просто тури, а незабутні емоції.
                        Твоя ідеальна подорож починається тут і зараз.
                    </p>

                    <div className="newsletter">
                        <span>Отримуй гарячі пропозиції:</span>
                        <div className="input-group">
                            <input type="email" placeholder="Ваш email..." />
                            <button><i className="ri-send-plane-fill"></i></button>
                        </div>
                    </div>
                </div>

                {}
                <div className="footer-links-group">
                    <h3>Компанія</h3>
                    <ul>
                        <li><Link to="/">Головна</Link></li>
                        <li><Link to="/about">Про нас</Link></li>
                        <li><Link to="/privacy">Політика конфіденційності</Link></li>
                    </ul>
                </div>

                {}
                <div className="footer-links-group">
                    <h3>Туристам</h3>
                    <ul>
                        <li><Link to="/hot-tours">Гарячі путівки 🔥</Link></li>
                        <li><Link to="/insurance">Страхування</Link></li>
                        <li><Link to="/faq">Питання та відповіді</Link></li>
                    </ul>
                </div>

                {}
                <div className="footer-contact-card">
                    <h3>Зв'яжіться з нами</h3>
                    <p>
                        <i className="ri-map-pin-line"></i>
                        Львів, вул. О. Фредра, 27
                    </p>
                    <p>
                        <i className="ri-phone-line"></i>
                        +38 (067) 678 78 78
                    </p>
                    <p>
                        <i className="ri-mail-line"></i>
                        hello@horizon-travel.ua
                    </p>

                    {}
                    <div className="social-icons">
                        {}
                        <a
                            href="https://www.instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <i className="ri-instagram-line"></i>
                        </a>

                        {}
                        <a
                            href="https://www.facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <i className="ri-facebook-circle-fill"></i>
                        </a>

                        {}
                        <a
                            href="https://web.telegram.org"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Telegram"
                        >
                            <i className="ri-telegram-fill"></i>
                        </a>

                        {}
                        <a
                            href="https://www.youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                        >
                            <i className="ri-youtube-fill"></i>
                        </a>
                    </div>
                </div>
            </div>

            {}
            <div className="footer-bottom-bar">
                <p>&copy; {new Date().getFullYear()} Horizon Travel. Всі права захищено.</p>
            </div>
        </footer>
    );
};

export default Footer;