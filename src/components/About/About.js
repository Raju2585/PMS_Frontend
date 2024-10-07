import React from 'react';
import teamImage from '../Assests/medicover.jpg';
import patientimg from '../Assests/patientimg.jpg';
import raju from '../Assests/raju (1).jpeg';
import pavani from '../Assests/raju (2).jpeg';
import suchi from '../Assests/raju (3).jpeg';
import shruthi from '../Assests/shruthi.jpeg';
import Statistics from './statistics';
import patientstory from '../Assests/pmsstory.jpg';
import involved from '../Assests/involved.png';
import val from '../Assests/ourval.jpg';
import './About.css'; // Make sure to import your CSS file
import Footer from '../Footer';

const AboutUs = () => {
  return (
    <div className='applyimage'>
      <div className="container mt-5">


        <section className="mb-5 mt-5 mission-section d-flex align-items-center">
          <div className="image-container" style={{ flex: '1', maxWidth: '50%' }}>
            <img src={patientimg} alt="Mission" className="img-fluid rounded" style={{ width: '100%', height: 'auto' }} />
          </div>
          <div className="text-container" style={{ flex: '1', maxWidth: '50%', paddingLeft: '20px' }}>
            <h1>Our Mission</h1>
            <p className="text-center">
              At PMS,We prioritize patient-centric care, ensuring the well-being and comfort of patients through personalized and timely health insights. Our commitment to innovation and excellence drives us to continuously improve and integrate cutting-edge technology in our services
            </p>
          </div>
        </section>



        <section className="mb-5">
         
          <br />
          <div className="row align-items-center">
            <div className="col-md-6">
            <h1>Our Story</h1>
              <p>
                Our journey began with a shared vision: to transform patient care through innovative monitoring solutions. Inspired by personal experiences
                and the desire to make a difference, we set out to create a system that not only captures vital health data but
                also empowers patients and enhances the decision-making process for caregivers.
              </p>
            </div>
            <div className="col-md-6 text-center">
              <img src={patientstory} alt="Our Team" className="img-fluid rounded mb-3" style={{ maxWidth: '100%' }} />
            </div>
          </div>
        </section>


        <h1>Having World Class Facilities & Trusted by</h1>
        <Statistics />

        <section className="mb-5">
          <h2>Meet Our Team</h2>
          <br />
          <div className="row text-center">
            <div className="col-md-3">
              <h3>Santhiraju</h3>
              <img src={raju} alt="Team Member" className="img-fluid rounded mb-2 passport-image" />
              <p>Founder & CEO</p>
            </div>
            <div className="col-md-3">
              <h3>Pavani</h3>
              <img src={pavani} alt="Team Member" className="img-fluid rounded mb-2 passport-image" />
              <p>Chief Technology Officer</p>
            </div>
            <div className="col-md-3">
              <h3>Shruthi</h3>
              <img src={shruthi} alt="Team Member" className="img-fluid rounded mb-2 passport-image" />
              <p>Founder & CEO</p>
            </div>
            <div className="col-md-3">
              <h3>Suchithra</h3>
              <img src={suchi} alt="Team Member" className="img-fluid rounded mb-2 passport-image" />
              <p>Founder & CEO</p>
            </div>
          </div>
        </section>
        <section className="mb-5">
          <div className="row align-items-center">
            <div className="col-md-6 text-center">
              <img
                src={val}
                alt="Values"
                className="img-fluid rounded mb-3 small-image" // Apply class here
              />
            </div>
            <div className="col-md-6">
              <h2>Our Values</h2>
              <p>
                Our values drive everything we do. We believe in fostering innovation, prioritizing patient care, and ensuring
                that our solutions empower both caregivers and patients. These principles guide our mission as we work towards
                transforming healthcare for a better future.
              </p>
            </div>
          </div>
        </section>






        <section className="mb-5">
          <h2>Get Involved</h2><br />
          <img src={involved} alt="Get Involved" className="img-fluid rounded mb-3" />
          <p>To effectively engage users with a patient monitoring system, create a variety of content that educates and inspires. Start with an overview video and infographic that explain the system's purpose and features. Highlight patient benefits through testimonials and FAQs addressing common concerns. Provide healthcare professionals with training webinars and case studies showcasing successful implementations. Foster community through interactive demos, support groups, and health challenges.</p>
        </section>


      </div>
      <div>
        <Footer />
      </div>

    </div>


  );
};

export default AboutUs;
