import React, { useEffect, useState } from 'react';
import api from '../../apiHandler/api';
import { Link, useLocation } from 'react-router-dom';
import StarRatings from 'react-star-ratings';
import './Specailist.css'

function Doctor() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const specialization = location.state?.specialization; 
    const hospital=location.state!=null?location.state:null;

    useEffect(() => {
        console.log("Location state",location.state);
        if (specialization) {
            handleApi(specialization); 
        } else {
            setLoading(false);
            setError(new Error('No specialization provided.'));
        }
    }, [specialization,hospital]);

    const handleApi = async (specialization) => {
        try {
            const response = await api.get(`/Doctor/Get/Doctor/${specialization}`);
            setDoctors(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const getRandomRating = () => Math.floor(Math.random() * 5) + 1;

    return (
        <>
        <div className='spec'>
        <div className='full-page-wrapper baimage '>
        <div className='container spel-container' style={{ margin:"100px",marginLeft:"300px" }}>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error.message}</div>}
            {!loading && doctors.length === 0 && <div>No doctors available.</div>}
            {doctors.map(doctor => {
                const rating = getRandomRating();
                return (
                    <div className="Specialist-Doctors d-flex justify-content-between" key={doctor.doctorId}>
                        <div className="child Doctor-image">
                            <img
                                src={`data:image/jpeg;base64,${doctor.image ? doctor.image : ''}`}
                                className="img-fluid spel-doctor-image"
                                alt={doctor.doctorName}
                            />
                        </div>
                        <div className="child Specialist-Doctor-Details">
                            <h4>{doctor.doctorName}</h4>
                            <p>Specialization: {doctor.specialization}</p>
                            <p>Consultation Fee: Rs.{doctor.consultationFee.toFixed(2)}</p>
                            <StarRatings
                                rating={rating}
                                starRatedColor="gold"
                                numberOfStars={5}
                                name='rating'
                                starDimension="20px"
                                starSpacing="2px"
                            />
                        </div>
                        <div className="child btn btn-primary appointment-button">
                            <Link to='/root/bookAppointments'  state={{doctor:doctor,hospital:hospital}}>
                                <span>Book Appointment</span>
                            </Link>
                        </div>
                    </div>
                );
            })}
        </div>
        </div>
        </div>
        </>
    );
}

export default Doctor;
