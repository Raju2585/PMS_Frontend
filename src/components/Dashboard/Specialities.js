import React from 'react';
import { Link } from 'react-router-dom';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Specialities.css";
import derma from './derma.jpg';
import dentist from './dentist.jpg';
import cardio from './cardio.jpg';
import nutrionist from './nutritionist.png';
import psychologist from './pyschologist 1.png';
import orthopedic from './orthopedic.png';
import gynecologist from './gynecologist 1.png';
import pediatrician from './pediatrician 1.jpg';
 
const specialists = [
    { name: 'Dentist', image: dentist,Reasons:'Dental Cavity,Tooth Pain' },
    { name: 'Dermatologist', image: derma,Reasons:'Acne,Hairfall,Itching,Rashes' },
    { name: 'Cardiologist', image: cardio,Reasons:'heartburn,dizziness' },
    { name: 'Nutritionist', image: nutrionist ,Reasons:'malNutrition,Anaemia'},
    { name: 'Psychologist', image: psychologist,Reasons:'Depression,Anxiety,Autism' },
    { name: 'Orthopedic', image: orthopedic,Reasons:'Back Pain,Sprains' },
    { name: 'Gynecologist', image: gynecologist,Reasons:'PCOS,Pregnancy' },
    { name: 'Pediatrician', image: pediatrician,Reasons:'Vomiting,Cough,Runny Nose' },
];



 
const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items:5,
        slidesToSlide: 1
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToSlide: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToSlide: 1
    }
};
 
const Specialities = () => {
    return (
        <div className='appointment-specialist container'>
            <p className='Specialist'> 30+ Specialities</p>
            <h2 className='Specialist-heading'>Consult top doctors across Specialities</h2>
            <Carousel
                swipeable={false}
                draggable={false}
                showDots={false}
                responsive={responsive}
                ssr={true}
                infinite={true}
                autoPlay={false}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={500}
                containerClass="carousel-container"
                //removeArrowOnDeviceType={["tablet", "mobile"]}
                itemClass="carousel-item-padding-0"
                
            >
                {specialists.map((specialist, idx) => (
                    <div key={idx} className='Specilist-main-card' >
                        <div className="card custom-card specialist-card" style={{ width: '100%', maxWidth: '250px' }}>
                            <img src={specialist.image} className="card-img-top img-fluid problem-img" alt={specialist.name} />
                            <div className="card-body Specialist-consult">
                                <Link to='/root/specialist' state={{ specialization: specialist.name }} className="btn btn-info">
                                    {specialist.name}
                                </Link>
                               <div className="reason-text"><p>{specialist.Reasons}</p></div> 
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default Specialities;