import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';



import byteRoutes from './routes/byteRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import userRoutes from './routes/userRoutes.js';

import memberDashboardRoutes from './routes/dashboard/memberDashboardRoutes.js';
import adminDashboardRoutes from './routes/dashboard/adminDashboardRoutes.js';

import authRoutes from './routes/auth/authRoutes.js';
import adminAuthRoutes from "./routes/auth/adminAuthRoutes.js";




import byteAttendanceRoutes from "./routes/attendance/byteAttendanceRoutes.js";
import eventAttendanceRoutes from "./routes/attendance/eventAttendanceRoutes.js";


dotenv.config();

const app = express();

app.use(
    cors({
      origin: ["http://localhost:5173",
      "http://localhost:5174"],
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use('/api/byte', byteRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);



app.use('/api/admin',adminAuthRoutes);
app.use('/api/byte-attendace', byteAttendanceRoutes);
app.use('/api/events', eventAttendanceRoutes);
app.use('/api/dashboard',adminDashboardRoutes);
app.use('/api',memberDashboardRoutes);


// for health monitoring
app.get('/api/health', (req, res) => {
  res.status(200).send('OK');
});


export default app;
