import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './style.css';
import api from '../../api/api';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const resetToken = searchParams.get("token");
    const email = searchParams.get("email");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return;
        }

        try {
            await api.post(`/auth/resets/${resetToken}`, {
                email,
                password
            });
        } catch (error) {
            console.warn(error.response?.data || error.message);
        }

        setPassword("");
        setConfirmPassword("");
    }

    return (
        <div className="center full-screen">
            <div id="login-card">
                <h1>Reset your password</h1>
                <form onSubmit={handleResetPassword}>
                    <div className="form-item">
                        <label htmlFor="password">New password</label>
                        <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-item">
                        <label htmlFor="confirmPassword">Confirm password</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="primary-btn">Reset</button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;