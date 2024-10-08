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
    const navigate = useNavigate();
    const hospital = location.state || null;

    useEffect(() => {
        handleApi();
    }, []);

    function handleApi() {
        api.get('/Doctor/Get/All/Doctors')
            .then(response => {
                setDoctors(response.data);
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

    // Filter doctors based on input
    const filteredDoctors = doctors.filter(doctor => {
        return (
            doctor.doctorName.toLowerCase().includes(filters.name.toLowerCase()) &&
            doctor.specialization.toLowerCase().includes(filters.specialization.toLowerCase()) &&
            doctor.city.toLowerCase().includes(filters.city.toLowerCase())
        );
    });

    return (
        <div className='baimage' style={{ paddingTop: "110px", paddingBottom: "120px" }}>
            <div className='container'>
                <div className='filter-container'>
                    <input
                        type='text'
                        placeholder='Search by name'
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    />
                    <input
                        type='text'
                        placeholder='Search by specialization'
                        value={filters.specialization}
                        onChange={(e) => setFilters({ ...filters, specialization: e.target.value })}
                    />
                    <input
                        type='text'
                        placeholder='Search by city'
                        value={filters.city}
                        onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    />
                </div>

                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map(doctor => {
                        const rating = getRandomRating();
                        return (
                            <div className="Doctors d-flex justify-content-between" key={doctor.doctorName}>
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
