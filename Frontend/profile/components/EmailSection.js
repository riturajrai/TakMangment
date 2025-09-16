'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Edit, ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function EmailSection({ email, setEmail, otp, setOtp, fetchProfile, setGeneralError }) {
  const [isEditing, setIsEditing] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [newEmailError, setNewEmailError] = useState('');
  const [sectionLoading, setSectionLoading] = useState(false);
  const emailInputRef = useRef(null);
  const otpInputRef = useRef(null);
  const newEmailInputRef = useRef(null);

  // Focus inputs
  useEffect(() => {
    if (isEditing && !otpSent) emailInputRef.current?.focus();
    if (otpSent) otpInputRef.current?.focus();
  }, [isEditing, otpSent]);

  // Validate email
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format';
    return '';
  };

  // Validate OTP
  const validateOtp = (otp) => {
    if (!otp) return 'OTP is required';
    if (!/^[0-9a-fA-F]{6}$/.test(otp)) return 'OTP must be 6 hexadecimal characters';
    return '';
  };

  // Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setEmailError('');
    setGeneralError('');
    toast.dismiss();

    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      toast.error(error);
      return;
    }

    setSectionLoading(true);
    try {
      await axios.post(`${API_URL}/users/update-email/send-otp`, { email });
      setOtpSent(true);
      toast.success('OTP sent to your current email!');
    } catch (err) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to send OTP';
      setGeneralError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSectionLoading(false);
    }
  };

  // Verify OTP + update email
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');
    setEmailError('');
    setNewEmailError('');
    setGeneralError('');
    toast.dismiss();

    const emailErr = validateEmail(email);
    const otpErr = validateOtp(otp);
    const newEmailErr = validateEmail(newEmail);

    if (emailErr || otpErr || newEmailErr) {
      setEmailError(emailErr);
      setOtpError(otpErr);
      setNewEmailError(newEmailErr);
      toast.error('Please fix the errors in the form');
      return;
    }

    setSectionLoading(true);
    try {
      await axios.put(`${API_URL}/users/update-email/verify-otp`, {
        email,
        otp,
        newEmail,
      });
      toast.success('Email updated successfully!');
      setIsEditing(false);
      setOtpSent(false);
      setOtp('');
      setNewEmail('');
      await fetchProfile();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update email';
      setGeneralError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSectionLoading(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    setIsEditing(false);
    setOtpSent(false);
    setEmailError('');
    setOtpError('');
    setNewEmailError('');
    setGeneralError('');
    setEmail(email || '');
    setOtp('');
    setNewEmail('');
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <Mail className="h-5 w-5 mr-2 text-blue-600" />
        Email
      </h2>

      {sectionLoading ? (
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <>
          {/* Email input before OTP */}
          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Current Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  disabled={!isEditing || sectionLoading}
                  ref={emailInputRef}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed 
                    transition-colors duration-200"
                  placeholder="Enter your current email"
                  required
                  aria-required="true"
                  aria-describedby={emailError ? 'email-error' : undefined}
                />
                {emailError && (
                  <p id="email-error" className="mt-1 text-xs text-red-600">{emailError}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={sectionLoading}
                      className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                        hover:bg-gray-200 rounded-md disabled:bg-gray-100 
                        disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <ArrowLeft className="h-4 w-4 inline mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={sectionLoading}
                      className="px-5 py-2 text-sm font-medium text-white bg-blue-600 
                        hover:bg-blue-700 rounded-md disabled:bg-gray-300 
                        disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      <Mail className="h-4 w-4 inline mr-2" />
                      Send OTP
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    disabled={sectionLoading}
                    className="px-5 py-2 text-sm font-medium text-white bg-blue-600 
                      hover:bg-blue-700 rounded-md disabled:bg-gray-300 
                      disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Edit className="h-4 w-4 inline mr-2" />
                    Edit Email
                  </button>
                )}
              </div>
            </form>
          ) : (
            // OTP form + New Email input
            <form onSubmit={handleVerifyOtp} className="space-y-4 max-w-md">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
                  OTP <span className="text-red-500">*</span>
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.toUpperCase().slice(0, 6))}
                  disabled={sectionLoading}
                  ref={otpInputRef}
                  maxLength={6}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed 
                    transition-colors duration-200"
                  placeholder="Enter 6-character OTP"
                  required
                  aria-required="true"
                  aria-describedby={otpError ? 'otp-error' : undefined}
                />
                {otpError && (
                  <p id="otp-error" className="mt-1 text-xs text-red-600">{otpError}</p>
                )}
              </div>

              <div>
                <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 mb-1.5">
                  New Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="newEmail"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value.trim())}
                  disabled={sectionLoading}
                  ref={newEmailInputRef}
                  className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 
                    focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed 
                    transition-colors duration-200"
                  placeholder="Enter your new email"
                  required
                  aria-required="true"
                  aria-describedby={newEmailError ? 'new-email-error' : undefined}
                />
                {newEmailError && (
                  <p id="new-email-error" className="mt-1 text-xs text-red-600">{newEmailError}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={sectionLoading}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                    hover:bg-gray-200 rounded-md disabled:bg-gray-100 
                    disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <ArrowLeft className="h-4 w-4 inline mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sectionLoading}
                  className="px-5 py-2 text-sm font-medium text-white bg-blue-600 
                    hover:bg-blue-700 rounded-md disabled:bg-gray-300 
                    disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  Verify & Update Email
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </motion.section>
  );
}
