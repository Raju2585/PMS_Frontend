import React, { useEffect } from 'react'
import {useDispatch,useSelector} from 'react-redux'
import {  fetchAppointmentsByPatientId } from './NotifySlice'



function Notify() {
    const dispatch=useDispatch();
    const {data:appointments} = useSelector((state) => state.notifications);
    console.log("the notification data is",notifications);
    // useEffect(()=>{
    //    dispatch( fetchAppointmentsByPatientId())},[]
    // )
    useEffect(() => {
        if (patientId) {
            dispatch(fetchAppointmentsByPatientId(patientId));
        }
    }, [dispatch, patientId]);

    // Log the appointments data
    useEffect(() => {
        console.log("Appointments from Redux Store:", appointments);
    }, [appointments]);

  return (
    <div>
        
    </div>
  )
}

export default Notify