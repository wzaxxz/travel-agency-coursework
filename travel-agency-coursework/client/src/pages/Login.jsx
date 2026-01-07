import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Auth.css";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const { dispatch } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGIN_START" });

        try {
            const res = await axios.post("http://localhost:4000/api/auth/login", credentials, {
                withCredentials: true
            });
            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
            navigate("/");
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Помилка з'єднання";
            alert(errorMessage);
            dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;

        try {
            const res = await axios.post("http://localhost:4000/api/auth/google", {
                token: token
            }, { withCredentials: true });

            dispatch({ type: "LOGIN_SUCCESS", payload: res.data.data });
            navigate("/");
        } catch (err) {
            alert("Помилка Google входу: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <section className="auth-page">
            <div className="auth-card">
                <h2>Вхід</h2>
                {}
                <form onSubmit={handleClick}>
                    <div className="form-group">
                        <input type="email" placeholder="Email" id="email" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <input type="password" placeholder="Пароль" id="password" required onChange={handleChange} />
                    </div>
                    <button className="auth-btn" type="submit">Увійти</button>
                </form>

                <div className="divider">або</div>

                {}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => {
                            console.log('Login Failed');
                            alert("Google вхід не вдався");
                        }}
                        theme="filled_black"
                        shape="pill"
                        text="signin_with"
                    />
                </div>

                <p>
                    Немає акаунту? <Link to="/register">Зареєструватись</Link>
                </p>
            </div>
        </section>
    );
};

export default Login;