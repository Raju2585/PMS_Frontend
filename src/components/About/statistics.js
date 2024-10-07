import React from 'react';
import '../About/statistics.css'; // Import your custom styles if you want additional customization

const Statistics = () => {
  return (
    <div className="container12 text-center my-5">
      <div className="row">
        <div className="col-md-3 col-6 mb-4">
          <h2 className="text-primary heads">5000+</h2>
          <p className='para'>Doctors</p>
        </div>
        <div className="col-md-3 col-6 mb-4">
          <h2 className="text-primary heads">10L+</h2>
          <p className='para'>Patients</p>
        </div>
        <div className="col-md-3 col-6 mb-4">
          <h2 className="text-primary heads">1000+</h2>
          <p className='para'>NABL Lab Partners</p>
        </div>
        <div className="col-md-3 col-6 mb-4">
          <h2 className="text-primary heads">1000+</h2>
          <p className='para'>Hospitals</p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
