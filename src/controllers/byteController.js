import ByteRegistration from '../models/ByteRegistration.js';
import User from '../models/User.js';



export const getParticipantsByDomain = async (req, res) => {
  const { domain } = req.query;

  try {
   
    const participants = await ByteRegistration.find({ domain })
      .populate("user", "name email");

    if (!participants.length) {
      return res.status(404).json({ message: "No participants found for this domain" });
    }

    res.status(200).json(participants);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};





export const registerForByteClass = async (req, res) => {
    const { domain } = req.body;  // Only domain is needed for registration
  
    try {
      const user = await User.findById(req.user._id);
  
      // Check if the user is already registered for the given domain
      const existingRegistration = await ByteRegistration.findOne({ user, domain });
      if (existingRegistration) {
        return res.status(400).json({ message: 'User is already registered for this class' });
      }
  
   
      const byteRegistration = new ByteRegistration({
        user: user,
        domain,
        attendance: []  
      });
  
      await byteRegistration.save();
      res.status(201).json({ message: 'User successfully registered for the BYTE class', byteRegistration });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  




export const markAttendance = async (req, res) => {
    const {userId, domain, date, attended } = req.body;
  
    try {

      const registration = await ByteRegistration.findOne({ user: userId, domain });
  
      if (!registration) {
        return res.status(404).json({ message: "Registration not found for this user and class" });
      }
  
      const attendanceDate = new Date(date);
      const existing = registration.attendance.find(
        (record) => record.date.toISOString().slice(0, 10) === attendanceDate.toISOString().slice(0, 10)
      );
  
      if (existing) {
        existing.attended = attended;  
      } else {
       
        registration.attendance.push({ date: attendanceDate, attended });
      }
  
      
      await registration.save();
      res.status(200).json({ message: "Attendance marked successfully" });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  

  export const getAttendanceByDate = async (req, res) => {
    const { domain, date } = req.query; 
    try {
      const attendanceDate = new Date(date); 
      
      const registrations = await ByteRegistration.find({
        domain: domain,
        'attendance.date': attendanceDate
      }).populate('user', 'name email');  
  
      if (!registrations.length) {
        return res.status(404).json({ message: "No attendance found for this domain on the specified date" });
      }
  
      // Filter attendance records by date and return those with their attendance status
      const filteredAttendance = registrations.map(registration => {
        const attendanceRecord = registration.attendance.find(
          record => record.date.toISOString().slice(0, 10) === attendanceDate.toISOString().slice(0, 10)
        );
        return {
          userId: registration.user._id,
          name: registration.user.name,
          attended: attendanceRecord ? attendanceRecord.attended : false
        };
      });
  
      res.status(200).json(filteredAttendance);
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  