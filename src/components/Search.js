import React, { useState, useEffect } from 'react';
import { useLocation,Link } from 'react-router-dom';
import axios from 'axios'; 
import './css/Search.css'

const HospitalSearchComponent = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = new URLSearchParams(useLocation().search).get('location');
  
  const handleSearch = (location) => {
    if (!location) return;

    setLoading(true);
    setError(null);
    
    axios.get(`https://localhost:44376/api/Hospital/Get/HospitalsByLocation`, {
      params: { location: location }
    })
      .then(response => {
        setHospitals(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect((event) => {
    
    handleSearch(location);
  }, [location]);
  
  return (
    <div className='search-component'>
    <div className="container container-search mt-5">
      <h1 className="mb-4">Hospitals</h1>
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      
      <div className="row">
        {hospitals.length > 0 ? (
          hospitals.map(hospital => (
            <div key={hospital.hospitalId} className="col-md-4 mb-4">
              <div className="card custom-card">
                <div className="custom-card-img-container">
                  {hospital.hospitalImage ? (
                    <img
                      src={`data:image/jpeg;base64,${hospital.hospitalImage}`}
                      className="card-img-top custom-card-img"
                      alt={hospital.hospitalName}
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/300x200"
                      className="card-img-top custom-card-img"
                      alt="Placeholder"
                    />
                  )}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{hospital.hospitalName} Hospital</h5>
                  <p className="card-text">Location: {hospital.city}</p>
                  <p className="card-text">Pincode: {hospital.pincode}</p>
                  <p className="card-text">Hospital ID: {hospital.hospitalId}</p>
                  <Link to="/root/doctors" state={hospital}><div  className="btn btn-primary">View Doctors</div></Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hospitals found.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default HospitalSearchComponent;
