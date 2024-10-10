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
    const [cancelDisable,setCancelDisable]=useState(false);
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
            case 1: return { bg: 'bg-success' }; // Booked
            case 0: return { bg: 'bg-danger' }; // Cancelled
            case -1: return { bg: 'bg-warning' }; // Pending
            case 2: return { bg: 'bg-secondary' }; // Completed
            default: return { bg: 'bg-light' }; // Unknown status
          }
    };

    
    const handleCancel = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await api.delete(`/Appointment/Cancel/${appointmentId}`);
                alert('Appointment cancelled successfully.');
                setAppointments((prevAppointments) =>
                    prevAppointments.map(appointment =>
                        appointment.appointmentId === appointmentId
                            ? { ...appointment, statusId: 0 } // Update statusId to 2 for cancelled
                            : appointment
                    )
                );
                setCancelDisable(true);
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
        <div className="appointments-background">
        <div className="mt-5 appointments-heading">
            <div className='container' style={{marginLeft:"93px"}}>
            <h1 className="mb-4 appoinment-header">Appointments</h1>
            {
                appointments.length === 0 ? (
                    <div>
                        <h3>You don't have any Appointments</h3>
                    </div>
                ) : (
                    <div className="table-container" style={{position:'fixed'}}>
                        <table className="table  table-striped table-bordered table-hover apnmt-table">
                        <thead className="thead-dark apnmt-table-head">
                            <tr>
                                <th>Hospital Name</th>
                                <th>Doctor Name</th>
                                <th>Patient Name</th>
                                <th>Reason</th>
                                <th>Created At</th>
                                <th>Appointment Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appointment => {
                                    const currentDate = new Date();
                                    const appointmentDate = new Date(appointment.appointmentDate);
                                    const timeDifference = appointmentDate - currentDate; // Time difference in milliseconds
                                    const isCancelable = timeDifference >= 48 * 60 * 60 * 1000;
                                return (
                                    <tr key={appointment.appointmentId}>
                                    <td>{appointment.hospitalName}</td>
                                    <td>{appointment.doctorName}</td>
                                    <td>{appointment.patientName}</td>
                                    <td>{appointment.reason}</td>
                                    <td>{new Date(appointment.createdAt).toLocaleString()}</td>
                                    <td>{new Date(appointment.appointmentDate).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${getStatusClasses(appointment).bg} text-white appointment-status-badge`}>
                                            {getStatusText(appointment)}
                                        </span>
                                    </td>
                                    {
                                        appointment.statusId === 1 && isCancelable ? (
                                            <td>
                                                <button className="btn btn-danger" onClick={() => handleCancel(appointment.appointmentId)} disabled={cancelDisable}>
                                                    Cancel
                                                </button>
                                            </td>
                                            ) : null
                                    }

                                    {
                                        appointment.statusId === -1 && isCancelable ? (
                                            <td>
                                                <button className="btn btn-danger" onClick={() => handleCancel(appointment.appointmentId)} disabled={cancelDisable}>
                                                    Cancel
                                                </button>
                                            </td>
                                        ) : null
                                    }

                                    {
                                        !isCancelable && (appointment.statusId === 1 || appointment.statusId === -1) ? (
                                            <td>
                                                <button className="btn btn-danger" onClick={handleCancel} disabled>
                                                    Cancel
                                                </button>
                                            </td>
                                        ) : null
                                    }

                                    {
                                        appointment.statusId === 0 ? (
                                            <td>
                                                <button className="btn btn-danger" onClick={handleCancel} disabled>
                                                    Cancel
                                                </button>
                                            </td>
                                        ) : appointment.statusId === 2 ? (
                                            <td>
                                                <button className="btn btn-danger" onClick={handleCancel} disabled>
                                                    Cancel
                                                </button>
                                            </td>
                                        ) : null
                                    }
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    </div>
                )
            }
            </div>
        </div>
        </div>
    );
};

export default Appointments;
