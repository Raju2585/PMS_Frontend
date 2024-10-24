// import React, { useEffect, useState } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { fetchAppointmentsByPatientId } from '../Redux/Slices/NotificationSlice';
// import { Alert } from 'react-bootstrap';

// function Notification() {
//     const dispatch = useDispatch();
//     const [patientId, setPatientId] = useState(null);
//     const { data: appointments, status } = useSelector(state => state.appointments);

//     useEffect(() => {
//         const storedPatientInfo = localStorage.getItem('patientInfo');

//         if (storedPatientInfo) {
//             const patientInfo = JSON.parse(storedPatientInfo);
//             setPatientId(patientInfo.id);
//             dispatch(fetchAppointmentsByPatientId(patientInfo.id));
//         }
//     }, [dispatch]);

//     if (status === 'loading') {
//         return <p>Loading....</p>;
//     }
//     if (status === 'error') {
//         return <p>Error in loading appointments</p>;
//     }

    
//     const confirmedAppointments = appointments.filter(appointment => appointment.statusId === 1);
//     const appointmentLength = confirmedAppointments.length;

//     return (
//         <div style={{margin:'200px'}}>
//             {appointmentLength > 0 && (
//                 <Alert variant="success">
//                     {confirmedAppointments.map((appointment, index) => (
//                         <div key={index}>
//                             Your appointment with Dr. {appointment.doctorName} at {appointment.hospitalName} hospital has been booked successfully!
//                         </div>
//                     ))}
//                 </Alert>
//             )}
//             {appointmentLength === 0 && (
//                 <div className='notification-missed'>No notifications found</div>
//             )}
//         </div>
//     );
// }

// export default Notification;

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointmentsByPatientId } from '../Redux/Slices/NotificationSlice';
import { Alert } from 'react-bootstrap';

function Notification() {
    const dispatch = useDispatch();
    const [patientId, setPatientId] = useState(null);
    const [showNotification, setShowNotification] = useState(true); // Local state to manage notification visibility
    const notifications = useSelector(state => state.appointments.data);
    const status = useSelector(state => state.appointments.status);

    useEffect(() => {
        const storedPatientInfo = localStorage.getItem('patientInfo');

        if (storedPatientInfo) {
            const patientInfo = JSON.parse(storedPatientInfo);
            setPatientId(patientInfo.id);
            dispatch(fetchAppointmentsByPatientId(patientInfo.id));
        }
    }, [dispatch]);

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
        <div style={{margin:'200px'}}>
            {showNotification && confirmedAppointments.length > 0 && (
                <Alert variant="success" dismissible onClose={() => setShowNotification(false)}>
                    {confirmedAppointments.map((appointment, index) => (
                        <div key={index}>
                            Your appointment with Dr. {appointment.doctorName} at {appointment.hospitalName} has been booked successfully!
                        </div>
                    ))}
                </Alert>
            )}
            {notificationsLength === 0 && (
                <div className='notification-missed'>No notifications found</div>
            )}
        </div>
    );
}

export default Notification;
