'use client';

import { LogOut, Upload } from 'lucide-react';

export default function ProfileHeader({ name,  onUpload }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 lg:p-6 mb-6 border border-gray-100">
      <div className="flex items-center justify-between">
        {/* Avatar & Name Section */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            {/* Avatar */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>

            {/* Upload button */}
            <button
              onClick={onUpload}
              className="absolute -bottom-1 -right-1 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-all"
              aria-label="Upload profile picture"
            >
              <Upload className="h-4 w-4 text-blue-600" />
            </button>
          </div>

          {/* User Info */}
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {name || 'Set your name'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your account details
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
