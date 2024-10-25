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
        notificationRemove(state, action) { state.data = state.data.filter(item => item.id !== action.payload);
        },

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
       
    }
})

export default NotifySlice.reducer;

export const { notificationRemove } = NotifySlice.actions;




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


