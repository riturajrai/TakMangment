'use client';

import axios from 'axios';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function Signup() {
  const router = useRouter();
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    general: '',
  });
  const [loading, setLoading] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);

  useEffect(() => {
    if (showOTPForm) {
      otpInputRef.current?.focus();
    } else {
      emailInputRef.current?.focus();
    }
  }, [showOTPForm]);

  useEffect(() => {
    if (isSignedUp) {
      toast.success('Email verified successfully! Redirecting to login...', {
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      const timer = setTimeout(() => router.replace('/login'), 1500);
      return () => clearTimeout(timer);
    }
  }, [isSignedUp, router]);

  // Validation functions
  const isValidName = (name) => name.trim().length >= 2 && !name.includes(' ');
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(password);
  const passwordsMatch = (password, confirmPassword) => password === confirmPassword;
  const isValidOTP = (otp) => /^\d{6}$/.test(otp);

  const validateSignupForm = () => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '', otp: '', general: '' };
    let isValid = true;

    if (!isValidName(name)) {
      newErrors.name = 'Name must be at least 2 characters long and cannot contain spaces.';
      isValid = false;
    }
    if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }
    if (!isValidPassword(password)) {
      newErrors.password = 'Password must be at least 6 characters, including one uppercase letter, one lowercase letter, one number, and one special character.';
      isValid = false;
    }
    if (!passwordsMatch(password, confirmPassword)) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) {
      const firstError = Object.values(newErrors).find((error) => error);
      if (firstError) {
        toast.error(firstError, {
          icon: <AlertCircle className="h-3 w-3 text-red-500" />,
          style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
        });
      }
    }
    return isValid;
  };

  const validateOTPForm = () => {
    const newErrors = { name: '', email: '', password: '', confirmPassword: '', otp: '', general: '' };
    let isValid = true;

    if (!isValidOTP(otp)) {
      newErrors.otp = 'OTP must be a 6-digit number.';
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) {
      toast.error(newErrors.otp, {
        icon: <AlertCircle className="h-3 w-3 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    }
    return isValid;
  };

  const signupAPI = async (name, email, password) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${API_URL}/auth/signup`,
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 'Signup failed. Please try again.';
      throw new Error(errorMsg);
    }
  };

  const verifySignupOTP = async (email, otp, tempUserId) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${API_URL}/auth/verify-signup-otp`,
        { email, otp, tempUserId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 'OTP verification failed. Please try again.';
      throw new Error(errorMsg);
    }
  };

  const resendSignupOTP = async (email, tempUserId) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${API_URL}/auth/resend-signup-otp`,
        { email, tempUserId },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || 'Failed to resend OTP. Please try again.';
      throw new Error(errorMsg);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setErrors({ name: '', email: '', password: '', confirmPassword: '', otp: '', general: '' });
    toast.dismiss();

    if (!validateSignupForm()) return;

    setLoading(true);
    try {
      const response = await signupAPI(name, email, password);
      setTempUserId(response.tempUserId);
      setShowOTPForm(true);
      toast.success('OTP sent to your email. Please verify to complete signup.', {
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    } catch (err) {
      const errorMsg = err.message;
      setErrors((prev) => ({ ...prev, general: errorMsg }));
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-3 w-3 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setErrors((prev) => ({ ...prev, otp: '', general: '' }));
    toast.dismiss();

    if (!validateOTPForm()) return;

    setLoading(true);
    try {
      await verifySignupOTP(email, otp, tempUserId);
      setIsSignedUp(true);
    } catch (err) {
      const errorMsg = err.message;
      setErrors((prev) => ({ ...prev, general: errorMsg }));
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-3 w-3 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setErrors((prev) => ({ ...prev, otp: '', general: '' }));
    toast.dismiss();

    setLoading(true);
    try {
      await resendSignupOTP(email, tempUserId);
      toast.success('OTP resent to your email.', {
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    } catch (err) {
      const errorMsg = err.message;
      setErrors((prev) => ({ ...prev, general: errorMsg }));
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-3 w-3 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 text-slate-900 font-[Inter] text-[12px] flex items-center justify-center p-4 sm:p-6 antialiased">
      <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-20 blur-3xl z-0" />
      <div className="absolute bottom-8 right-8 w-80 h-80 rounded-full bg-gradient-to-r from-purple-300 to-indigo-300 opacity-20 blur-3xl z-0" />
      <Toaster position="bottom-right" />
      <div className="relative z-10 w-full max-w-5xl bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sm:p-8 flex items-center justify-center">
          <div className="text-center w-full">
            <div className="w-full max-w-xs mx-auto sm:max-w-sm">
              <div className="bg-slate-200 h-48 sm:h-64 rounded-md flex items-center justify-center">
                <span className="text-slate-500 text-[12px]">Signup Illustration Placeholder</span>
              </div>
            </div>
            <h2 className="text-[14px] font-bold text-white mt-4">Join TaskFlow!</h2>
            <p className="text-[12px] text-indigo-100 mt-2">Create an account to streamline your workflows and boost productivity.</p>
          </div>
        </div>
        <div className="flex-1 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-[16px] font-bold text-slate-900">{showOTPForm ? 'Verify Email' : 'Sign Up'}</h1>
            <p className="text-[12px] text-slate-600 mt-2">
              {showOTPForm ? 'Enter the OTP sent to your email' : 'Create your account'}
            </p>
          </div>
          {errors.general && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md" role="alert">
              <div className="flex items-start">
                <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 mr-2" />
                <span className="text-[12px] text-red-700">{errors.general}</span>
              </div>
            </div>
          )}
          {!showOTPForm ? (
            <form onSubmit={handleSignupSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="name" className="block text-[12px] font-medium text-slate-700 mb-1">Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-3 w-3 text-slate-500" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-[12px] rounded-md border ${
                      errors.name ? 'border-red-500' : 'border-slate-200'
                    } bg-white focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter your name"
                    disabled={loading}
                    required
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-[12px] text-red-600">{errors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-[12px] font-medium text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-3 w-3 text-slate-500" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-[12px] rounded-md border ${
                      errors.email ? 'border-red-500' : 'border-slate-200'
                    } bg-white focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter your email"
                    ref={emailInputRef}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-[12px] text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="password" className="block text-[12px] font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-3 w-3 text-slate-500" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full pl-9 pr-9 py-2 text-[12px] rounded-md border ${
                      errors.password ? 'border-red-500' : 'border-slate-200'
                    } bg-white focus:ring-2 focus:ring-indigo-500`}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-indigo-600"
                  >
                    {showPassword ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[12px] text-red-600">{errors.password}</p>
                )}
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-[12px] font-medium text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-3 w-3 text-slate-500" />
                  </div>
                  <input
                    id="confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-9 pr-9 py-2 text-[12px] rounded-md border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-slate-200'
                    } bg-white focus:ring-2 focus:ring-indigo-500`}
                    placeholder="••••••••"
                    disabled={loading}
                    required
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-[12px] text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
              <div className="flex items-center">
                <input id="terms" type="checkbox" className="h-4 w-4 text-indigo-600 border-slate-200 rounded" required />
                <label htmlFor="terms" className="ml-2 block text-[12px] text-slate-700">
                  I agree to the <a href="/terms" className="text-indigo-600 hover:underline">Terms and Conditions</a>
                </label>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-lg text-[12px] font-semibold text-white ${
                  loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                {loading ? 'Signing up...' : 'Sign Up'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="otp" className="block text-[12px] font-medium text-slate-700 mb-1">OTP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-3 w-3 text-slate-500" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                    className={`w-full pl-9 pr-3 py-2 text-[12px] rounded-md border ${
                      errors.otp ? 'border-red-500' : 'border-slate-200'
                    } bg-white focus:ring-2 focus:ring-indigo-500`}
                    placeholder="Enter 6-digit OTP"
                    ref={otpInputRef}
                    disabled={loading}
                    required
                  />
                </div>
                {errors.otp && (
                  <p className="mt-1 text-[12px] text-red-600">{errors.otp}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-lg text-[12px] font-semibold text-white ${
                  loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                }`}
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <div className="text-center space-x-4">
                <button
                  onClick={() => setShowOTPForm(false)}
                  className="text-[12px] text-indigo-600 hover:underline"
                  disabled={loading}
                >
                  Back to Signup
                </button>
                <button
                  onClick={handleResendOTP}
                  className="text-[12px] text-indigo-600 hover:underline"
                  disabled={loading}
                >
                  Resend OTP
                </button>
              </div>
            </form>
          )}
          <div className="mt-4 text-center">
            <p className="text-[12px] text-slate-600">
              Already have an account?{' '}
              <button onClick={() => router.push('/login')} className="font-semibold text-indigo-600 hover:underline">
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;