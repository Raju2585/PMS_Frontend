import React, { useEffect, useState } from 'react';
import api from '../../apiHandler/api';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import './Doctor.css';

function Doctor() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setErrors] = useState(null);
    const [filters, setFilters] = useState({ name: '', specialization: '', city: '' });
    const location = useLocation();
    const navigate = useNavigate(); // useNavigate to redirect
    const hospital = location.state || null;
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        handleApi();
    }, []);

    function handleApi() {
        api.get('/Doctor/Get/All/Doctors')
            .then(response => {
                setDoctors(response.data);
                const generatedRatings = response.data.map(() => getRandomRating());
                setRatings(generatedRatings);
            })
            .catch(error => {
                setErrors(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function getRandomRating() {
        return Math.floor(Math.random() * 5) + 1;
    }

    function handleBookAppointment() {
        if (localStorage.getItem('authToken') != null) {
            navigate('/root/bookAppointments');
        } else {
            alert('Please login');
            navigate('/root/doctors');
        }
    }

    // Handle back button to navigate to the homepage
    function handleBack() {
        navigate(-1);
    }

    const filteredDoctors = doctors.filter(doctor => {
        return (
            doctor.doctorName.toLowerCase().includes(filters.name.toLowerCase()) &&
            doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase()) &&
            doctor.city.toLowerCase().includes(filters.city.toLowerCase())
        );
    });

    return (
        <div className='baimage' style={{ paddingTop: "150px", paddingBottom: "120px" }}>
            <div className='container'>
                {/* Back button at the top-right */}
                <div className="back-button-container" style={{
                    position: "absolute",
                    top: "20px",
                    left: "370px",
                     paddingTop: "50px",
                     marginTop:"30px",
                    textAlign: "center"
                }}>
                    <button 
                        type="button" 
                        className="btn btn-primary" 
                        
                        onClick={handleBack} // Call handleBack on click
                    >
                       <i class="fa-solid fa-house"></i>
                    </button>
                </div>

                {/* Filter inputs */}
                <div className='filter-container'>
                    <div className='input-group inp'>
                        <span className=' d-flex align-items-center justify-content-center p-1 filter-icon' style={{borderTopLeftRadius:"25px",borderBottomLeftRadius:"25px",width:"40px"}}><i className="fas fa-user-md "></i></span>
                        <input
                            type='text'
                            placeholder='Search by name'
                            value={filters.name}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                        />
                    </div>
                    <div className='input-group inp'>
                        <span className=' d-flex align-items-center justify-content-center p-1 filter-icon' style={{borderTopLeftRadius:"25px",borderBottomLeftRadius:"25px",width:"40px"}}><i className="fa-solid fa-stethoscope"></i></span>
                        <input
                            type='text'
                            placeholder='Filter by specialization'
                            value={filters.specialization}
                            onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                        />
                    </div>
                    <div className='input-group inp'>
                        <span className=' d-flex align-items-center justify-content-center p-1 filter-icon' style={{borderTopLeftRadius:"25px",borderBottomLeftRadius:"25px",width:"40px"}}><i className="fa-solid fa-location"></i></span>
                        <input
                            type='text'
                            placeholder='Filter by city'
                            value={filters.city}
                            onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                        />
                    </div>
                </div>

                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor, index) => {
                        const rating = ratings[index] !== undefined ? ratings[index] : 0;
                        

                        return (
                            <div key={doctor.doctorName}>
                                <div className="Doctors d-flex justify-content-between">
                                    <div className="child Doctor-image">
                                        <img
                                            src={`data:image/jpeg;base64,${doctor.image}`}
                                            className="img-fluid doctor-image"
                                            alt={doctor.doctorName}
                                        />
                                    </div>
                                    <div className="child Doctor-Details">
                                        <h4>{doctor.doctorName}</h4>
                                        <p>Specialization: {doctor.specialization}</p>
                                        <p>Consultation Fee: Rs.{doctor.consultationFee}</p>
                                        <p>Hospital: {doctor.hospitalName}</p>
                                        <p>City: {doctor.city}</p>
                                        <p>
                                            <StarRatings
                                                rating={rating}
                                                starRatedColor="gold"
                                                numberOfStars={5}
                                                name='rating'
                                                starDimension="20px"
                                                starSpacing="2px"
                                            />
                                        </p>
                                    </div>
                                    <div className="child btn btn-primary appointment-button">
                                        <Link onClick={handleBookAppointment} state={{ doctor: doctor, hospital: hospital }}>
                                            <a>Book Appointment</a>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    !loading && <div>No doctors available.</div>
                )}
            </div>
        </div>
    );
}

export default Doctor;
