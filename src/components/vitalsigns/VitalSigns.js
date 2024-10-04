import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import '../Medicalhistory/VitalSigns.css'; 
import heartrate from '../Assests/heartrate.jpg';
import oxygen from '../Assests/oxygen.jpg';
import bp from '../Assests/bp.jpg';
import temperature from '../Assests/temperature.jpg';
import respiratory from '../Assests/respiratory.jpg';
import { useLocation } from 'react-router-dom';

const VitalSigns = () => {
  const location = useLocation();
  const vitals = location.state?.vitals || JSON.parse(localStorage.getItem("vitalsigns"));



  if (!vitals) {
    return <p>No vital signs data available.</p>;
  }

  // Vital sign data structure
  const vitalSignData = [
    { type: 'Heart Rate', value: vitals.heartRate || 'N/A', image: heartrate },
    { type: 'Oxygen Saturation', value: vitals.oxygenSaturation || 'N/A', image: oxygen },
    { type: 'Blood Pressure', value: vitals.bloodPressure || 'N/A', image: bp },
    { type: 'Temperature', value: vitals.temperature || 'N/A', image: temperature },
    { type: 'Respiratory Rate', value: vitals.respiratoryRate || 'N/A', image: respiratory },
  ];

  return (
    <div className="vital-signs-container mb-4" style={{ width: '60%', margin: '0 auto' }}>
      <h2 className="vital-signs-title mb-4">Vital Signs</h2>
      {vitalSignData.length > 0 ? (
        <div className="row">
          {vitalSignData.map((sign, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <div className="card vital-sign-card">
                <img 
                  src={sign.image} 
                  alt={sign.type} 
                  className="card-img-top" 
                />
                <div className="card-body">
                  <h5 className="card-title">{sign.type}</h5>
                  <p className="card-text">
                    <strong>{sign.value}</strong>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No vital signs available.</p>
      )}
    </div>
  );
};

export default VitalSigns;
