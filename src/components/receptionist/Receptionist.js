import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../receptionist/receptionist.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate, Link, NavLink } from 'react-router-dom';
import logo from "../Assests/newlogo.png";
import AllAppointments from './AllAppointments';
import Tasks from './Tasks';
import AllDoctors from './AllDoctors';
//import ApntsLogo from '../Assests/upcommingApnts.jpg';
import ApntsLogo from '../Assests/istockphoto.jpg';
// import bargraph from '../Assests/barimage.jpg';
//import bargraph from '../Assests/barimage.png'
import bargraph from '../Assests/bar-chart empty.png'
const Receptionist = () => {
  const navigate = useNavigate();
  const isLoggedIn=localStorage.getItem('recAuthToken');
  if(isLoggedIn==null)
  {
    alert("Session timeout, Please login again.");
    navigate("/root/login");
  }
  const [activeComponent, setActiveComponent] = useState('default');
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
  const CalculateCompletedAppointments = () => {
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; 
    const currentTime = currentDate.getTime(); 
  
    const completedAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.appointmentDate);
      return (
        appointmentDate.toISOString().split('T')[0] === currentDateString &&
        appointmentDate.getTime() < currentTime && 
        appointment.statusId === 2 
      );
    });
  
    return completedAppointments.length; // Return the length of the filtered array
  };
  const UpcommingAppointments=()=>{
    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split('T')[0]; 
    const currentTime = currentDate.getTime(); 
    const upcommingAppointments=appointments.filter(appointment=>{
      const appointmentDate = new Date(appointment.appointmentDate);
      return (
        appointmentDate.toISOString().split('T')[0] === currentDateString &&
        appointmentDate.getTime() > currentTime && 
        appointment.statusId === 1 
      );
    })
    return upcommingAppointments;
  }
  const OverAllCompletedAppointments=()=>{  
    const completedAppointments = appointments.filter(appointment => appointment.statusId==2)
  
    return completedAppointments.length;
  }
  //overview
  const renderDefaultCards = () => (
    <div className='default-container'>

      <div className="default-cards d-flex justify-content-between">
        <div className="card-custom flex-fill mx-2" style={{ position: 'relative', overflow: 'hidden' }}>
          <i class="fa-solid fa-chart-simple image-top-right" style={{position: 'absolute',top: '40%',right: '10%', width: '80px',fontSize: '80px',height: 'auto',color: 'grey', }}></i>
          <div className="card-header-custom">
          <Link onClick={() => (setFilterStatus(2),setActiveComponent('appointments'))}><h5 className="card-title"><i className="fa fa-calendar" aria-hidden="true"></i> Appointments</h5></Link>
          </div>
          <div className="card-body-custom">
            {
              appointments?.length > 0 ?
                <p className="card-text"><b style={{ fontSize: '40px' }}>{OverAllCompletedAppointments()}</b><br /><b>Appointments Completed</b></p> :
                <p className="card-text" style={{paddingBottom:"60px"}}>You have 0 completed appointments</p>
            }
          </div>
        </div>

        <div className="card-custom flex-fill mx-2" style={{ position: 'relative', overflow: 'hidden' }}>
          <i class="fa-solid fa-chart-simple image-top-right" style={{position: 'absolute',top: '40%',right: '10%', width: '80px',fontSize: '80px',height: 'auto',color: 'grey', }}></i>
          <div className="card-header-custom">
            <Link onClick={() => setActiveComponent('tasks')} ><h5 className="card-title"><i class="fas fa-tasks"></i>  Tasks</h5></Link>
          </div>
          <div className="card-body-custom">
            {
              tasks?.length > 0 ?
                <p className="card-text"><b style={{ fontSize: '40px' }}>{tasks.length}</b><br /><b>Tasks</b></p> :
                <p className="card-text" style={{paddingBottom:"60px"}}>You have no tasks to complete.</p>
            }
            
          </div>
        </div>
      </div>
      <div className="todayApp-card  mx-2">
          <div className="card-header-custom">
            <h5 className="custom-card-title"><i className="fa fa-calendar" aria-hidden="true"></i>   Today Appointments</h5>
          </div>
          <div className="card-body-custom todayApp-card-body">
              {
                CalculateCompletedAppointments()>0?
                (
                  <div>
                    <h5 className="">Attended Appointments</h5>
                    <p className='' style={{marginLeft:"15px"}}>{CalculateCompletedAppointments()} Patients attended</p>
                  </div>
                ):
                (
                  <div>
                    <h4 className="custom-card-text">Attended Appointments</h4>
                    <p className="custom-card-text" style={{marginLeft:"15px"}}>No one attended yet.</p>
                  </div>
                )
              }
              <hr width="100%;" color="white" size="5" noshade/>
              <h5 className=''>Upcomming Appointments <span style={{backgroundColor:"white",color:"black",paddingLeft:"5px",paddingRight:"5px",borderRadius:"25px",width:"50px"}}><strong>4</strong></span></h5>
              <div className='container upcomming-apnts-container d-flex justify-content-between' style={{marginTop:"20px"}}>
                <div>
                  <img className='ApntsLogo rounded w-75' src={ApntsLogo}/>
                </div>
                <div>
                  {/* {
                    UpcommingAppointments().length!=0?
                    (<ul className='no-bullets container'>
                      {
                        UpcommingAppointments().map(appointment=>
                          <li className='p-1'>
                            <div className='d-flex align-items-center bg-light text-black rounded p-1' style={{width:"300px"}}>
                              <div>
                              <i class="fa-solid fa-circle-user p-2" style={{ fontSize: '40px' }}></i>
                              </div>
                              <div>
                                <h6>{appointment.patientName}</h6>
                                <p>{appointment.reason}</p>
                              </div>
                            </div>
                          </li>
                        )
                      }
                    </ul>):
                    <p>No appointments today</p>
                  } */}
                  <ul className='no-bullets container'>
                    <li className='p-1'>
                      <div className='d-flex align-items-center bg-light text-black rounded p-1' style={{width:"300px"}}>
                        <div>
                        <i class="fa-solid fa-circle-user p-2" style={{ fontSize: '40px' }}></i>
                        </div>
                        <div>
                          <h6>Arjun A</h6>
                          <p>Fever</p>
                        </div>
                      </div>
                    </li>
                    <li className='p-1'>
                      <div className='d-flex align-items-center bg-light text-black rounded p-1' style={{width:"300px"}}>
                        <div>
                        <i class="fa-solid fa-circle-user p-2" style={{ fontSize: '40px' }}></i>
                        </div>
                        <div>
                          <h6>Praveen Palivela</h6>
                          <p>Monthly cunsultation</p>
                        </div>
                      </div>
                    </li>
                    <li className='p-1'>
                      <div className='d-flex align-items-center bg-light text-black rounded p-1' style={{width:"300px"}}>
                        <div>
                        <i class="fa-solid fa-circle-user p-2" style={{ fontSize: '40px' }}></i>
                        </div>
                        <div>
                          <h6>Shankar Girija</h6>
                          <p>Hair fall</p>
                        </div>
                      </div>
                    </li>
                    <li className='p-1'>
                      <div className='d-flex align-items-center bg-light text-black rounded p-1' style={{width:"300px"}}>
                        <div>
                        <i class="fa-solid fa-circle-user p-2" style={{ fontSize: '40px' }}></i>
                        </div>
                        <div>
                          <h6>Vikas Panduri</h6>
                          <p>Stomach pain</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
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
        
        <div className="overview-section d-flex flex-column" style={{paddingRight:"80px"}}>
          <div className='container'>
            {activeComponent === 'default' &&renderDefaultCards()}
          </div>
          <div  className='container'>
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
            {activeComponent === 'tasks' && <Tasks tasks={tasks} setTasks={setTasks} />}
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