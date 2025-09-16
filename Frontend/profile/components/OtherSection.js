'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function OtherSection({
  bio,
  setBio,
  phoneNumber,
  setPhoneNumber,
  originalBio,
  setOriginalBio,
  originalPhoneNumber,
  setOriginalPhoneNumber,
  fetchProfile,
  setGeneralError
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation
  const validateBio = (value) => {
    if (!value) return '';
    if (value.length > 500) return 'Bio must be 500 characters or less';
    return '';
  };

  const validatePhoneNumber = (phone) => {
    if (!phone) return '';
    if (!/^\+?[1-9]\d{1,14}$/.test(phone)) {
      return 'Invalid phone number format (e.g., +1234567890)';
    }
    return '';
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError('');
    toast.dismiss();

    const bioError = validateBio(bio);
    const phoneError = validatePhoneNumber(phoneNumber);

    if (bioError || phoneError) {
      setErrors({ bio: bioError, phoneNumber: phoneError });
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      const payload = { bio: bio || null, phone_number: phoneNumber || null };

      await axios.put(`${API_URL}/profile/update-profile`, payload);

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setOriginalBio(bio || '');
      setOriginalPhoneNumber(phoneNumber || '');
      await fetchProfile();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update profile';
      setGeneralError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
    setGeneralError('');
    setBio(originalBio || '');
    setPhoneNumber(originalPhoneNumber || '');
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <h2 className="text-sm font-semibold text-gray-900">Other Information</h2>

      {loading ? (
        <div className="flex justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"
          />
        </div>
      ) : (
        <>
          {/* View Mode */}
          {!isEditing && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <p className="text-xs text-gray-600 p-2 bg-gray-50 rounded-md">
                  {bio || 'No bio set'}
                </p>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <p className="text-xs text-gray-600 p-2 bg-gray-50 rounded-md">
                  {phoneNumber || 'No phone number set'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-2 px-3 text-xs font-medium text-white 
                  bg-blue-600 hover:bg-blue-700 rounded-md
                  flex items-center justify-center transition-colors duration-200"
              >
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit Other Info
              </button>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
              {/* Bio */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={loading}
                  className="input-field text-xs"
                  placeholder="Tell us about yourself (max 500 characters)"
                  rows={3}
                  maxLength={500}
                  aria-describedby={errors.bio ? 'bio-error' : undefined}
                />
                {errors.bio && (
                  <p id="bio-error" className="mt-1 text-[10px] text-red-600">
                    {errors.bio}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.trim())}
                  disabled={loading}
                  className="input-field text-xs"
                  placeholder="+1234567890"
                  aria-describedby={
                    errors.phoneNumber ? 'phoneNumber-error' : undefined
                  }
                />
                {errors.phoneNumber && (
                  <p id="phoneNumber-error" className="mt-1 text-[10px] text-red-600">
                    {errors.phoneNumber}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 py-2 px-3 text-xs font-medium text-gray-700 
                    bg-gray-100 hover:bg-gray-200 rounded-md
                    disabled:bg-gray-100 disabled:cursor-not-allowed
                    flex items-center justify-center transition-colors duration-200"
                >
                  <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2 px-3 text-xs font-medium text-white 
                    bg-blue-600 hover:bg-blue-700 rounded-md
                    disabled:bg-gray-300 disabled:cursor-not-allowed
                    flex items-center justify-center transition-colors duration-200"
                >
                  <Save className="h-3.5 w-3.5 mr-1.5" />
                  Save
                </button>
              </div>
            </form>
          )}
        </>
      )}
    </motion.section>
  );
}
