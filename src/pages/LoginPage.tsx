// src/pages/LoginPage.tsx
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UserRole } from '../types';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    if (authContext) {
      try {
        const { user } = await authContext.login(email, password);

        if (user) {
          if (user.accountStatus === 'pending') {
            setError('Your account is pending approval. Please wait for activation.');
            authContext.logout();
          } else if (user.accountStatus === 'disabled') {
            setError('Your account has been disabled. Please contact an administrator.');
            authContext.logout();
          } else if (user.accountStatus === 'approved') {
            switch (user.role) {
              case UserRole.Admin:
                navigate('/admin');
                break;
              case UserRole.Warden:
                navigate('/warden');
                break;
              case UserRole.Student:
                navigate('/student');
                break;
              default:
                navigate('/');
            }
          } else {
            setError('Invalid account status.');
            authContext.logout();
          }
        }
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          'Invalid credentials. Please try again.';
        setError(msg);
      }
    }
  };

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

      <div className="relative w-full max-w-md p-8 space-y-8 rounded-2xl shadow-lg bg-white/20 backdrop-blur-md border border-white/30">

        <div className="text-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/Rajarata_logo.png/250px-Rajarata_logo.png"
            alt="Rajarata University Logo"
            className="w-24 h-24 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-white">Hostel Management System</h2>
          <p className="mt-2 text-sm text-gray-200">Faculty of Technology</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-white/40 rounded-none appearance-none rounded-t-md bg-white/80 focus:outline-none focus:ring-[#14654d] focus:border-[#14654d] focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-white/40 rounded-none appearance-none rounded-b-md bg-white/80 focus:outline-none focus:ring-[#14654d] focus:border-[#14654d] focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && <p className="text-sm text-center text-red-400">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={authContext?.loading}
              className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-[#2463A8] border border-transparent rounded-md group hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#14654d] disabled:bg-[#14654d]/50"
            >
              {authContext?.loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="text-sm text-center text-gray-200">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-[#14B8A6] underline">
              Register here
            </Link>
          </p>
          <p className="mt-2">
            <Link to="/welcome" className="font-medium text-[#14B8A6] underline">
              &larr; Back to Welcome
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
