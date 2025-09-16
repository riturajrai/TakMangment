'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Edit, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function NameSection({ name, setName, fetchProfile, setGeneralError }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState('');
  const [sectionLoading, setSectionLoading] = useState(false);
  const nameInputRef = useRef(null);

  // Focus input when editing
  useEffect(() => {
    if (isEditing) nameInputRef.current?.focus();
  }, [isEditing]);

  // Validate name
  const validateName = (name) => {
    if (!name) return 'Name is required';
    if (name.trim().length < 2) return 'Name must be at least 2 characters';
    if (name.trim().length > 50) return 'Name must be less than 50 characters';
    if (name.toLowerCase() === 'unknown') return 'Name cannot be "unknown"';
    return '';
  };

  // Handle name update
  const handleUpdateName = async (e) => {
    e.preventDefault();
    setNameError('');
    setGeneralError('');
    toast.dismiss();

    const error = validateName(name);
    if (error) {
      setNameError(error);
      toast.error(error);
      return;
    }

    setSectionLoading(true);
    try {
      await axios.put(`${API_URL}/users/update-user`, { name });
      toast.success('Name updated successfully!');
      setIsEditing(false);
      await fetchProfile();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error?.message ||
        err.response?.data?.message ||
        'Failed to update name';
      setGeneralError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSectionLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    setIsEditing(false);
    setNameError('');
    setGeneralError('');
    setName(name || '');
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <User className="h-5 w-5 mr-2 text-blue-600" />
        Name
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
        <form onSubmit={handleUpdateName} className="space-y-4 max-w-md">
          {/* Input field */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing || sectionLoading}
              ref={nameInputRef}
              className="w-full px-3 py-2 text-sm rounded-md border border-gray-300 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed 
                transition-colors duration-200"
              placeholder="Enter your name"
              required
              aria-required="true"
              aria-describedby={nameError ? 'name-error' : undefined}
            />
            {nameError && (
              <p id="name-error" className="mt-1 text-xs text-red-600">
                {nameError}
              </p>
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
                  <Save className="h-4 w-4 inline mr-2" />
                  Save changes
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
                Edit Name
              </button>
            )}
          </div>
        </form>
      )}
    </motion.section>
  );
}
