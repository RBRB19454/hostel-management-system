// src/pages/RegisterPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { apiRegisterStudent, apiRegisterWarden, apiSendOtp, apiVerifyOtp } from '../../services/api.ts';
import { UserRole } from '../types.ts';

const RegisterPage: React.FC = () => {
  const [role, setRole] = useState<UserRole>(UserRole.Student);
  const [formData, setFormData] = useState<any>({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [otpMode, setOtpMode] = useState(false);
  const [otp, setOtp] = useState('');

  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [emailValid, setEmailValid] = useState(true);

  // Timer + resend state
  const [timer, setTimer] = useState(120);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval: any;
    if (otpMode && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    if (timer === 0) setCanResend(true);
    return () => clearInterval(interval);
  }, [otpMode, timer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'password') validatePassword(e.target.value);
    if (e.target.name === 'email') validateEmail(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        alert('Only PDF, PNG, or JPEG files are allowed.');
        e.target.value = '';
        return;
      }
      setFormData({ ...formData, [e.target.name]: file });
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailValid(emailRegex.test(email));
  };

  const validatePassword = (password: string) => {
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?#&])[A-Za-z\d@$!%?#&]{8,}$/;
    if (strongRegex.test(password)) {
      setPasswordStrength('Strong password ✅');
    } else {
      setPasswordStrength('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (!emailValid) {
      setError('Please enter a valid email address.');
      setLoading(false);
      return;
    }

    try {
      if (role === UserRole.Student) {
        await apiRegisterStudent(formData);
      } else {
        await apiRegisterWarden(formData);
      }

      await apiSendOtp(formData.email);
      setOtpMode(true);
      setTimer(120);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (otpMode) {
    const handleVerifyOtp = async () => {
      setError('');
      try {
        const verify = await apiVerifyOtp(formData.email, otp);
        if (verify.success) {
          window.location.href = '/login';
        } else {
          setError('Invalid OTP');
        }
      } catch (e) {
        setError('OTP verification failed.');
      }
    };

    const handleResendOtp = async () => {
      setCanResend(false);
      setTimer(120);
      await apiSendOtp(formData.email);
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e5f3e1]">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Verify OTP</h2>
          <p className="text-gray-700 mb-4">
            OTP has been sent to <b>{formData.email}</b>
          </p>

          <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} className="input-field text-center" />

          <p className="text-sm text-gray-600 mt-2">
            OTP expires in: <b>{timer}s</b>
          </p>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button onClick={handleVerifyOtp} disabled={timer === 0} className="w-full mt-4 px-4 py-2 font-medium text-white bg-[#2463A8] rounded-md hover:bg-opacity-90 disabled:bg-gray-400">
            Verify OTP
          </button>

          {canResend && (
            <button onClick={handleResendOtp} className="w-full mt-3 px-4 py-2 font-medium text-[#ffffff] border border-[#2463A8] rounded-md hover:bg-[#14654d] hover:text-white">
              Resend OTP
            </button>
          )}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e5f3e1]">
        <div className="w-full max-w-md p-8 text-center bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
          <p className="mt-4 text-gray-600">
            Your account has been created. It is pending approval from a{' '}
            {role === UserRole.Student ? 'warden' : 'system administrator'}.
          </p>
          <Link to="/login" className="inline-block px-6 py-2 mt-6 text-sm font-medium text-white bg-[#2463A8] rounded-md hover:bg-opacity-90">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const commonFields = (
    <>
      <input name="name" type="text" required placeholder="Full Name" onChange={handleInputChange} className="input-field" />
      <input name="phone" type="tel" required placeholder="Phone Number" onChange={handleInputChange} className="input-field" />
      <select name="gender" required onChange={handleInputChange} className="input-field" defaultValue="">
        <option value="" disabled>Select your Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </>
  );

  const passwordFields = (
    <>
      <div className="relative">
        <input name="password" type={showPassword ? 'text' : 'password'} required placeholder="Password" onChange={handleInputChange} className="input-field pr-10" />
        <span className="absolute right-3 top-3 cursor-pointer text-gray-600" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </span>
      </div>
      {passwordStrength && (
        <p className={`text-xs ${passwordStrength.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{passwordStrength}</p>
      )}
      <input name="confirmPassword" type="password" required placeholder="Confirm Password" onChange={handleInputChange} className="input-field" />
    </>
  );

  const studentFields = (
    <>
      <input
        name="studentId"
        type="text"
        required
        placeholder="Registration No"
        onChange={handleInputChange}
        className="input-field"
      />
      
      <input
        name="email"
        type="email"
        required
        placeholder="Email Address"
        onChange={handleInputChange}
        className="input-field"
      />
      {!emailValid && <p className="text-red-500 text-xs">Please enter a valid email.</p>}

      {commonFields}
    

      <select
        name="course"
        required
        onChange={handleInputChange}
        className="input-field"
        defaultValue=""
      >
        <option value="" disabled>
          Select your Faculty
        </option>
        <option value="Faculty of Agriculture ">Faculty of Agriculture</option>
        <option value="Faculty of Applied Science">Faculty of Applied Science</option>
        <option value="Faculty of Management Studies ">Faculty of Management Studies</option>
        <option value="Faculty of Medicine and Allied Science ">Faculty of Medicine and Allied Science</option>
        <option value="Faculty of Social Sciences and Humanities ">Faculty of Social Sciences and Humanities</option>
        <option value="Faculty of Technology ">Faculty of Technology</option>
      </select>



      <input
        name="guardianContact"
        type="tel"
        required
        placeholder="Guardian Contact"
        onChange={handleInputChange}
        className="input-field"
      />
      <input
        name="emergencyContact"
        type="tel"
        required
        placeholder="Emergency Contact"
        onChange={handleInputChange}
        className="input-field"
      />
      {passwordFields}
      <div>
        <label className="font-bold text-sm text-white">Attach your Profile Photo (PDF/PNG/JPEG)</label>
        <input
          name="profileImage"
          type="file"
          required
          accept=".pdf,.png,.jpeg,.jpg"
          onChange={handleFileChange}
          className="input-field"
        />
        </div>
    </>
    
  );

  const wardenFields = (
    <>
      <input
        name="wardenId"
        type="text"
        required
        placeholder="Warden ID"
        onChange={handleInputChange}
        className="input-field"
      />

      <input
        name="email"
        type="email"
        required
        placeholder="Email Address"
        onChange={handleInputChange}
        className="input-field"
      />
      {!emailValid && <p className="text-red-500 text-xs">Please enter a valid email.</p>}
      
      <select
        name="hostel"
        required
        onChange={handleInputChange}
        className="input-field"
        defaultValue=""
      >
        <option value="" disabled>
          Select your Hostel
        </option>
        <option value="Sangamiththa ">Sangamiththa Girls Hostel</option>
        <option value="New Pandula ">New Pandula Boys Hostel</option>
        <option value="New Pandula">New Pandula Girls Hostel</option>
        <option value="Hemamali">Hemamali Girls Hostel</option>
        <option value="Somadevi "> Somadevi Girls Hostel</option>
        <option value="Dutugemunu ">Dutugemunu  Boys Hostel</option>
        <option value="Viharamahadevi  ">Viharamahadevi Girls Hostel</option>
        <option value="Gnanam ">Gnanam Girls Hostel</option>
        <option value="Anuladevi ">Anuladevi Girls Hostel</option>
      </select>


      {commonFields}
      <input
        name="username"
        type="text"
        required
        placeholder="Username"
        onChange={handleInputChange}
        className="input-field"
      />
      {passwordFields}
      <div>
        <label className="font-bold text-sm text-white">Attach your Warden ID image (PDF/PNG/JPEG)</label>
        <input
          name="wardenIdImage"
          type="file"
          required
          accept=".pdf,.png,.jpeg,.jpg"
          onChange={handleFileChange}
          className="input-field"
        />
      </div>
      <div>
        <label className="font-bold text-sm text-center text-white">Attach your Profile Photo (PDF/PNG/JPEG)</label>
        <input
          name="profileImage"
          required
          type="file"
          accept=".pdf,.png,.jpeg,.jpg"
          onChange={handleFileChange}
          className="input-field"
        />
      </div>
    </>
  );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4 relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1350&q=80')",
      }}
    >
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      <div className="relative w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg bg-white/20 backdrop-blur-md border border-white/30">
        <style>{`
          .input-field {
            width: 100%;
            padding: 10px 12px;
            border: 1px solid rgba(255,255,255,0.4);
            border-radius: 0.5rem;
            background-color: rgba(255, 255, 255, 0.85);
            color: #000;
            font-size: 14px;
          }
          .input-field::placeholder {
            color: #555;
          }
        `}</style>

        <div className="text-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/Rajarata_logo.png/250px-Rajarata_logo.png"
            alt="Rajarata University Logo"
            className="w-20 h-20 mx-auto mb-3"
          />
          <h2 className="text-2xl font-bold text-[white]">Create an Account</h2>
        </div>

        <div className="flex justify-center p-1 bg-white/20 rounded-md">
          <button
            type="button"
            onClick={() => setRole(UserRole.Student)}
            className={`w-1/2 px-4 py-2 text-sm font-bold rounded-md ${role === UserRole.Student ? 'bg-[#2463A8] shadow' : ''}`}
          >
            I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole(UserRole.Warden)}
            className={`w-1/2 px-4 py-2 text-sm font-bold rounded-md ${role === UserRole.Warden ? 'bg-[#2463A8] shadow' : ''}`}
          >
            I am a Warden
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {role === UserRole.Student ? studentFields : wardenFields}
          {error && <p className="text-sm text-center text-red-400">{error}</p>}
          <button type="submit" disabled={loading} className="w-full px-4 py-2 font-medium text-white bg-[#2463A8] rounded-md hover:bg-opacity-90 disabled:bg-[#14654d]/50">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="text-sm text-center text-gray-100">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-[#14B8A6] underline">
              Sign in
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/welcome" className="font-medium text-[#14B8A6] underline">
              ← Back to Welcome
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
