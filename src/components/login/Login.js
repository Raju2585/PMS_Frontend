import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../apiHandler/api';
import "./Login.css";
const Login = ({ onClose }) => {
    const [loginData, setLoginData] = useState({
        Email: '',
        Password: '',
    });
 
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState(null);
    const [isUserValid, setIsUserValid] = useState(true);
    const navigate = useNavigate();
 
    const validate = () => {
        const newErrors = {};
        if (!loginData.Email) newErrors.Email = 'Email is required';
        if (!loginData.Password || loginData.Password.length < 6) newErrors.Password = 'Password must be at least 6 characters';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      setApiError(null);
      try {
        const response = await api.post('/Auth/login', loginData);
        console.log('receptionist logged in successfully:', response.data);
        if (response.data && response.data.isSuccess) {
          setIsUserValid(true);
          if(response.data.user.role==="PATIENT")
          {
            console.log('Patient logged in successfully:', response.data);
            localStorage.setItem('patientInfo', JSON.stringify(response.data.user));
            localStorage.setItem('authToken', response.data.user.token);
            navigate('/root');
            setTimeout(()=>{
              localStorage.removeItem('authToken');
              localStorage.removeItem('patientInfo');
              alert("Session timeout, Please login again.");
              navigate("/root/login");
            },1800000);
            onClose();
          }
          else if(response.data.user.role==="RECEPTIONIST")
          {
            console.log('receptionist logged in successfully:', response.data);
            localStorage.setItem('receptionistInfo', JSON.stringify(response.data.user));
            localStorage.setItem('recAuthToken', response.data.user.token);
            window.open('/receptionist', '_blank');
            setTimeout(()=>{
              localStorage.removeItem('recAuthToken');
              localStorage.removeItem('receptionistInfo');
              alert("Session timeout, Please login again.");
              navigate("/root/login");
            },1800000);
            onClose();  
          }
          else
          {
            console.log(response.data.error);
            navigate("/root");
          }
        }
      }
      catch (error) {
        setApiError(error.response ? error.response.data.message || 'An error occurred' : 'An error occurred');
      } finally {
          setLoading(false);
      }
    };
  }
  return (
    <Container className='mt-5'>
      <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-white">
        {apiError && <Alert variant="danger">{apiError}</Alert>}
        {isUserValid?<></>:<Alert variant="danger">Invalid Username or Password</Alert>}
        <Form.Group controlId="formEmail">
          <Form.Label className='custom-label'>Email</Form.Label>
          <Form.Control
            type="email"
            name="Email"
            placeholder="Enter your email"
            value={loginData.Email}
            onChange={handleChange}
            isInvalid={!!errors.Email}
          />
          <Form.Control.Feedback type="invalid">
            {errors.Email}
          </Form.Control.Feedback>
        </Form.Group>
 
        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label className='custom-label'>Password</Form.Label>
          <Form.Control
            type="password"
            name="Password"
            placeholder="Enter your password"
            value={loginData.Password}
            onChange={handleChange}
            isInvalid={!!errors.Password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.Password}
          </Form.Control.Feedback>
        </Form.Group>
 
        <Button variant="primary" type="submit" className="mt-3" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
        </Button>
        <div>
        <Link to="/root/email-sender">Forgot Password?</Link>
        </div>
       </Form>
    </Container>
    );
};
 
export default Login;