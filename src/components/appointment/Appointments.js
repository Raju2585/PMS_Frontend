import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../apiHandler/api';
import '../css/Appointments.css';
import axios from 'axios';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
    const location = useLocation();
    const appointment = location.state;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const patientInfo = JSON.parse(localStorage.getItem('patientInfo'));
                const response = await api.get(`/Appointment/GetAppointmentByPatientId/${patientInfo.id}`);
                
                if (!response.data) {
                    throw new Error('Network response was not ok');
                }

                setAppointments(response.data);
                localStorage.setItem('appointments', JSON.stringify(response.data));
            } catch (error) {
                setError(error.message);
            }
        };

        fetchAppointments();
    }, []);

    const getStatusText = (appointment) => {
        const currentDate = new Date();

        if (new Date(appointment.appointmentDate) < currentDate) {
            const token = localStorage.getItem('authToken');
            axios.put(`https://localhost:44376/api/Appointment/UpdateStatus/${appointment.appointmentId}?statusId=${2}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return 'Completed';
        }

        switch (appointment.statusId) {
            case 1: return 'Booked';
            case 0: return 'Cancelled';
            case -1: return 'Pending';
            case 2: return 'Completed';
            default: return 'Unknown';
        }
    };

    const getStatusClasses = (appointment) => {
        const currentDate = new Date();

        if (new Date(appointment.appointmentDate) < currentDate) {
            return { text: 'text-info', bg: 'bg-info' };
        }

        switch (appointment.statusId) {
            case 1: return { text: 'text-success', bg: 'bg-success' }; // Booked
            case 0: return { text: 'text-danger', bg: 'bg-danger' }; // Cancelled
            case -1: return { text: 'text-warning', bg: 'bg-warning' }; // Pending
            default: return { text: 'text-secondary', bg: 'bg-secondary' }; // Unknown
        }
    };

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
        return <div className="alert alert-danger">Error: {error}</div>;
    }

    return (
        <div className="container mt-5 appointments-heading">
            <h1 className="mb-4 appoinment-header">Appointments</h1>
            {
                appointments.length === 0 ? (
                    <div>
                        <h3>You don't have any Appointments</h3>
                    </div>
                ) : (
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Hospital Name</th>
                                <th>Doctor Name</th>
                                <th>Reason</th>
                                <th>Created At</th>
                                <th>Appointment Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appointment => (
                                <tr key={appointment.appointmentId}>
                                    <td>{appointment.hospitalName}</td>
                                    <td>{appointment.doctorName}</td>
                                    <td>{appointment.reason}</td>
                                    <td>{new Date(appointment.createdAt).toLocaleString()}</td>
                                    <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${getStatusClasses(appointment).bg} text-white appointment-status-badge`}>
                                            {getStatusText(appointment)}
                                        </span>
                                    </td>
                                    <td>
                                        {appointment.statusId === 2 && (
                                            <button className="btn btn-danger" disabled> Cancel</button>
                                        )}
                                        {appointment.statusId === 1 && (
                                            <button className="btn btn-danger" onClick={() => handleCancel(appointment.appointmentId)}> Cancel</button>
                                        )}
                                        {appointment.statusId === -1 && (
                                            <button className="btn btn-danger" onClick={() => handleCancel(appointment.appointmentId)}> Cancel</button>
                                        )}
                                        {appointment.statusId === 0 && (
                                            <button className="btn btn-danger" disabled> Cancel</button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            }
        </div>
    );
};

export default Appointments;
