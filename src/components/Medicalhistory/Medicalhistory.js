import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Medicalhistoryform.css';
import { useLocation, useNavigate  } from 'react-router-dom';
import api from '../../apiHandler/api';
const PatientForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const patientInfo = localStorage.getItem('patientInfo') != null ? JSON.parse(localStorage.getItem('patientInfo')) : null;
  const doctor = location.state != null ? location.state.doctor : null;
  const hospital = location.state != null ? location.state.hospital : null;
 
  const [formData, setFormData] = useState({
    reason: '',
    medication: [],
    hasAsthma: false,
    hasBloodPressure: false,
    hasCancer: false,
    hasCholesterol: false,
    hasDiabetes: false,
    hasHeartDisease: false,
    exerciseFrequency: '',
    alcoholConsumption: '',
    smoke: '',
    Id: patientInfo.id,
    doctorId: doctor.doctorId,
    hospitalName: hospital.hospitalName,
    firstName: '',
    lastName: '',
    gender: '',
    height: '',
    weight: '',
    dob: '',
    email: '',
    appointmentDate: '',
    appointmentTime:''
  });
 
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [slots, setSlots] = useState({});
  const [selectedSlot, setSelectedSlot] = useState('');
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
 
  const handleMedicationChange = (e) => {
    const medicationArray = e.target.value.split(',').map(med => med.trim()).filter(med => med.length > 0);
    setFormData({
      ...formData,
      medication: medicationArray
    });
  };
 
  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    try {
      // Validation of form data before sending
      if (!formData.Id || !formData.doctorId || !formData.hospitalName) {
        throw new Error('Patient ID, Doctor ID, and Hospital Name are required.');
      }
      if (!selectedSlot) {
        throw new Error('You must select an appointment slot.');
      }
      // Prepare data for the first API call
      const medicalHistoryData = {
        Id: formData.Id,
        reason: formData.reason,
        medication: formData.medication,
        hasAsthma: formData.hasAsthma,
        hasBloodPressure: formData.hasBloodPressure,
        hasCancer: formData.hasCancer,
        hasCholesterol: formData.hasCholesterol,
        hasDiabetes: formData.hasDiabetes,
        hasHeartDisease: formData.hasHeartDisease,
        exerciseFrequency: formData.exerciseFrequency,
        alcoholConsumption: formData.alcoholConsumption,
        smoke: formData.smoke,
      };
 
      // First API call: Submit medical history
      const medicalHistoryResponse = await api.post('/History/AddMedicalhistory', medicalHistoryData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
 
      console.log('Medical History Response:', medicalHistoryResponse);
 
      if (!medicalHistoryResponse.data.historyId) {
        throw new Error('Medical History ID not found in response');
      }
 
      // Prepare data for the second API call
      const appointmentData = {
        Id: formData.Id,
        doctorId: formData.doctorId,
        hospitalName: formData.hospitalName,
        patientName: formData.firstName + " " + formData.lastName,
        gender: formData.gender,
        height: parseInt(formData.height, 10),
        weight: parseInt(formData.weight, 10),
        dob: formData.dob,
        email: formData.email,
        appointmentDate: `${formData.appointmentDate}T${formData.appointmentTime}`,
        statusId: -1,
        reason: formData.reason,
      };
 
      // Second API call: Schedule appointment
      const appointmentResponse = await api.post('/Appointment/schedule', appointmentData);
      console.log('Appointment Response:', appointmentResponse);
 
      setSuccessMessage('Form submitted successfully');
      setErrorMessage('');
 
      // Clear form fields
      setFormData({
        reason: '',
        medication: [],
        hasAsthma: false,
        hasBloodPressure: false,
        hasCancer: false,
        hasCholesterol: false,
        hasDiabetes: false,
        hasHeartDisease: false,
        exerciseFrequency: '',
        alcoholConsumption: '',
        smoke: '',
        patientId: '',
        doctorId: '',
        hospitalName: '',
        firstName: '',
        lastName: '',
        gender: '',
        height: '',
        weight: '',
        dob: '',
        email: '',
        appointmentDate: '',
        appointmentTime:''
      });
      setTimeout(()=>navigate(-1),3000);
    } catch (error) {
      console.error('There was an error!', error);
      const errorMsg = error.response?.data?.errors || error.message || 'There was an error submitting the form';
      console.log('Error details:', error.response?.data);
      setErrorMessage(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
      setSuccessMessage('');
    }
  };
  const handleDateChange = async (e) => {
    const newDate = e.target.value;
    setFormData({ ...formData, appointmentDate: newDate });
 
    if (newDate) {
      try {
        const response = await api.get(`/Doctor/GetDoctorSlotsByDate?DoctorId=${doctor.doctorId}&date=${newDate}`);
        console.log(response.data);
        setSlots(response.data); // Set the fetched slots
      } catch (error) {
        console.error('Error fetching slots:', error);
        setErrorMessage('Failed to fetch slots. Please try again.');
      }
    }
    console.log(formData.appointmentTime);
  };
  const handleSlotClick = (time) => {
    setSelectedSlot(time); 
    setFormData({ ...formData, appointmentTime: time });
  };
  return (
    <>
    <div className='background mb-5'>
  <div className="medical-history-container container mt-5 mb-1 mh-container">
      <div className="form-container medical-form ">
        <h1 className="text-center">MAKE AN APPOINTMENT</h1>
        <form onSubmit={handleSubmit}>
          {/* Appointment Fields */}
          <div className="row mb-6">
            <div className="col-md-6 ">
              <label htmlFor="firstName" className='appointment-form'>First Name:</label>
              <input
                type="text"
                id="first"
                name="firstName"
                className="form-control form-control2"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className='appointment-form' htmlFor="lastName">Last Name:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-control form-control2"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-6">
            <div className="col-md-6">
              <label className='appointment-form' htmlFor="gender">Gender:</label>
              <select
                id="gender"
                name="gender"

                className="form-control form-control2 select-white"

                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className='appointment-form' htmlFor="height">Height (in cm):</label>
              <input
                type="number"
                id="height"
                name="height"
                className="form-control form-control2"
                value={formData.height}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-6">
            <div className="col-md-6">
              <label className='appointment-form' htmlFor="weight">Weight (in kg):</label>
              <input
                type="number"
                id="weight"
                name="weight"
                className="form-control form-control2"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className='appointment-form' htmlFor="dob">Date of Birth:</label>
              <input
                type="date"
                id="dob"
                name="dob"
                className="form-control form-control2"
                value={formData.dob}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-6">
            <div className="col-md-6">
              <label className='appointment-form' htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className="form-control form-control2"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
                <label className='appointment-form' htmlFor="appointmentDate">Appointment Date:</label>
                <input
                  type="date"
                  id="appointmentDate"
                  name="appointmentDate"
                  className="form-control form-control2"
                  value={formData.appointmentDate}
                  onChange={handleDateChange}
                  min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                  required
                />
              </div>
          </div>
          {/* Display Slots */}
          {formData.appointmentDate && (
              <div className="row mb-3">
                <div className="col-md-12">
                  <label className='appointment-form'>Select Slot:</label>
                  <div>
                    {
                      (slots.slot_1 && slots.slot_2 && slots.slot_3 && slots.slot_4 && slots.slot_5)?
                      <p>No slots are available on the selected date</p>
                      :
                      <div>
                        {slots.slot_1 !== undefined && (
                          <button
                            type="button"
                            className={`btn ${selectedSlot === '10:00:00' ? 'btn-success' : 'btn-outline-primary'} m-1`}
                            disabled={slots.slot_1}
                            onClick={() => handleSlotClick('10:00:00')}
                          >
                            10:00
                          </button>
                        )}
                        {slots.slot_2 !== undefined && (
                          <button
                            type="button"
                            className={`btn ${selectedSlot === '11:00:00' ? 'btn-success' : 'btn-outline-primary'} m-1`}
                            disabled={slots.slot_2}
                            onClick={() => handleSlotClick('11:00:00')}
                          >
                            11:00
                          </button>
                        )}
                        {slots.slot_3 !== undefined && (
                          <button
                            type="button"
                            className={`btn ${selectedSlot === '14:00:00' ? 'btn-success' : 'btn-outline-primary'} m-1`}
                            disabled={slots.slot_3}
                            onClick={() => handleSlotClick('14:00:00')}
                          >
                            14:00
                          </button>
                        )}
                        {slots.slot_4 !== undefined && (
                          <button
                            type="button"
                            className={`btn ${selectedSlot === '15:00:00' ? 'btn-success' : 'btn-outline-primary'} m-1`}
                            disabled={slots.slot_4}
                            onClick={() => handleSlotClick('15:00:00')}
                          >
                            15:00
                          </button>
                        )}
                        {slots.slot_5 !== undefined && (
                          <button
                            type="button"
                            className={`btn ${selectedSlot === '16:00:00' ? 'btn-success' : 'btn-outline-primary'} m-1`}
                            disabled={slots.slot_5}
                            onClick={() => handleSlotClick('16:00:00')}
                          >
                            16:00
                          </button>
                        )}
                    </div>
                    }
                  </div>
                </div>
              </div>
            )}

          <div className="row mb-6">
            <div className="col-md-12">
              <label className='appointment-form' htmlFor="reason">Reason for Visit:</label>
              <input
                type="text"
                id="reason"
                name="reason"
                className="form-control form-control2"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="row mb-6">
            <div className="col-md-6">
              <label className='appointment-form' htmlFor="medication">Medication:</label>
              <input
                type="text"
                id="medication"
                name="medication"
                className="form-control form-control2"
                placeholder="Enter medications separated by commas"
                value={formData.medication.join(', ')}
                onChange={handleMedicationChange}
              />
            </div>
            <div className="col-md-6">
              <label className='appointment-form'>Health Conditions:</label>
              <div>
                <label className='appointment-form'><input type="checkbox" name="hasAsthma" checked={formData.hasAsthma} onChange={handleChange} /> Asthma &nbsp;&nbsp;</label>
                <label className='appointment-form'><input type="checkbox" name="hasBloodPressure" checked={formData.hasBloodPressure} onChange={handleChange} /> Blood Pressure &nbsp;&nbsp;</label>
                <label className='appointment-form'><input type="checkbox" name="hasCancer" checked={formData.hasCancer} onChange={handleChange} /> Cancer &nbsp;&nbsp;</label>
                <label className='appointment-form'><input type="checkbox" name="hasCholesterol" checked={formData.hasCholesterol} onChange={handleChange} /> Cholesterol &nbsp;&nbsp;</label>
                <label className='appointment-form'><input type="checkbox" name="hasDiabetes" checked={formData.hasDiabetes} onChange={handleChange} /> Diabetes &nbsp;&nbsp;</label>
                <label className='appointment-form'><input type="checkbox" name="hasHeartDisease" checked={formData.hasHeartDisease} onChange={handleChange} /> Heart Disease</label>
              </div>
            </div>
          </div>
          <div className="row mb-6">
            <div className="col-md-6">
              <label className='appointment-form' htmlFor="exerciseFrequency">Exercise Frequency:</label>
              <select
                id="exerciseFrequency"
                name="exerciseFrequency"
                className="form-control form-control2 select-white"
                value={formData.exerciseFrequency}
                onChange={handleChange}
              >
                <option value="">Select Frequency</option>
                <option value="Never">Never</option>
                <option value="Rarely">Rarely</option>
                <option value="Sometimes">Sometimes</option>
                <option value="Often">Often</option>
                <option value="Always">Always</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className='appointment-form' htmlFor="alcoholConsumption">Alcohol Consumption:</label>
              <select
                id="alcoholConsumption"
                name="alcoholConsumption"
                className="form-control form-control2 select-white"
                value={formData.alcoholConsumption}
                onChange={handleChange}
              >
                <option value="">Select Consumption</option>
                <option value="None">None</option>
                <option value="Socially">Socially</option>
                <option value="Moderately">Moderately</option>
                <option value="Frequently">Frequently</option>
                <option value="Heavily">Heavily</option>
              </select>
            </div>
          </div>
          <div className="row mb-6">
            <div className="col-md-6">
              <label className='appointment-form' htmlFor="smoke">Do you smoke?</label>
              <div>
                <label className='appointment-form'><input type="radio" name="smoke" value="Yes" checked={formData.smoke === 'Yes'} onChange={handleRadioChange} /> Yes &nbsp;</label>
                <label className='appointment-form'><input type="radio" name="smoke" value="No" checked={formData.smoke === 'No'} onChange={handleRadioChange} /> No</label>
              </div>
            </div>
          </div>
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          <div className="button-container">
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </>
  );
};
 
export default PatientForm;