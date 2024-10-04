import React, { useEffect, useState } from 'react';
import api from '../../apiHandler/api';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import StarRatings from 'react-star-ratings'
import './Doctor.css';
 
function Doctor() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setErrors] = useState(null);
    const location = useLocation();
    const navigate=useNavigate();
    const hospital=location.state!=null?location.state:null;
    useEffect(() => {
        handleApi();
    }, []);
 
   
    function handleApi() {
        api.get('/Doctor/Get/Doctor/HospitalId/'+hospital.hospitalId)
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
    function getRandomRating(){
        return Math.floor(Math.random()*5)+1
    }
    function handleBookAppointment()
    {
        if(localStorage.getItem('authToken')!=null)
        {
            navigate('/root/bookAppointments');
        }
        else
        {
            alert('Please login');
            navigate('/root/doctors');
        }
    }
    return (
        <div className='baimage'>
            <div style={{margin:"100px"}}>
                {loading && <div>Loading...</div>}
                {error && <div>Error: {error.message}</div>}
                {doctors.length > 0 ? (
                    doctors.map(doctor =>{ const rating=getRandomRating()
                         return (
                        <div className="Doctors d-flex justify-content-between" key={doctor.doctorId}>
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
                                <p> <StarRatings
                                        rating={rating}
                                        starRatedColor="gold"
                                        numberOfStars={5}
                                        name='rating'
                                        starDimension="20px"
                                        starSpacing="2px"
                                    /></p>
                            </div>
                            <div className="child btn btn-primary appointment-button">
                                <Link onClick={handleBookAppointment} state={{doctor:doctor,hospital:hospital}}><a>Book Appointment</a></Link>
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
 