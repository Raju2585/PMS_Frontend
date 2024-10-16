// Tasks Component
import '../receptionist/tasks.css'
import axios from 'axios';
const Tasks = ({tasks,setTasks}) => {

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
    return (
      <div>
        <h2 className="text-center mb-4 fw-bold">Appointments</h2>
        <div className="row">
          {tasks.length === 0 ? (
            <p className="text-center">No appointments available.</p>
          ) : (
            tasks.map((task) => (
              <div className="col-12 mb-3" key={task.appointmentId}>
                <div className="task-card-custom">
                  <div className="task-card-body d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="card-title task-card-title">{task.patientName}</h5>
                      <p className="card-text task-card-text">
                        <strong>Doctor:</strong> {task.doctorName} <br />
                        <strong>Problem:</strong> {task.reason} <br />
                        <strong>Gender:</strong> {task.gender} <br />
                        <strong>Email:</strong> {task.email} <br />
                        <strong>Appointment Time:</strong> {task.appointmentDate}
                      </p>
                    </div>
                    <button
                      className="btn task-btn btn-primary"
                      onClick={async () =>await confirmAppointment(task.appointmentId)}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  export default Tasks;