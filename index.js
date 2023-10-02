const express = require('express');
const app = express();
app.use(express.json());

// Sample data to simulate doctors and appointments
const doctors = [
  {
    id: 1,
    name: 'Dr. Smith',
    maxPatients: 10,
    schedule: ['Monday', 'Wednesday', 'Friday'], // Evening schedule
  },
  {
    id: 2,
    name: 'Dr. Johnson',
    maxPatients: 12,
    schedule: ['Tuesday', 'Thursday'], // Evening schedule
  },
];

const appointments = [];

// Endpoint to list all doctors
app.get('/doctors', (req, res) => {
  res.json(doctors);
});

// Endpoint to get details of a specific doctor
app.get('/doctors/:id', (req, res) => {
  const doctorId = parseInt(req.params.id);
  const doctor = doctors.find((d) => d.id === doctorId);
  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }
  res.json(doctor);
});

// Endpoint to book an appointment with a doctor
app.post('/appointments', (req, res) => {
  const { doctorId, patientName } = req.body;
  const doctor = doctors.find((d) => d.id === doctorId);

  if (!doctor) {
    return res.status(400).json({ message: 'Doctor not found' });
  }

  const today = new Date();
  const dayOfWeek = today.getDay();
  if (dayOfWeek === 0) {
    return res.status(400).json({ message: 'Doctors do not work on Sundays' });
  }

  const currentDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
  if (doctor.schedule.includes(currentDay)) {
    const doctorAppointments = appointments.filter((a) => a.doctorId === doctorId);
    if (doctorAppointments.length < doctor.maxPatients) {
      const appointment = {
        doctorId: doctor.id,
        patientName,
        appointmentDate: today,
      };
      appointments.push(appointment);
      return res.json(appointment);
    } else {
      return res.status(400).json({ message: 'Doctor is fully booked for the day' });
    }
  } else {
    return res.status(400).json({ message: 'Doctor does not work on this day' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
