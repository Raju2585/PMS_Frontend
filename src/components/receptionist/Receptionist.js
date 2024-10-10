import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../receptionist/receptionist.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import logo from "../Assests/newlogo.png";
import AllAppointments from './AllAppointments';
import Tasks from './Tasks';
import AllDoctors from './AllDoctors';
// import bargraph from '../Assests/barimage.jpg';
import bargraph from '../Assests/barimage.png'

const Receptionist = () => {
  const [activeComponent, setActiveComponent] = useState('default');
  const navigate = useNavigate();
  const receptionistInfo = JSON.parse(localStorage.getItem('receptionistInfo')) || null;

  const hospitalName = receptionistInfo?.hospitalName || 'Unknown Hospital';
  const receptionistName = receptionistInfo?.receptionistName || 'Unknown Receptionist';
  const [appointments, setAppointments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [filterPatientName, setFilterPatientName] = useState('');
  const [filterDoctorName, setFilterDoctorName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const handleLogout = () => {
    localStorage.removeItem('recAuthToken');
    localStorage.removeItem('receptionistInfo');
    navigate('/root');
  };
  //fetching appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('recAuthToken');
      const hospitalName = JSON.parse(localStorage.getItem('receptionistInfo'))?.hospitalName;
      try {
        const response = await axios.get(`https://localhost:44376/api/Appointment/GetAllAppointments/${hospitalName}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setAppointments(response.data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    console.log("appointments executed");
    fetchAppointments();
  }, []);
  //fetching pending appointments
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('recAuthToken');
      const hospitalName = JSON.parse(localStorage.getItem('receptionistInfo'))?.hospitalName;
      const statusId = -1;
      try {
        const response = await axios.get(`https://localhost:44376/api/Appointment/GetHospitalName/${hospitalName}/${statusId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    console.log("tasks executed");
    fetchTasks();
  }, []);
  const confirmAppointment = async (appointmentId) => {
    const token = localStorage.getItem('recAuthToken');
    const statusId = 1;
    try {
      await axios.put(`https://localhost:44376/api/Appointment/UpdateStatus/${appointmentId}?statusId=${statusId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(prev => prev.filter(task => task.appointmentId !== appointmentId));
      alert(`Appointment for ID ${appointmentId} confirmed!`);
    } catch (error) {
      console.error('Error confirming appointment:', error);
      alert('Error confirming appointment. Please try again.');
    }
  };
  //fetching doctors
  const fetchDoctors = async () => {
    const token = localStorage.getItem('recAuthToken');
    const hospitalId = JSON.parse(localStorage.getItem('receptionistInfo'))?.hospitalId;
    try {
      const response = await axios.get(`https://localhost:44376/api/Doctor/Get/Doctor/HospitalId/${hospitalId}`, {
        headers: { Authorization: ` Bearer ${token}` },
      });
      console.log(response.data);
      setDoctors(response.data || []);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchDoctors();
  }, []);
  // Function to get today's appointments
  const getTodaysAppointments = () => {
    const today = new Date().toISOString().slice(0, 10); // Format as YYYY-MM-DD

    return appointments.filter(appointment => {
      // Ensure the appointment date is valid before comparing
      const appointmentDate = new Date(appointment.date);
      if (!isNaN(appointmentDate)) { // Check if it's a valid date
        const formattedAppointmentDate = appointmentDate.toISOString().slice(0, 10);
        return formattedAppointmentDate === today;
      }
      return false;
    });
  };


  //overview
  const renderDefaultCards = () => (
    <div>

      <div className="default-cards d-flex justify-content-between">
        <div className="card-custom flex-fill mx-2" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* <img src={bargraph} alt="Bar Graph" className="image-top-right" style={{position: 'absolute',top: '40%',right: '10%', width: '80px',height: 'auto', }}
          /> */}<i class="fa-solid fa-chart-simple image-top-right" style={{position: 'absolute',top: '40%',right: '10%', width: '80px',fontSize: '80px',height: 'auto',color: 'grey', }}></i>
          <div className="card-header-custom">
            <h5 className="card-title"><i className="fa fa-calendar" aria-hidden="true"></i> Appointments</h5>
          </div>
          <div className="card-body-custom">
            {
              appointments?.length > 0 ?
                <p className="card-text"><b style={{ fontSize: '40px' }}>{appointments.length}</b><br /><b>Appointments</b></p> :
                <p className="card-text">You have 0 completed appointments</p>
            }
          </div>
        </div>

        <div className="card-custom flex-fill mx-2" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* <img src={bargraph} alt="Bar Graph" className="image-top-right" style={{position: 'absolute',top: '40%',right: '10%', width: '80px',height: 'auto', }}
          /> */}<i class="fa-solid fa-chart-simple image-top-right" style={{position: 'absolute',top: '40%',right: '10%', width: '80px',fontSize: '80px',height: 'auto',color: 'grey', }}></i>
          <div className="card-header-custom">
            <h5 className="card-title"><i class="fas fa-tasks"></i>  Tasks</h5>
          </div>
          <div className="card-body-custom">
            {
              tasks?.length > 0 ?
                <p className="card-text"><b style={{ fontSize: '40px' }}>{tasks.length}</b><br /><b>Tasks</b></p> :
                <p className="card-text">You have no tasks to complete.</p>
            }
            
          </div>
        </div>
      </div>


      

    </div>
  );
  const handleAddDoctorSuccess = () => {
    setActiveComponent('doctors')
    fetchDoctors(); // Optionally re-fetch doctors after adding a new one
  };
  const handleAddDoctorClick = () => {
    setActiveComponent("AddDoctor");
  }


  return (
    <div className="receptionist-container">
      {/* Navbar */}
      <nav className="navbar-custom sticky-top d-flex" style={{ height: "80px" }}>

        <div className="container d-flex justify-content-between align-items-center">
          <div className="d-flex ">
            <Link to="/receptionist">
              <img src={logo} className="custom-logo" alt="Logo" />
            </Link>
            <span className="custom-title-logo fw-bold">PMS</span>
          </div>
          <ul className='d-flex justify-content-between align-items-center receiptonist-navbar'>
            <li><a className="navbar-brand" href="#">
              {hospitalName} Hospital</a></li>

            <li><span className="navbar-text"><i class="fa-solid fa-user" ></i>{receptionistName}</span></li>
            <li><i onClick={handleLogout} class="fa-solid fa-power-off"></i></li>
          </ul>
        </div>

      </nav>

      <div className="main-content d-flex">
        {/* Sidebar */}
        <div className="sidebar-custom">


          <ul className="sidebar-links d-block ">
            <li className="sidebar-section-title">Main Menu</li>
            <li><NavLink to="#" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')} onClick={() => setActiveComponent('overview')}><i class="fa fa-list-alt" aria-hidden="true"></i> Overview</NavLink></li>
            <li><NavLink to="#" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')} onClick={() => setActiveComponent('doctors')}><i class="fas fa-user-md"></i> Doctors</NavLink></li>
            <li><NavLink to="#" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')} onClick={() => setActiveComponent('appointments')}><i class="fa fa-calendar" aria-hidden="true"></i> Appointment History</NavLink></li>
            <li><NavLink to="#" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')} onClick={() => setActiveComponent('tasks')}><i class="fas fa-tasks"></i> Tasks</NavLink></li>

            <li className="sidebar-section-title">Other Menu</li>
            <li><NavLink to="#" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')} onClick={() => setActiveComponent('schedules')}><i className="fas fa-clock"></i> Schedules</NavLink></li>
            <li><NavLink to="#" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')} onClick={() => setActiveComponent('payments')}><i className="fas fa-credit-card"></i> Payment</NavLink></li>
            <li><NavLink to="#" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')} onClick={() => setActiveComponent('products')}><i className="fas fa-box"></i> Product & Stock</NavLink></li>

            <li className="sidebar-section-title">Help & Settings</li>
            <li><NavLink to="#" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')} onClick={() => setActiveComponent('report')}><i className="fas fa-chart-line"></i> Report</NavLink></li>
            <li><NavLink to="#" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')} onClick={() => setActiveComponent('help')}><i className="fas fa-question-circle"></i> Help</NavLink></li>
            <li><NavLink to="#" className={({ isActive }) => (isActive ? 'active-link' : 'inactive-link')} onClick={() => setActiveComponent('settings')}><i className="fas fa-cog"></i> Settings</NavLink></li>
          </ul>
        </div>

        {/* Main Component Area */}
        <div className="overview-section d-flex flex-column" style={{ paddingRight: "80px" }}>
          <div className='bg-light'>{activeComponent === 'default' && renderDefaultCards()}</div>
          <div className='container'>
            {activeComponent === 'overview' && renderDefaultCards()}
          </div>
          <div className='container'>
            {activeComponent === 'appointments' && <AllAppointments
              appointments={appointments}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              filterPatientName={filterPatientName}
              setFilterPatientName={setFilterPatientName}
              filterDoctorName={filterDoctorName}
              setFilterDoctorName={setFilterDoctorName}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />}
          </div>
          <div className='container' style={{ width: "70%" }}>
            {activeComponent === 'tasks' && <Tasks tasks={tasks} confirmAppointment={confirmAppointment} />}
          </div>
          <div className='container'>
            {
              activeComponent === 'doctors' &&
              (
                <div className='row'>
                  <div className='col col-6'>
                    <AllDoctors doctors={doctors} error={error} loading={loading} handleAddDoctorClick={handleAddDoctorClick} onAddDoctorSuccess={handleAddDoctorSuccess} />
                  </div>
                  <div className='col col-6 mt-4'>
                    <AddDoctor onAddSuccess={handleAddDoctorSuccess}></AddDoctor>
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

const AddDoctor = ({ onAddSuccess }) => {
  const [doctorName, setDoctorName] = useState('');
  const [email, setEmail] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [contact, setContact] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const hospitalId = JSON.parse(localStorage.getItem('receptionistInfo'))?.hospitalId;

    const formData = new FormData();
    formData.append('Doctorname', doctorName);
    formData.append('email', email);
    formData.append('specialization', specialization);
    formData.append('contact', contact);
    formData.append('isAvailable', isAvailable);
    formData.append('consultationFee', consultationFee);
    formData.append('hospitalId', hospitalId);
    if (file) formData.append('file', file);

    try {
      const token = localStorage.getItem('recAuthToken');
      await axios.post('https://localhost:44376/api/Doctor/Add/Doctors', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onAddSuccess(); // Trigger re-fetch or state update
      alert('Doctor added successfully!');
    } catch (error) {
      setError('Error adding doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-doctor-form">
      <h2>Add New Doctor</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Doctor Name:</label><span className="text-danger">*</span>
          <input type="text" className="form-control" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email:</label><span className="text-danger">*</span>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Specialization:</label><span className="text-danger">*</span>
          <input type="text" className="form-control" value={specialization} onChange={(e) => setSpecialization(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Contact:</label><span className="text-danger">*</span>
          <input type="text" className="form-control" value={contact} onChange={(e) => setContact(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Consultation Fee:</label><span className="text-danger">*</span>
          <input type="number" className="form-control" value={consultationFee} onChange={(e) => setConsultationFee(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Upload Image:</label><span className="text-danger">*</span>
          <input type="file" className="form-control" onChange={(e) => setFile(e.target.files[0])} />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Doctor'}
        </button>

      </form>

    </div>
  );
};





export default Receptionist;