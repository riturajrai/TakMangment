'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../useAuth'; // Adjust path based on your project structure
import { Toaster, toast } from 'react-hot-toast';
import ProfileHeader from './ProfileHeader';
import ProfileTabs from './ProfileTabs';
import NameSection from './NameSection';
import EmailSection from './EmailSection';
import OtherSection from './OtherSection';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';

// API Gateway URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Set axios defaults globally
axios.defaults.withCredentials = true;

export default function Profile({ section }) {
  const { isAuthenticated, isLoading: authLoading, user = {}, logout } = useAuth();
  const router = useRouter();

  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [originalBio, setOriginalBio] = useState('');
  const [originalPhoneNumber, setOriginalPhoneNumber] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeSection, setActiveSection] = useState(section || 'name');

  // Sync activeSection with section prop
  useEffect(() => {
    const validSections = ['name', 'email', 'other'];
    if (section && validSections.includes(section)) {
      setActiveSection(section);
    } else {
      setActiveSection('name');
      router.replace('/profile/name', { shallow: true });
    }
  }, [section, router]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login?redirect=/profile/name');
    }
  }, [isAuthenticated, authLoading, router]);

  // Fetch profile data only on initial mount
  const fetchProfile = async () => {
    if (isAuthenticated) {
      setInitialLoading(true);
      try {
        // Fetch name and email
        const userResponse = await axios.get(`${API_URL}/users/profile-user`);
        const fetchedUser = userResponse.data.user || {};
        setName(fetchedUser.name || '');
        setEmail(fetchedUser.email || '');

        // Fetch bio and phone_number
        const profileResponse = await axios.get(`${API_URL}/profile/get-profile`);
        const fetchedProfile = profileResponse.data.user || {};
        setBio(fetchedProfile.bio || '');
        setPhoneNumber(fetchedProfile.phone_number || '');
        setOriginalBio(fetchedProfile.bio || '');
        setOriginalPhoneNumber(fetchedProfile.phone_number || '');

        // Update localStorage
        localStorage.setItem('user', JSON.stringify({
          name: fetchedUser.name || '',
          email: fetchedUser.email || '',
          bio: fetchedProfile.bio || '',
          phone_number: fetchedProfile.phone_number || ''
        }));
      } catch (err) {
        const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to fetch profile';
        toast.error(errorMsg);
        setGeneralError(errorMsg);
      } finally {
        setInitialLoading(false);
      }
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProfile();
  }, [isAuthenticated]);

  // Handle tab click with shallow routing
  const handleTabClick = (section) => {
    setActiveSection(section);
    router.push(`/profile/${section}`, { shallow: true }); // Shallow routing to avoid full reload
  };

  // Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        await axios.post(`${API_URL}/auth/logout`);
        localStorage.removeItem('user');
        logout();
        toast.success('Logged out successfully!');
        router.push('/login');
      } catch (err) {
        const errorMsg = err.response?.data?.error?.message || err.response?.data?.message || 'Failed to logout';
        toast.error(errorMsg);
      }
    }
  };

  // Main loader only for initial load or auth
  if (initialLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Toaster position="bottom-right" />
      <main className="flex-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ProfileHeader name={name} onLogout={handleLogout} />
          <div className="bg-white h-[500px]  rounded-2xl shadow-lg p-6 lg:p-8">
            <ProfileTabs activeSection={activeSection} onTabClick={handleTabClick} />
            <AnimatePresence>
              {generalError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 bg-red-50 border border-red-200 p-4 rounded-lg"
                >
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-sm text-red-700">{generalError}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeSection === 'name' && (
                  <NameSection
                    name={name}
                    setName={setName}
                    fetchProfile={fetchProfile}
                    setGeneralError={setGeneralError}
                  />
                )}
                {activeSection === 'email' && (
                  <EmailSection
                    email={email}
                    setEmail={setEmail}
                    otp={otp}
                    setOtp={setOtp}
                    fetchProfile={fetchProfile}
                    setGeneralError={setGeneralError}
                  />
                )}
                {activeSection === 'other' && (
                  <OtherSection
                    bio={bio}
                    setBio={setBio}
                    phoneNumber={phoneNumber}
                    setPhoneNumber={setPhoneNumber}
                    originalBio={originalBio}
                    setOriginalBio={setOriginalBio}
                    originalPhoneNumber={originalPhoneNumber}
                    setOriginalPhoneNumber={setOriginalPhoneNumber}
                    fetchProfile={fetchProfile}
                    setGeneralError={setGeneralError}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}