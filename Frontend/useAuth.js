// useAuth.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const verifyAuth = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.get(`${API_URL}/auth/protected`, {
        withCredentials: true,
      });
      setIsAuthenticated(true);
      setUser({
        id: response.data.user.id,
        name: response.data.user.name,
        email: response.data.user.email,
      });
    } catch (error) {
      console.error('Authentication check failed:', error.response?.data?.error || error.message);
      setIsAuthenticated(false);
      setUser(null);
      const publicRoutes = ['/login', '/register', '/reset-password'];
      if (!publicRoutes.includes(window.location.pathname)) {
        toast.error('Please log in to continue', {
          style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
        });
        router.push('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    verifyAuth();
  }, [router]);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      setIsAuthenticated(false);
      setUser(null);
      document.cookie = 'token=; Max-Age=0; path=/;';
      toast.success('Logged out successfully!', {
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.error || error.message);
      toast.error(error.response?.data?.error || 'Logout failed. Please try again.', {
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    }
  };

  return { isAuthenticated, isLoading, user, logout };
}