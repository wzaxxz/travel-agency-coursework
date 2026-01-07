import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AuthContextProvider>
            <GoogleOAuthProvider clientId="1028454450756-9fb4ekhohgt984o88p749fp56r2vqtda.apps.googleusercontent.com">
                <App />
            </GoogleOAuthProvider>
        </AuthContextProvider>
    </React.StrictMode>
);