import React, { useState, useEffect } from 'react';
import api from '../../apiHandler/api';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import './Hospital.css';
 
const Hospital = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('');
 
  const navigate = useNavigate();
 
  useEffect(() => {
    fetchHospitals();
  }, []);
 
  const fetchHospitals = async () => {
    try {
      const response = await api.get('/Hospital/Get/All/Hospitals');
      console.log('API Response:', response.data);
      setHospitals(response.data);
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
 
  const handleSearch = () => {
    navigate(`/root/locationSearch?location=${location.toLowerCase()}`);
    setLocation('');
  };
 
  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };
 
  return (
    <div className="hospital-background">
      <div className="container list-hospitals">
        <div className='container'>
          <div className='row'>
            <div className='col  col-4 d-flex justify-content-start align-items-center'>
              <h1 className=" text-center">Hospitals List</h1>
            </div>
            <div className="col col-8 search-container d-flex justify-content-end align-items-center">
              <input
                type="text"
                id="search"
                className="form-control search-bar w-50"
                placeholder="Find hospital by location"
                value={location}
                onChange={handleLocationChange}
              />
              <button
                className="btn-container btn btn-success ms-1"
                type="button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
 
 
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="alert alert-danger text-center">Error: {error.message}</div>}
       
        <div className="row">
          {hospitals.map(hospital => (
            <div key={hospital.hospitalId} className="col-md-4 mb-4">
              <div className="card custom-card h-100">
                <div className="custom-card-img-container hospital-image">
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
                <div className="card-body hospitalDtl">
                  <h5 className="card-title hospitalName">{hospital.hospitalName} Hospital</h5>
                  <p className="card-text">City: {hospital.city}</p>
                  <p className="card-text">Pincode: {hospital.pincode}</p>
                  <Link to="/root/doctors" state={hospital}>
                    <div className="btn btn-primary viewBtn">View Doctors</div>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
 
export default Hospital;