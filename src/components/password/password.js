import React, { useState, useEffect } from 'react';
import axios from 'axios';  // Import axios
import { toast } from 'react-toastify'; // Import toast
import '../password/password.css';

const PasswordReset = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(''); // Define setError

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setEmail(urlParams.get('email'));
        setToken(urlParams.get('token'));
    }, []);

    const handleSubmit = async (e) => { 
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try { 
            const response = await axios.post('http://localhost:5157/api/ForgetPassword/reset', 
                { Email: email, Token: token, NewPassword: password },  // Send email, token, and password
                { headers: { 'Content-Type': 'application/json' } }
            ); 
            if (response.status === 200) { 
                toast.success("Password reset successful!"); 
                setMessage('Your password has been reset successfully.'); 
                // Optionally redirect or reset the form
            } 
        } catch (err) { 
            if (err.response) {
                setError(err.response.data.message || 'An error occurred. Please try again.');
            } else {
                setError('An error occurred. Please check your network connection.');
            }
            toast.error("Error occurred"); 
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    return (
        <div className="password-reset-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit} className="password-reset-form">
                <div className="form-group">
                    <label htmlFor="password">New Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Enter new password"
                        className="form-input"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Confirm new password"
                        className="form-input"
                    />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
            {message && (
                <p className={message.includes("successful") ? 'success' : 'error'}>
                    {message}
                </p>
            )}
            {error && (
                <p className="error">{error}</p> // Display error messages
            )}
        </div>
    );
};

export default PasswordReset;