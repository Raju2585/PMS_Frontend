import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import api from '../../apiHandler/api';
import '../css/Appointments.css';
import { Link, useNavigate } from 'react-router-dom';

const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);
<<<<<<< HEAD
    const navigate = useNavigate();

=======
    const navigate=useNavigate();
    
>>>>>>> 8e074d6 (pmd)
    const fetchAppointments = async () => {
        try {
            const patientInfo = JSON.parse(localStorage.getItem('patientInfo'));
            const response = await api.get(`/Appointment/GetAppointmentByPatientId/${patientInfo.id}`);
            console.log(response.data);
            
            if (!response.data) {
                throw new Error('Network response was not ok');
            }
            
            setAppointments(response.data);
            localStorage.setItem('appointments', JSON.stringify(response.data));
         
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const getStatusText = (appointment) => {
        const currentDate = new Date();

        if (new Date(appointment.appointmentDate) < currentDate) {
            return 'Completed';
        }

        switch (appointment.statusId) {
            case 1:
                return 'Booked';
            case 0:
                return 'Cancelled';
            case -1:
                return 'Pending';
            case -2:
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
            case -2:
                return 'bg-info text-white';
            default:
                return 'bg-secondary text-white'; 
        }
    };

    const handleCancel = async (appointmentId) => {
        if (window.confirm('Are you sure you want to cancel this appointment?')) {
            try {
                await api.delete(`/Appointment/Cancel/${appointmentId}`);
                fetchAppointments();
                alert('Appointment cancelled successfully.');
            } catch (error) {
                setError('Failed to cancel appointment: ' + (error.response ? error.response.data : error.message));
            }
        }
    };

    if (error) {
        return <div className="alert alert-danger">Error: {error}</div>;
    }

    return (
        <div className="appointments-background d-flex justify-content-center">
            <div className="container mt-5 appointments-heading">
                <h1 className="mb-4 appoinment-header">Appointments</h1>
                {
                    appointments.length === 0 ? (
                        <div>
                            <h3>You don't have any Appointments</h3>
                        </div>
                    ) : (
                        <div className="row justify-content-center">
                            <div className="col-md-8">
                                <table className="table table-striped table-bordered table-hover">
                                    <thead className="thead-dark">
                                        <tr>
                                            <th style={{ width: '30%' }}>Hospital Name</th>
                                            <th style={{ width: '30%' }}>Doctor Name</th>
                                            <th style={{ width: '10%' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map(appointment => (
                                            <tr key={appointment.appointmentId}>
                                                <td>{appointment.hospitalName}</td>
                                                <td>{appointment.doctorName}</td>
                                                <td>
                                                    <Link to="/root/viewAppointment" state={appointment}>
                                                        <button className="btn btn-info">View</button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Appointments;
