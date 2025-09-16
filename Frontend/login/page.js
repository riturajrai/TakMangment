'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, X, AlertCircle, CheckCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const CONFIG = {
  MIN_PASSWORD_LENGTH: 6,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

function LoginRedirectHandler({ isLoggedIn }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isLoggedIn) {
      const redirectPath = searchParams.get('redirect') || '/dashboard';
      router.replace(redirectPath);
    }
  }, [isLoggedIn, router, searchParams]);

  return null;
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const emailInputRef = useRef(null);
  const forgotEmailInputRef = useRef(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const isValidEmail = (email) => CONFIG.EMAIL_REGEX.test(email);
  const isValidPassword = (password) => CONFIG.PASSWORD_REGEX.test(password);

  const handleLogin = async (email, password) => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${API_URL}/auth/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
      console.log('Login response:', response.data);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      };
      return response.data;
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      throw new Error(err.response?.data?.error || 'An error occurred during login', { cause: err.response?.status });
    }
  };

  const handleForgotPasswordRequest = async (email) => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${API_URL}/auth/forgot-password`, { email }, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to send verification code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    toast.dismiss();

    if (!isValidEmail(email)) {
      const errorMsg = 'Please enter a valid email address.';
      setError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      return;
    }

    if (!isValidPassword(password)) {
      const errorMsg = 'Password must be at least 6 characters, including one uppercase, one lowercase, one number, and one special character.';
      setError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      return;
    }

    setLoading(true);
    try {
      await handleLogin(email, password);
      setIsLoggedIn(true);
      toast.success('Logged in successfully!', {
        icon: <CheckCircle className="h-4 w-4 text-indigo-600" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    } catch (err) {
      const errorMsg = err.message;
      setError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    toast.dismiss();

    if (!isValidEmail(forgotEmail)) {
      const errorMsg = 'Please enter a valid email address.';
      setForgotError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      return;
    }

    setLoading(true);
    try {
      await handleForgotPasswordRequest(forgotEmail);
      toast.success('Verification code sent to your email!', {
        icon: <CheckCircle className="h-4 w-4 text-indigo-600" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(forgotEmail)}`);
        setIsForgotPasswordOpen(false);
        setForgotEmail('');
      }, 1500);
    } catch (err) {
      const errorMsg = err.message;
      setForgotError(errorMsg);
      toast.error(errorMsg, {
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 text-slate-900 font-[Inter] text-[14px] flex items-center justify-center p-4 sm:p-6">
      <Toaster position="bottom-right" />
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-md border border-slate-100 overflow-hidden flex flex-col lg:flex-row">
        <div className="lg:flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 p-6 sm:p-8 flex items-center justify-center">
          <div className="text-center w-full">
            <div className="w-full max-w-xs mx-auto sm:max-w-sm">
              <div className="bg-slate-200 h-48 sm:h-64 rounded-md flex items-center justify-center">
                <span className="text-slate-500 text-[14px]">Login Illustration Placeholder</span>
              </div>
            </div>
            <h2 className="text-[16px] font-bold text-white mt-4">Welcome Back!</h2>
            <p className="text-[14px] text-indigo-100 mt-2">Sign in to access your personalized dashboard and features.</p>
          </div>
        </div>
        <div className="flex-1 p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-[18px] font-bold text-slate-900">Sign In</h1>
            <p className="text-[14px] text-slate-600 mt-2">Enter your credentials to access your account</p>
          </div>
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md" role="alert">
              <div className="flex items-start">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2" />
                <span className="text-[14px] text-red-700">{error}</span>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-[14px] font-medium text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  className="w-full pl-9 pr-3 py-2 text-[14px] rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                  ref={emailInputRef}
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-[14px] font-medium text-slate-700">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-[14px] text-indigo-600 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 text-[14px] rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500"
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-indigo-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input id="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 border-slate-200 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-[14px] text-slate-700">Remember me</label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg text-[14px] font-semibold text-white ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
              }`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-[14px] text-slate-600">
              Don&apos;t have an account?{' '}
              <button onClick={() => router.push('/register')} className="font-semibold text-indigo-600 hover:underline">
                Create an account
              </button>
            </p>
          </div>
        </div>
        {isForgotPasswordOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-semibold text-slate-900">Reset Password</h3>
                <button
                  onClick={() => setIsForgotPasswordOpen(false)}
                  className="p-1 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-slate-100"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {forgotError && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-md">
                  <div className="flex items-start">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 mr-2" />
                    <span className="text-[14px] text-red-700">{forgotError}</span>
                  </div>
                </div>
              )}
              <p className="text-[14px] text-slate-600 mb-4">Enter your email address to receive a verification code.</p>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-[14px] font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value.trim())}
                    className="w-full px-3 py-2 text-[14px] rounded-md border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500"
                    placeholder="Enter your email"
                    ref={forgotEmailInputRef}
                    disabled={loading}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="flex-1 py-2 px-4 border border-slate-200 rounded-lg text-[14px] font-semibold bg-white hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`flex-1 py-2 px-4 rounded-lg text-[14px] font-semibold text-white ${
                      loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                    }`}
                  >
                    {loading ? 'Sending...' : 'Send Code'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Suspense fallback={null}>
        <LoginRedirectHandler isLoggedIn={isLoggedIn} />
      </Suspense>
    </div>
  );
}

export default Login;
export const dynamic = 'force-dynamic';