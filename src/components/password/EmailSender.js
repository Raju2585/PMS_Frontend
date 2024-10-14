import React, { useState } from 'react';
import axios from 'axios'; 
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';
import '../password/EmailSender.css'; 

const EmailSender = () => { 
    const [email, setEmail] = useState(''); 
    const [error, setError] = useState(''); 

    const handleChange = (e) => { 
        setEmail(e.target.value);
    }; 

    const handleSubmit = async (e) => { 
        e.preventDefault();
    
        try { 
            const response = await axios.post('http://localhost:44376/api/ForgetPassword/forget',
                email, // Wrap email in an object
                { headers: { 'Content-Type': 'application/json' } }
            ); 
    
            if (response.status === 200) { 
                toast.success("Password reset email sent!"); 
                setEmail(''); // Clear the input field after submission
            } 
        } catch (err) { 
            if (err.response) {
                setError(err.response.data.errors.email ? err.response.data.errors.email[0] : 'An error occurred. Please try again.');
            } else {
                setError('An error occurred. Please check your network connection.');
            }
            toast.error(error || "Error occurred"); 
        } 
    }; 
    

    return (       
        <div className="recovery-container"> 
            <form onSubmit={handleSubmit} className="recovery-form"> 
                <h2>Password Recovery</h2> 
                {error && <p className="error">{error}</p>} 
                <div className="form-group"> 
                    <label htmlFor="email ">Email: </label> &nbsp; &nbsp; &nbsp;
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={handleChange} 
                        required 
                    /> 
                </div> 
                <button type="submit" className="btn btn-primary">Send Reset Link</button> 
            </form> 
            <ToastContainer /> 
        </div>
    ); 
};

export default EmailSender;
