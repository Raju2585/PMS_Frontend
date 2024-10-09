// Tasks Component
import '../receptionist/tasks.css'
const Tasks = ({tasks,confirmAppointment}) => {

 
    return (
      <div>
        <h2 className="text-center mb-4 fw-bold">Appointments</h2>
        <div className="row">
          {tasks.length === 0 ? (
            <p className="text-center">No appointments available.</p>
          ) : (
            tasks.map((task) => (
              <div className="col-12 mb-3" key={task.appointmentId}>
                <div className="card-custom">
                  <div className="task-card-body d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="card-title">{task.patientName}</h5>
                      <p className="card-text">
                        <strong>Doctor:</strong> {task.doctorName} <br />
                        <strong>Problem:</strong> {task.reason} <br />
                        <strong>Gender:</strong> {task.gender} <br />
                        <strong>Email:</strong> {task.email} <br />
                        <strong>Appointment Time:</strong> {task.appointmentDate}
                      </p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => confirmAppointment(task.appointmentId)}
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