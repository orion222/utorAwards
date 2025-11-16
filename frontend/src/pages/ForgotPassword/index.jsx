import { Link } from 'react-router-dom';
import './style.css';

import { useState } from 'react';

function ForgotPassword() {
    const [email, setEmail] = useState("");

    const handleForgotPassword = (e) => {

    }

    return (
        <div className="center full-screen">
            <div id="login-card">
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
            </div>
        </div>
    );  
}

export default ForgotPassword;