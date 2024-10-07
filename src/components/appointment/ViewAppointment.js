import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../apiHandler/api';
import '../css/ViewAppointment.css';
import axios from 'axios';

const ViewAppointment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const appointment = location.state;
    const [error, setError] = useState(null);

    const handleCancel = async () => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await api.delete(`/Appointment/Cancel/${appointment.appointmentId}`);
                alert('Appointment cancelled successfully.');
                navigate('/root/appointments'); 
            } catch (error) {
                setError('Failed to cancel appointment: ' + (error.response ? error.response.data : error.message));
            }
        }
    };

    if (error) {
        return <div className="alert alert-danger">{error}</div>;
    }

    if (!appointment) {
        return <div>Loading...</div>;
    }

    // Calculate the time difference
    const currentDate = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);
    const timeDifference = appointmentDate - currentDate; // Time difference in milliseconds
    const isCancelable = timeDifference >= 48 * 60 * 60 * 1000;

    const getStatusText = (appointment) => {
        const currentDate = new Date();

        if (new Date(appointment.appointmentDate) < currentDate) {
            const token = localStorage.getItem('recAuthToken');
            if (new Date(appointment.appointmentDate) < currentDate) {
                axios.put(`https://localhost:44376/api/Appointment/UpdateStatus/${appointment.appointmentId}?statusId=${2}`, null, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return 'Completed';
            }
            return 'Completed';
        }

        switch (appointment.statusId) {
            case 1:
                return 'Booked';
            case 0:
                return 'Cancelled';
            case -1:
                return 'Pending';
            case 2:
                return 'Completed';
            default:
                return 'Unknown';
        }
    };

    const getStatusClass = (appointment) => {
        const currentDate = new Date();

        if (new Date(appointment.appointmentDate) < currentDate) {
            return 'bg-info text-white';
        }

        switch (appointment.statusId) {
            case 1:
                return 'bg-success text-white';
            case 0:
                return 'bg-danger text-white';
            case -1:
                return 'bg-warning text-dark';
            case 2:
                return 'bg-info text-white';
            default:
                return 'bg-secondary text-white';
        }
    };

    return (
        <div className="container-bg">
            <h1>Appointment Details</h1>
            <div className="container view-container d-flex justify-content-center card p-4 w-50">
                <h5>Hospital Name: <span className="text-muted">{appointment.hospitalName}</span></h5>
                <h5>Doctor Name: <span className="text-muted">{appointment.doctorName}</span></h5>
                <h5>Reason: <span className="text-muted">{appointment.reason}</span></h5>
                <h5>Created At: <span className="text-muted">{new Date(appointment.createdAt).toLocaleString()}</span></h5>
                <h5>Appointment Date: <span className="text-muted">{new Date(appointment.appointmentDate).toLocaleString()}</span></h5>
                {
                    // Logic for booked appointments (statusId === 1 and isCancelable)
                    appointment.statusId === 1 && isCancelable ? (
                        <>
                            <p className="text-info mt-3 fw-bold">Your appointment has been booked</p>
                            <button className="btn btn-danger mt-3" onClick={handleCancel}>
                                Cancel Appointment
                            </button>
                        </>
                    ) : null
                }

                {
                    // Logic for pending appointments (statusId === -1 and isCancelable)
                    appointment.statusId === -1 && isCancelable ? (
                        <>
                            <p className="text-warning mt-3 fw-bold">Waiting for confirmation</p>
                            <button className="btn btn-danger mt-3" onClick={handleCancel}>
                                Cancel Appointment
                            </button>
                        </>
                    ) : null
                }

                {
                    // Logic for non-cancelable appointments
                    !isCancelable && (appointment.statusId === 1 || appointment.statusId === -1) ? (
                        <p className="text-warning mt-3 fw-bold">Upcoming Appointment</p>
                    ) : null
                }

                {
                    appointment.statusId === 0 ? (
                        <p className="text-danger mt-3 fs-1 fw-bold">Cancelled</p>
                    ) : appointment.statusId === 2 ? (
                        <p className="text-success mt-3 fw-bold">Completed</p>
                    ) : null
                }

                <p style={{display: "none"}} className={getStatusClass(appointment)}>
                    {getStatusText(appointment)}
                </p>
            </div>
        </div>
    );
};

export default ViewAppointment;
