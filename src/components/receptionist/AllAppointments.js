import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa';
import './allAppointments.css';
import axios from 'axios';

const AllAppointments = ({ 
  appointments, 
  filterDate, 
  setFilterDate, 
  filterPatientName, 
  setFilterPatientName, 
  filterDoctorName, 
  setFilterDoctorName, 
  filterStatus, 
  setFilterStatus 
}) => {
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showPatientNameFilter, setShowPatientNameFilter] = useState(false);
  const [showDoctorNameFilter, setShowDoctorNameFilter] = useState(false);

  useEffect(() => {
    const applyFilters = () => {
      let filteredData = appointments;

      if (filterDate) {
        filteredData = filteredData.filter(appointment =>
          new Date(appointment.appointmentDate).toLocaleDateString() === new Date(filterDate).toLocaleDateString()
        );
      }

      if (filterPatientName) {
        filteredData = filteredData.filter(appointment =>
          appointment.patientName.toLowerCase().includes(filterPatientName.toLowerCase())
        );
      }

      if (filterDoctorName) {
        filteredData = filteredData.filter(appointment =>
          appointment.doctorName.toLowerCase().includes(filterDoctorName.toLowerCase())
        );
      }

      if (filterStatus !== '') {
        filteredData = filteredData.filter(appointment =>
          appointment.statusId === parseInt(filterStatus)
        );
      }

      setFilteredAppointments(filteredData);
    };

    applyFilters();
  }, [appointments, filterDate, filterPatientName, filterDoctorName, filterStatus]);

  const resetFilters = () => {
    setFilterDate('');
    setFilterPatientName('');
    setFilterDoctorName('');
    setFilterStatus('');
    setShowDateFilter(false);
    setShowPatientNameFilter(false);
    setShowDoctorNameFilter(false);
  };

  const getStatusText = (appointment) => {
    const currentDate = new Date();

    if (new Date(appointment.appointmentDate) < currentDate && appointment.appointmentId !== 2) {
      const token = localStorage.getItem('recAuthToken');
      axios.put(`https://localhost:44376/api/Appointment/UpdateStatus/${appointment.appointmentId}?statusId=${2}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return 'Completed';
    }

    switch (appointment.statusId) {
      case 1: return 'Booked';
      case 0: return 'Cancelled';
      case -1: return 'Pending';
      case 2: return 'Completed';
      default: return 'Unknown';
    }
  };

  const getStatusClasses = (appointment) => {
    const currentDate = new Date();

    if (new Date(appointment.appointmentDate) < currentDate) {
      return { bg: 'bg-info' };
    }

    switch (appointment.statusId) {
      case 1: return { bg: 'bg-success' }; // Booked
      case 0: return { bg: 'bg-danger' }; // Cancelled
      case -1: return { bg: 'bg-warning' }; // Pending
      case 2: return { bg: 'bg-secondary' }; // Completed
      default: return { bg: 'bg-light' }; // Unknown status
    }
  };

  return (
    <div className='container'>
      <div className='d-flex justify-content-between align-items-center'>
        <h2 className="appointments-header">Appointments</h2>
        <button className="reset-filter-btn" onClick={resetFilters}>
          <i className="fa-light fa-filter-circle-xmark"></i> Reset Filter
        </button>
      </div>

      {filteredAppointments.length === 0 ? (
        <p className="no-appointments-text">No appointments available.</p>
      ) : (
        <div className='all-apnmt-table-container'>
          <table className="appointments-table all-apnmt-table table">
          <thead className='apnmt-table-head'>
            <tr>
              <th className="appointments-table-header">
                Date
                <FaFilter className="filter-icon" onClick={() => setShowDateFilter(!showDateFilter)} />
                <input
                  type="date"
                  className={`filter-input ${showDateFilter ? 'active' : ''}`}
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </th>
              <th className="appointments-table-header">Time</th>
              <th className="appointments-table-header">
                Patient Name
                <FaFilter className="filter-icon" onClick={() => setShowPatientNameFilter(!showPatientNameFilter)} />
                <input
                  type="text"
                  placeholder="Filter by Patient Name"
                  className={`filter-input ${showPatientNameFilter ? 'active' : ''}`}
                  value={filterPatientName}
                  onChange={(e) => setFilterPatientName(e.target.value)}
                />
              </th>
              <th className="appointments-table-header">
                Assigned Doctor
                <FaFilter className="filter-icon" onClick={() => setShowDoctorNameFilter(!showDoctorNameFilter)} />
                <input
                  type="text"
                  placeholder="Filter by Doctor Name"
                  className={`filter-input ${showDoctorNameFilter ? 'active' : ''}`}
                  value={filterDoctorName}
                  onChange={(e) => setFilterDoctorName(e.target.value)}
                />
              </th>
              <th className="appointments-table-header">
                Status
                <select
                  className="filter-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="-1">Pending</option>
                  <option value="0">Cancelled</option>
                  <option value="1">Booked</option>
                  <option value="2">Completed</option>
                </select>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.appointmentId}>
                <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                <td>{new Date(appointment.appointmentDate).toLocaleTimeString()}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctorName}</td>
                <td>
                  <span className={`badge ${getStatusClasses(appointment).bg} text-white status-badge`}>
                    {getStatusText(appointment)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default AllAppointments;
