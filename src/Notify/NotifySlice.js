import { createSlice,createAsyncThunk} from '@reduxjs/toolkit';


const initialState={
    data:[],
    status:'idle'
}

const NotifySlice=createSlice({
    name:'notifications',
    initialState,
    reducers:{

    },
    extraReducers:(builder)=>{
        builder.addCase( fetchAppointmentsByPatientId.fulfilled, (state,action)=>{
            state.data=action.payload;
            state.status='idle'
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



export const fetchAppointmentsByPatientId = createAsyncThunk(
    'appointments/fetchByPatientId',
    async (patientId) => {
        const response = await fetch(`https://localhost:44376/api/Appointment/GetAppointmentByPatientId/${patientId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch appointments');
        }
        const data = await response.json();
        console.log("Appointments Data:", data); 
        return data; 
    }
);

