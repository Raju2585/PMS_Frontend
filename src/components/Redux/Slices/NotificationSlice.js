import { createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import api from '../../../apiHandler/api';


const initialState={
    data:[],
    status:'idle'
}

const NotifySlice=createSlice({
    name:'appointments',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase( fetchAppointmentsByPatientId.fulfilled, (state,action)=>{
            state.status='idle'
            state.data = action.payload.filter(appointment => appointment.statusId === 1);
            
        })
        .addCase( fetchAppointmentsByPatientId.pending, (state,action)=>{
            state.status="loading"
        })
        
        .addCase( fetchAppointmentsByPatientId.rejected, (state,action)=>{
            state.status="error"
        })
        debugger
    }
})

export default NotifySlice.reducer;



// export const fetchAppointmentsByPatientId = createAsyncThunk(
//     'appointments/fetchByPatientId',
//     async (patientId) => {
//         const token = localStorage.getItem('authToken'); 

//         const response = await fetch(`https://localhost:44376/api/Appointment/GetAppointmentByPatientId/${patientId}`,{
//             method: 'GET', // Specify the method
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${token}` // Add the token to the Authorization header
//             },
//         });
//         if (!response.ok) {
//             throw new Error('Failed to fetch appointments');
//         }
//         const data = await response.json();
//         console.log("Appointments Data:", data); 
//         return data; 
//     }
// );
export const fetchAppointmentsByPatientId = createAsyncThunk(
    'appointments/fetchByPatientId',
    async (patientId) => {
        const token = localStorage.getItem('authToken'); 
        console.log("Using token:", token);

        const response = await api.get(`/Appointment/GetAppointmentByPatientId/${patientId}`); 
        

        if (response.data==null) {
            console.error("Fetch error:", response.statusText);
            throw new Error('Failed to fetch appointments');
        }

        const result=response.data;
        console.log("Appointments Data:",result );
        return result;
});


