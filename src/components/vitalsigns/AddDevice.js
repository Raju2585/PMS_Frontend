import React, { useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { json, useNavigate } from 'react-router-dom';
import api from '../../apiHandler/api';
const AddDevice = ({ onClose, show ,onDeviceAdded }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const patientInfo = localStorage.getItem('patientInfo')!=null ? JSON.parse(localStorage.getItem('patientInfo')) : null;
    const deviceReq = {
      Id: patientInfo.id, // Ensure you have patientId in localStorage
      Email: email,
      Password: password,
    };

    try {
      const response = await api.post('/Device/AddDevice', deviceReq);
      if (response.data.isSuccess) {
        // Handle success, e.g., show success message or redirect
        //alert('Device added successfully!');
        console.log(response.data.vitalSign);
        localStorage.setItem("vitalsigns",JSON.stringify(response.data.vitalSign));
        onDeviceAdded();
        onClose(); // Close modal
        navigate("/root/vitalsigns",{ state: { vitals: response.data.vitalSign } });
      } else {
        setError(response.data.Error || 'Failed to add device');
      }
    } catch (err) {
      setError('An error occurred while adding the device.');
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Device</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <div className="alert alert-danger">{error}</div>}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Login'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddDevice;
