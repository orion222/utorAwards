import { Link } from 'react-router-dom';
import './style.css';

import { useState } from 'react';
import api from '../../api/api';

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [sentRequest, setSentRequest] = useState(false);

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        await api.post("/auth/resets", {
            email
        });

        setEmail("");
        setSentRequest(true);
    }

    return (
        <div className="center full-screen">
            <div id="login-card">
                {!sentRequest ? (
                    <>
                        <h1>Forgot password?</h1>
                        <span>Enter the email used for your account and we'll send you a link to reset your password.</span>
                        <form onSubmit={handleForgotPassword}>
                            <div className="form-item">
                                <label htmlFor="email">Email</label>
                                <input id="email" name="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <button type="submit" className="primary-btn">Reset Password</button>
                        </form>
                        <Link to="/login">Back to login</Link>
                    </>
                ) : (
                    <h3>Check your inbox! If an account exists for this email, we’ve sent a password reset link.</h3>
                )}
            </div>
        </div>
    );  
}

export default ForgotPassword;