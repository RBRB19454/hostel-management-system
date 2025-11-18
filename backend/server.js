const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ---------------------- OTP SETUP ----------------------
const otpStore = {}; // Temporary in-memory storage (email -> otp)

// Configure Nodemailer Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Send OTP Route
app.post('/api/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore[email] = otp;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Hostel Management System - Email Verification OTP',
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>Valid for 5 minutes</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ OTP sent to ${email}: ${otp}`);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Error sending OTP' });
    }
});

// Verify OTP Route *** UPDATED ***
app.post('/api/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ success: false, message: 'Email and OTP are required' });
    }

    if (otpStore[email] && otpStore[email] === otp) {
        delete otpStore[email];

        // ✅ send final registration successful email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Registration Completed - Hostel Management System',
            html: `
              <h2>Registration Successfully Verified</h2>
              <p>Your registration email has been verified.</p>
              <p>You can now login once your account gets admin approval.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: 'OTP verified & success email sent' });

    } else {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
});
// ---------------------- END OTP SETUP ----------------------

// Default API Routes
app.get('/api', (req, res) => {
    res.send('Hostel Management API is running...');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/wardens', require('./routes/wardenRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/clearance', require('./routes/clearanceRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`🚀 Backend server started on port ${PORT}`));
