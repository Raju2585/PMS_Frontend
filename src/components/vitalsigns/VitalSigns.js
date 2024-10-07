import React from 'react';
import { useLocation } from 'react-router-dom';

import ecgsignal from './ecgsignal.jpg';
import VitalImage from './VitalImage.jpg';
import VitalSignBanner from './vitalsignbanner.jpg';
import respiration from './respiration.png';
import bp from './bp.webp';
import o2 from './o2.avif';
import temp from './temp.webp';

import './VitalSigns.css';

function VitalSigns() {
    const location = useLocation();
    const vitals = location.state?.vitals || JSON.parse(localStorage.getItem("vitalsigns"));
    console.log(vitals);
    
    if (!vitals) { 
        return <p>No vital signs data available.</p>; 
    } 

    const renderVital = (label, value, image,icon) => (
        <div className="card custom-vital  bg-transparent" style={{width:'500px'}}>
            <div className='icon d-flex'>
                <div className="icon-shape">
                  {icon}
                   
                </div>
                <div className="icon-text  bg-transparent">
                    <p className="card-text icon-textment">{label}</p>
                    <p className="icon-value">{typeof value === 'string' || typeof value === 'number' ? value : 'n/a'}</p>
                </div>
            </div>
            <div className="card-body bg-transparent">
                <img src={image} className="card-img-top vital-image img-fluid" alt={label} />
            </div>
        </div>
    );

    return (
      <div className='container mr-5 vit d-flex justify-content-between align-items-center' style={{marginRight:'20%'}}>
        <div className='vital-container' >
            <div className='vital'>
                <div className='overview-conditions'>
                    {/* <div>
                        <h2>Overview Conditions</h2>
                        <img src={VitalSignBanner} alt="previe-image" className='img-fluid vital-banner' /> 
                    </div> */}
                </div>
                <div className='my-vitals'>
                    <div className='vital-heading'>
                        {/* <h2>My Vital Signs</h2> */}
                        {/* <div className='vital-condtions d-flex justify-content-around'>
                            {renderVital('Heart Rate', vitals.heartRate, ecgsignal, <i className="fa-regular fa-heart"></i>)}
                            {renderVital('Respiratory Rate', vitals.respiratoryRate, respiration,<i class="fa-solid fa-droplet"></i>)}
                            {renderVital('Blood Pressure', vitals.bloodPressure, bp,<i class="fa-solid fa-droplet"></i>)}
                            {renderVital('Oxygen Saturation', vitals.oxygenSaturation, o2,<i class="fa-solid fa-droplet"></i>)}
                            {renderVital('Temperature', vitals.temperature, temp,<i class="fa-solid fa-temperature-three-quarters"></i>)} 
                        </div> */}
                         <div className='vital-layout container'>
                          
                <div className='single-card'>
                    {/* <div className="vital-image">
                            <img src={VitalImage} className='img-fluid vitalImage' alt='vitalimage'/>
                    </div> */}
                    <h2>My Heart Condition</h2>
                          <div className="heart-rate-display">
                            <div className='hear'>{renderVital('Heart Rate', vitals.heartRate, ecgsignal,<i className="fa-regular fa-heart"></i>)}</div>
                          </div>
                </div>
                <div className='multiple-cards'>
                <h2>Overview Conditions</h2>
                <div className='row' >
                        {renderVital('Respiratory Rate', vitals.respiratoryRate, respiration,<i class="fa-solid fa-droplet"></i> )}
                        {renderVital('Blood Pressure', vitals.bloodPressure, bp,<i class="fa-solid fa-droplet"></i>)}
                    </div>
                    <div className='row'>
                        {renderVital('Oxygen Saturation', vitals.oxygenSaturation, o2,<i class="fa-solid fa-droplet"></i>)}
                        {renderVital('Temperature', vitals.temperature, temp,<i class="fa-solid fa-temperature-three-quarters"></i>)}
                    </div>
                </div>
            </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default VitalSigns;
