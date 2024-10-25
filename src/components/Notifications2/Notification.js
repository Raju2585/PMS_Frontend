

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointmentsByPatientId,notificationRemove } from '../Redux/Slices/NotificationSlice';
import { Alert } from 'react-bootstrap';

function Notification() {
    const dispatch = useDispatch();
    const [patientId, setPatientId] = useState(null);
    const [showNotification, setShowNotification] = useState(true); // Local state to manage notification visibility
    const notifications = useSelector(state => state.appointments.data);
    const status = useSelector(state => state.appointments.status);
    const notificationCount=useSelector(state=>state.appointments.notificationCount)

    useEffect(() => {
        const storedPatientInfo = localStorage.getItem('patientInfo');

        if (storedPatientInfo) {
            const patientInfo = JSON.parse(storedPatientInfo);
            setPatientId(patientInfo.id);
            dispatch(fetchAppointmentsByPatientId(patientInfo.id));
        }
    }, [dispatch]);

    const removeNotification=(appointment)=>{
        dispatch(notificationRemove(appointment))
    }

    if (status === 'loading') {
        return <p>Loading....</p>;
    }
    if (status === 'error') {
        return <p>Error in loading appointments</p>;
    }

    // Filter for confirmed appointments
    const confirmedAppointments = notifications.filter(appointment => appointment.statusId === 1);
    const notificationsLength = notifications.length || 0;

    return (
        
          <div style={{ margin: '200px' }}>
            {confirmedAppointments.length > 0 ? (
                confirmedAppointments.map(appointment => (
                    <Alert
                        key={appointment.id}
                        variant="success"
                        dismissible
                        onClose={() => removeNotification(appointment.id)} 
                    >
                        Your appointment with Dr. {appointment.doctorName} at {appointment.hospitalName} hospital has been booked successfully!
                    </Alert>
                ))
            ) : (
                <div className='notification-missed'>No notifications found</div>
            )}
        </div>
        
    );
}

export default Notification;
