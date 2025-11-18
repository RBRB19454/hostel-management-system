// controllers/AuthController.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const nodemailer = require('nodemailer');
const streamifier = require('streamifier');
const cloudinary = require('../utils/cloudinary'); // <— NEW

// ================= OTP & Email helpers =================

// { [email]: { code: '123456', expiresAt: 1731222222222 } }
let otpStore = {};

// one reusable transporter for OTP/registration emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// minimal HTML templates (kept from your previous setup)
const baseEmailTemplate = ({ title, heading, bodyHtml, footerHtml }) => `
<!doctype html>
<html><head><meta charset="utf-8"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f6f9fc;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f9fc;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);">
        <tr><td style="padding:24px 24px 12px 24px; background:#14654d; color:#ffffff;">
          <h1 style="margin:0;font-size:20px;letter-spacing:0.3px;">${heading}</h1>
        </td></tr>
        <tr><td style="padding:24px;">${bodyHtml}</td></tr>
        <tr><td style="padding:16px 24px;color:#6b7280;font-size:12px;border-top:1px solid #eee;">
          ${footerHtml || 'This is an automated message. Please do not reply.'}
        </td></tr>
      </table>
      <div style="color:#9ca3af;font-size:11px;margin-top:12px;">Rajarata Hostel System</div>
    </td></tr>
  </table>
</body></html>`;

const otpEmailHtml = (otp, minutes, name) =>
  baseEmailTemplate({
    title: 'Your OTP Code',
    heading: 'Verify Your Email',
    bodyHtml: `
      <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
        ${name ? `Hi ${name},` : 'Hello,'}
      </p>
      <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
        Use the code below to complete your registration:
      </p>
      <div style="margin:16px 0;padding:12px 16px;border:1px dashed #14654d;border-radius:8px;display:inline-block;">
        <div style="font-size:24px;letter-spacing:6px;font-weight:700;color:#111827;">${otp}</div>
      </div>
      <p style="margin:12px 0 0 0;font-size:13px;color:#374151;">
        This code will expire in <strong>${minutes} minutes</strong>.
      </p>
    `,
    footerHtml: `If you didn’t request this, you can safely ignore this email.`
  });

const registrationSuccessHtml = (name) =>
  baseEmailTemplate({
    title: 'Registration Successful',
    heading: 'Registration Successful 🎉',
    bodyHtml: `
      <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
        ${name ? `Hi ${name},` : 'Hello,'}
      </p>
      <p style="margin:0 0 12px 0;font-size:14px;color:#111827;">
        Your registration has been completed successfully and is now <strong>pending approval</strong>.
      </p>
      <p style="margin:0;font-size:13px;color:#374151;">
        We will notify you once your account is approved.
      </p>
    `
  });

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// optional cleanup of expired OTPs
setInterval(() => {
  const now = Date.now();
  for (const [email, entry] of Object.entries(otpStore)) {
    if (now > entry.expiresAt) delete otpStore[email];
  }
}, 60 * 1000);

// ============= OTP SEND =============
const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes
  otpStore[email] = { code: otp, expiresAt };

  let name = '';
  try {
    const existing = await User.findOne({ email });
    if (existing) name = existing.name || '';
  } catch (_) {}

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      html: otpEmailHtml(otp, 2, name)
    });
    return res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ============= OTP VERIFY =============
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email & OTP required" });

  const entry = otpStore[email];
  if (!entry) {
    return res.status(400).json({ success: false, message: "OTP not found. Please request a new code." });
  }
  if (Date.now() > entry.expiresAt) {
    delete otpStore[email];
    return res.status(400).json({ success: false, message: "OTP expired. Please request a new code." });
  }
  if (entry.code !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  delete otpStore[email];

  let name = '';
  try {
    const u = await User.findOne({ email });
    if (u) name = u.name || '';
  } catch (_) {}

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Registration Successful',
      html: registrationSuccessHtml(name)
    });
  } catch (e) {
    console.error('Post-verify success email failed:', e?.message);
  }

  return res.json({ success: true });
};

// ================= Cloudinary helper (buffer -> url) =================
const uploadBufferToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ================= Registration (with Cloudinary uploads) =================

// @desc Register a new student
// expects multipart/form-data with optional file: profileImage
const registerStudent = async (req, res) => {
  const { name, email, phone, studentId, course, guardianContact, emergencyContact, password, gender } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User with this email already exists' });

    const studentIdExists = await User.findOne({ studentId });
    if (studentIdExists) return res.status(400).json({ message: 'User with this Student ID already exists' });

    // handle image upload (if provided)
    let profileImageUrl = null;
    if (req.file && req.file.buffer) {
      profileImageUrl = await uploadBufferToCloudinary(req.file.buffer, 'student_profiles'); // folder A
    }

    const user = await User.create({
      name,
      email,
      phone,
      gender,
      studentId,
      course,
      guardianContact,
      emergencyContact,
      password,
      role: 'student',
      accountStatus: 'pending',
      ...(profileImageUrl ? { profileImage: profileImageUrl } : {})
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during student registration' });
  }
};

// @desc Register a new warden
// expects multipart/form-data with files: profileImage, wardenIdImage
const registerWarden = async (req, res) => {
  const { name, email, phone, wardenId, username, password, gender } = req.body;

  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) return res.status(400).json({ message: 'User with this email or username already exists' });

    let profileImageUrl = null;
    let wardenIdImageUrl = null;

    const files = req.files || {};
    if (files.profileImage && files.profileImage[0]?.buffer) {
      profileImageUrl = await uploadBufferToCloudinary(files.profileImage[0].buffer, 'warden_profiles'); // folder A
    }
    if (files.wardenIdImage && files.wardenIdImage[0]?.buffer) {
      wardenIdImageUrl = await uploadBufferToCloudinary(files.wardenIdImage[0].buffer, 'warden_profiles'); // folder A
    }

    const user = await User.create({
      name,
      email,
      phone,
      gender,
      wardenId,
      username,
      password,
      role: 'warden',
      accountStatus: 'pending',
      ...(profileImageUrl ? { profileImage: profileImageUrl } : {}),
      ...(wardenIdImageUrl ? { wardenIdImage: wardenIdImageUrl } : {})
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during warden registration' });
  }
};

// ================= Login & Me =================

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ $or: [{ email }, { username: email }] });
    if (user && (await user.matchPassword(password))) {
      if (user.accountStatus === 'pending')  return res.status(401).json({ message: 'Your account is pending approval.' });
      if (user.accountStatus === 'disabled') return res.status(401).json({ message: 'Your account has been disabled.' });
      if (user.accountStatus === 'rejected') return res.status(401).json({ message: 'Your registration was rejected.' });

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          accountStatus: user.accountStatus,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

const getMe = async (req, res) => {
  const user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    accountStatus: req.user.accountStatus,
  };
  res.status(200).json(user);
};

module.exports = {
  registerStudent,
  registerWarden,
  loginUser,
  getMe,
  sendOtp,
  verifyOtp
};
