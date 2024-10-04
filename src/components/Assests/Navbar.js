import React, { useState, useEffect, useRef } from 'react';
import logo from "./newlogo.png";
import { Modal, Button } from 'react-bootstrap';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import Login from '../login/Login';
import RegisterPatient from '../register patient/RegisterPatient';
import { useNotification } from '../Notifications/NotificationContext';
import serviceImg from "./doctor-consultation.jpg";
import vs from "./vs.webp";
import AddDevice from '../vitalsigns/AddDevice';
function Navbar() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const { notificationCount } = useNotification();
  const [deviceAdded, setDeviceAdded] = useState(false);
  const [showAddDeviceModal, setShowAddDeviceModal] = useState(false);
  const handleShowAddDevice = () => setShowAddDeviceModal(true);
  const handleCloseAddDevice = () => setShowAddDeviceModal(false);
  const handleCloseLogin = () => setShowLoginModal(false);
  const handleShowLogin = () => setShowLoginModal(true);
  const handleCloseRegister = () => setShowRegisterModal(false);
  const handleShowRegister = () => setShowRegisterModal(true);
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('patientInfo');
    localStorage.removeItem("vitalsigns");
    setSidebarOpen(false);
    navigate('/root');
  };
  const vitals =localStorage.getItem("vitalsigns")!=null? JSON.parse(localStorage.getItem("vitalsigns")):null;
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  
  const patientInfo = JSON.parse(localStorage.getItem('patientInfo')) || null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

  const getInitials = (name) => {
    return `${name.split(' ')[0]}`;
  };

  const profileStyle = {
    display: "flex",
    height: "45px",
    width: "45px",
    borderRadius: "100px",
    color: "white",
    background: patientInfo ? generateBackground(patientInfo.patientName) : '#ccc',
    margin: "auto",
  };

  function generateBackground(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i += 1) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  }
  const onDeviceAdded = () => {
    setDeviceAdded(true);
    handleCloseAddDevice();
  };
  return (
    <header className='navbar-header'>
      <nav className="navbar navbar-expand-lg custom-navbar fixed-top">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex ">
            <Link to="/root">
              <img src={logo} className="custom-logo" alt="Logo" />
            </Link>
            <span className="custom-title-logo fw-bold">PMS</span>
          </div>

          <div className="navbar-links d-flex align-items-stretch mt-3">
            <div className="services-container">
              <Link className="nav-link services">Our Services</Link>
              <div className='subnav-content'>
                <div className='container cards-container'>
                    <Link style={{textDecoration:"none"}}>
                      <div className="card p-2 d-flex justify-content-center" style={{ width: "60%", height: "25%" }}>
                        <div className="card-body">
                          <p className="card-text fw-bold text-center" >Doctor Consultation</p>
                        </div>
                        <img src={serviceImg} style={{borderRadius:"9px",height:"200px"}} className="card-img-bottom" alt="..." />
                      </div>
                    </Link>
                  <Link style={{textDecoration:"none"}}>
                    <div className="card p-2 d-flex justify-content-center" style={{ width: "60%", height: "25%" }}>
                      <div className="card-body">
                        <p className="card-text fw-bold text-center" >Monitor Vitalsigns</p>
                      </div>
                      <img src={vs} style={{borderRadius:"9px",height:"200px"}} className="card-img-bottom" alt="..." />
                    </div>
                  </Link>
                </div>
              </div>
            </div>
            <Link to="appointments" className="nav-link">About Us</Link>
            <Link to="appointments" className="nav-link">More</Link>
          </div>
          {localStorage.getItem("authToken") != null?(
              <div className='dropdown' >
                <span className='dropbtn' style={{ margin: 'auto', cursor: "pointer", fontSize: "20px" }}><i class="fa-solid fa-user" ></i> Hi,{getInitials(patientInfo.patientName)}</span>
                <div className='dropdown-content'>
                  <Link to='/root/hospitals'>Consult a Doctor</Link>
                  <Link to='appointments'>My Appointments</Link>
                  {vitals!=null ? (
                      <Link to="/root/vitalsigns" state={vitals} >Vital Signs</Link> // Show Vital Signs if device added
                    ) : (
                      <Link onClick={handleShowAddDevice}>Add Device</Link>// Show Add Device otherwise
                  )}
                  <Link  onClick={handleLogout}>LogOut</Link>
                </div>
              </div>):
              (
                <Button variant="light" className='custom-login-button fw-bold' onClick={handleShowLogin}>Login/Signup</Button>
              )
            }
        </div>
      </nav>
      <AddDevice onClose={handleCloseAddDevice} show={showAddDeviceModal} onDeviceAdded={onDeviceAdded}/>
      {/* Sidebar */}
      <div className={`sidebar${sidebarOpen ? ' open' : ''}`} ref={sidebarRef}>
        <button className="close-btn" onClick={toggleSidebar}>×</button>
        <div className="sidebar-header">
          <FontAwesomeIcon icon={faUser} size="4x" style={{ cursor: "pointer" }} />
          {patientInfo ? (
            <div>
              <h5>{patientInfo.patientName}</h5>
              <p>{patientInfo.patientEmail}</p>
            </div>
          ) : (
            <div>
              <h5>No patient info available</h5>
              <p>Please log in</p>
            </div>
          )}
        </div>
        <ul className="sidebar-nav mt-5">
          <li><Link to="/root/vitalsignstable">Vital Signs</Link></li>
          <li><Link onClick={handleLogout}>Logout</Link></li>
        </ul>
      </div>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={handleCloseLogin}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Login onClose={handleCloseLogin} />
          <div className="text-center mt-3">
            <span>Not registered yet? </span>
            <Button variant="link" onClick={() => {
              handleCloseLogin();
              handleShowRegister();
            }}>
              Register here
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Register Modal */}
      <Modal size="lg" show={showRegisterModal} onHide={handleCloseRegister}>
        <Modal.Header closeButton>
          <Modal.Title>Register</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RegisterPatient onClose={handleCloseRegister} />
          <div className="text-center mt-3">
            <span>Already have an account? </span>
            <Button variant="link" onClick={() => {
              handleCloseRegister();
              handleShowLogin();
            }}>
              Login here
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </header>
  );
}

export default Navbar;
