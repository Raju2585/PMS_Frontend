import StarRatings from 'react-star-ratings';


// Doctors Component
const AllDoctors = ({ doctors, loading, error, handleAddDoctorClick}) => {
    const getRandomRating = () => Math.floor(Math.random() * 5) + 1;
    
    return (
      <div className="doc-container" >
        <div className='d-flex mb-4 justify-content-between'>
          <h2>Doctors List</h2>
          <button className='btn btn-primary' onClick={handleAddDoctorClick}>Add Doctor</button>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {doctors.length > 0 ? (
          doctors.map(doctor => {
            const rating = getRandomRating();
            return (
              <div className="doc-card d-flex justify-content-between" key={doctor.doctorId}>
        <div className="doc-image">
          <img
            src={`data:image/jpeg;base64,${doctor.image}`}
            alt={doctor.name}
          />
        </div>
        <div className="doc-details">
          <h4>{doctor.name}</h4>
          <strong>{doctor.doctorName}</strong>
          <p>Specialization: {doctor.specialization}</p>
          <p>Consultation Fee: Rs.{doctor.consultationFee}</p>
          <p>Email: {doctor.doctorEmail}</p>
          <StarRatings
            rating={getRandomRating()}
            starRatedColor="gold"
            numberOfStars={5}
            name='rating'
            starDimension="20px"
            starSpacing="2px"
          />
        </div>
      </div>
  
            );
          })
        ) : (
          !loading && <div>No doctors available.</div>
        )}
      </div>
    );
  };
export default AllDoctors;
