// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');

const {
  registerStudent,
  registerWarden,
  loginUser,
  getMe,
  sendOtp,
  verifyOtp
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// use memory storage for buffers (to stream to Cloudinary)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
});

// Register
// Student: one image -> profileImage
router.post('/register/student', upload.single('profileImage'), registerStudent);

// Warden: two images -> profileImage, wardenIdImage
router.post(
  '/register/warden',
  upload.fields([
    { name: 'profileImage', maxCount: 1 },
    { name: 'wardenIdImage', maxCount: 1 },
  ]),
  registerWarden
);

// Login
router.post('/login', loginUser);

// Self user profile
router.get('/me', protect, getMe);

// OTP routes
router.post('/sendOtp', sendOtp);
router.post('/verifyOtp', verifyOtp);

module.exports = router;
