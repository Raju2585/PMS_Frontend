import React, { useState, useEffect } from 'react';
import { FaFilter } from 'react-icons/fa'; // Import FontAwesome filter icon
import "./allAppointments.css";

const AllAppointments = ({ appointments }) => {
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const [filterDate, setFilterDate] = useState('');
  const [filterPatientName, setFilterPatientName] = useState('');
  const [filterDoctorName, setFilterDoctorName] = useState('');

  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showPatientNameFilter, setShowPatientNameFilter] = useState(false);
  const [showDoctorNameFilter, setShowDoctorNameFilter] = useState(false);

  // Effect to handle filtering
  useEffect(() => {
    const applyFilters = () => {
      let filteredData = appointments;

      // Date filter
      if (filterDate) {
        filteredData = filteredData.filter(appointment =>
          new Date(appointment.appointmentDate).toLocaleDateString() === new Date(filterDate).toLocaleDateString()
        );
      }

      // Patient Name filter
      if (filterPatientName) {
        filteredData = filteredData.filter(appointment =>
          appointment.patientName.toLowerCase().includes(filterPatientName.toLowerCase())
        );
      }

      // Doctor Name filter
      if (filterDoctorName) {
        filteredData = filteredData.filter(appointment =>
          appointment.doctorName.toLowerCase().includes(filterDoctorName.toLowerCase())
        );
      }

      setFilteredAppointments(filteredData);
    };

    applyFilters();
  }, [appointments, filterDate, filterPatientName, filterDoctorName]); // Depend on both the filters and appointments

  // Reset filters
  const resetFilters = () => {
    setFilterDate('');
    setFilterPatientName('');
    setFilterDoctorName('');
    setShowDateFilter(false);
    setShowPatientNameFilter(false);
    setShowDoctorNameFilter(false);
  };

  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h2 className="appointments-header">Appointments</h2>
        <button className="reset-filter-btn" onClick={resetFilters}>Reset Filter</button>
      </div>

      {/* Table for Appointments */}
      {filteredAppointments.length === 0 ? (
        <p className="no-appointments-text">No appointments available.</p>
      ) : (
        <table className="appointments-table">
          <thead>
            <tr>
              {/* Date column with filter icon and input field */}
              <th className="appointments-table-header">
                Date
                <FaFilter
                  className="filter-icon"
                  onClick={() => setShowDateFilter(!showDateFilter)} // Toggle filter input
                />
                <input
                  type="date"
                  className={`filter-input ${showDateFilter ? 'active' : ''}`} // Apply 'active' class
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)} // Handle date selection
                />
              </th>

              <th className="appointments-table-header">Time</th>

              {/* Patient Name column with filter icon and input field */}
              <th className="appointments-table-header">
                Patient Name
                <FaFilter
                  className="filter-icon"
                  onClick={() => setShowPatientNameFilter(!showPatientNameFilter)} // Toggle filter input
                />
                <input
                  type="text"
                  placeholder="Filter by Patient Name"
                  className={`filter-input ${showPatientNameFilter ? 'active' : ''}`} // Apply 'active' class
                  value={filterPatientName}
                  onChange={(e) => setFilterPatientName(e.target.value)}
                />
              </th>

              {/* Doctor Name column with filter icon and input field */}
              <th className="appointments-table-header">
                Assigned Doctor
                <FaFilter
                  className="filter-icon"
                  onClick={() => setShowDoctorNameFilter(!showDoctorNameFilter)} // Toggle filter input
                />
                <input
                  type="text"
                  placeholder="Filter by Doctor Name"
                  className={`filter-input ${showDoctorNameFilter ? 'active' : ''}`} // Apply 'active' class
                  value={filterDoctorName}
                  onChange={(e) => setFilterDoctorName(e.target.value)}
                />
              </th>

              <th className="appointments-table-header">Status</th>
              <th className="appointments-table-header">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((appointment) => (
              <tr key={appointment.appointmentId}>
                <td>{new Date(appointment.appointmentDate).toLocaleDateString()}</td>
                <td>{new Date(appointment.appointmentDate).toLocaleTimeString()}</td>
                <td>{appointment.patientName}</td>
                <td>{appointment.doctorName}</td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllAppointments;
