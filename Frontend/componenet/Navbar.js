'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown, Search, User, Bell, LogOut, LayoutDashboard, CheckSquare, BarChart3, Settings } from 'lucide-react';
import { useAuth } from '../useAuth';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

// Update API_URL to match backend port
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const Navbar = () => {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isTasksOpen, setIsTasksOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isFeaturesOpen) setIsFeaturesOpen(false);
    if (isTasksOpen) setIsTasksOpen(false);
    if (isProfileOpen) setIsProfileOpen(false);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleFeatures = () => {
    setIsFeaturesOpen(!isFeaturesOpen);
  };

  const toggleTasks = () => {
    setIsTasksOpen(!isTasksOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  /**
   * Handles logout API call and updates state
   */
  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${API_URL}/auth/logout`);
      localStorage.removeItem('user');
      logout();
      toast.success('Logged out successfully!', {
        icon: <CheckSquare className="h-4 w-4 text-indigo-600" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
      setIsMenuOpen(false);
      setIsProfileOpen(false);
      setIsNotificationsOpen(false);
      router.push('/login');
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Logout failed. Please try again.';
      toast.error(errorMsg, {
        icon: <Bell className="h-4 w-4 text-red-500" />,
        style: { background: '#ffffff', color: '#1e293b', padding: '12px', borderRadius: '8px' },
      });
    }
  };

  // Public navigation items (hidden after login)
  const publicNavItems = [
    { href: '/', label: 'Home' },
    {
      label: 'Features',
      subItems: [
        { href: '/features/task-management', label: 'Task Management', icon: <CheckSquare className="h-4 w-4 mr-2" /> },
        { href: '/features/kanban-boards', label: 'Kanban Boards', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
        { href: '/features/time-tracking', label: 'Time Tracking', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
        { href: '/features/team-collaboration', label: 'Team Collaboration', icon: <User className="h-4 w-4 mr-2" /> },
      ],
    },
    { href: '/pricing', label: 'Pricing' },
    { href: '/about', label: 'About' },
  ];

  // Protected navigation items (visible after login)
  const protectedNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    {
      label: 'Tasks',
      subItems: [
        { href: '/tasks/my-tasks', label: 'My Tasks', icon: <CheckSquare className="h-4 w-4 mr-2" /> },
        { href: '/tasks/assigned', label: 'Assigned', icon: <User className="h-4 w-4 mr-2" /> },
        { href: '/tasks/kanban', label: 'Kanban Board', icon: <LayoutDashboard className="h-4 w-4 mr-2" /> },
        { href: '/tasks/calendar', label: 'Calendar View', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
      ],
      icon: <CheckSquare className="h-5 w-5 mr-2" />,
    },
    { href: '/projects', label: 'Projects', icon: <LayoutDashboard className="h-5 w-5 mr-2" /> },
    { href: '/team', label: 'Team', icon: <User className="h-5 w-5 mr-2" /> },
    { href: '/analytics', label: 'Analytics', icon: <BarChart3 className="h-5 w-5 mr-2" /> },
  ];

  // Profile dropdown items
  const profileItems = [
    { href: '/profile/name', label: 'Profile', icon: <User className="h-4 w-4 mr-2" /> }, // Updated to /profile/name
    { href: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4 mr-2" /> },
    { label: 'Logout', onClick: handleLogout, icon: <LogOut className="h-4 w-4 mr-2" /> },
  ];

  // Notification dropdown items
  const notificationItems = [
    { href: '/notifications', label: 'View All Notifications' },
    { label: 'Mark as Read', onClick: () => console.log('Mark notifications as read') },
  ];
  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm fixed top-0 left-0 w-full z-50">
      <Toaster position="bottom-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              TaskFlow
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-baseline space-x-6">
              {!isAuthenticated &&
                publicNavItems.map((item) =>
                  item.subItems ? (
                    <div key={item.label} className="relative">
                      <button
                        onClick={toggleFeatures}
                        className="text-slate-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
                        aria-expanded={isFeaturesOpen}
                        aria-haspopup="true"
                        data-testid="features-button"
                      >
                        {item.label}
                        <ChevronDown
                          className={`ml-1 h-4 w-4 ${isFeaturesOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isFeaturesOpen && (
                        <div className="absolute z-10 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                                role="menuitem"
                                onClick={() => setIsFeaturesOpen(false)}
                              >
                                {subItem.icon}
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-slate-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium transition-colors duration-200"
                    >
                      {item.label}
                    </Link>
                  )
                )}
              {isAuthenticated &&
                protectedNavItems.map((item) =>
                  item.subItems ? (
                    <div key={item.label} className="relative">
                      <button
                        onClick={toggleTasks}
                        className="text-slate-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium flex items-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded-md"
                        aria-expanded={isTasksOpen}
                        aria-haspopup="true"
                        data-testid="tasks-button"
                      >
                        {item.icon}
                        {item.label}
                        <ChevronDown
                          className={`ml-1 h-4 w-4 ${isTasksOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {isTasksOpen && (
                        <div className="absolute z-10 mt-2 w-64 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                          <div className="py-1" role="menu" aria-orientation="vertical">
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                                role="menuitem"
                                onClick={() => setIsTasksOpen(false)}
                              >
                                {subItem.icon}
                                {subItem.label}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-slate-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium flex items-center transition-colors duration-200"
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )
                )}
            </div>
            <button
              className="text-slate-700 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Search"
              title="Search"
              data-testid="search-button"
            >
              <Search className="h-5 w-5" />
            </button>
            {isLoading ? (
              <div className="text-slate-600 text-sm">Loading...</div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="relative text-slate-700 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-expanded={isNotificationsOpen}
                    aria-haspopup="true"
                    title="Notifications"
                    data-testid="notifications-button"
                  >
                    <Bell className="h-5 w-5" />
                    {user?.unreadNotifications > 0 && (
                      <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  {isNotificationsOpen && (
                    <div className="absolute z-10 right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        {notificationItems.map((item) =>
                          item.onClick ? (
                            <button
                              key={item.label}
                              onClick={item.onClick}
                              className="w-full text-left block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                              role="menuitem"
                            >
                              {item.label}
                            </button>
                          ) : (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="block px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                              role="menuitem"
                              onClick={() => setIsNotificationsOpen(false)}
                            >
                              {item.label}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className="text-slate-700 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                    title="Profile"
                    data-testid="profile-button"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium mr-2">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="text-sm font-medium hidden lg:block">{user?.name || 'User'}</span>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute z-10 right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1" role="menu" aria-orientation="vertical">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-sm font-medium text-slate-800">{user?.name || 'User'}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                        </div>
                        {profileItems.map((item) =>
                          item.onClick ? (
                            <button
                              key={item.label}
                              onClick={item.onClick}
                              className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                              role="menuitem"
                            >
                              {item.icon}
                              {item.label}
                            </button>
                          ) : (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors duration-150"
                              role="menuitem"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              {item.icon}
                              {item.label}
                            </Link>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && !isLoading && (
              <button
                onClick={toggleNotifications}
                className="relative text-slate-700 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                aria-label="Notifications"
                title="Notifications"
                data-testid="mobile-notifications-button"
              >
                <Bell className="h-5 w-5" />
                {user?.unreadNotifications > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            )}
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
              aria-expanded={isMenuOpen}
              aria-label="Toggle menu"
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isAuthenticated &&
              publicNavItems.map((item) =>
                item.subItems ? (
                  <div key={item.label}>
                    <button
                      onClick={toggleFeatures}
                      className="w-full text-left text-slate-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between transition-colors duration-150"
                      aria-expanded={isFeaturesOpen}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown
                        className={`h-4 w-4 ${isFeaturesOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isFeaturesOpen && (
                      <div className="pl-4 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="flex items-center text-slate-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                            onClick={toggleMenu}
                          >
                            {subItem.icon}
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-slate-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150"
                    onClick={toggleMenu}
                  >
                    {item.label}
                  </Link>
                )
              )}
            {isAuthenticated &&
              protectedNavItems.map((item) =>
                item.subItems ? (
                  <div key={item.label}>
                    <button
                      onClick={toggleTasks}
                      className="w-full text-left text-slate-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium flex items-center justify-between transition-colors duration-150"
                      aria-expanded={isTasksOpen}
                      aria-haspopup="true"
                    >
                      <span className="flex items-center">
                        {item.icon}
                        {item.label}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 ${isTasksOpen ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {isTasksOpen && (
                      <div className="pl-4 mt-1 space-y-1">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="flex items-center text-slate-600 hover:text-indigo-600 block px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                            onClick={toggleMenu}
                          >
                            {subItem.icon}
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center text-slate-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150"
                    onClick={toggleMenu}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                )
              )}
            {isAuthenticated && (
              <div className="border-t border-slate-200 pt-2">
                {profileItems.map((item) =>
                  item.onClick ? (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.onClick();
                        toggleMenu();
                      }}
                      className="w-full text-left flex items-center text-slate-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150"
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center text-slate-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150"
                      onClick={toggleMenu}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            )}
            <div className="pt-4 pb-2 border-t border-slate-200 mt-2">
              {isLoading ? (
                <div className="text-slate-600 text-base px-3 py-2">Loading...</div>
              ) : !isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className="block w-full text-center px-4 py-2 rounded-lg border border-indigo-200 text-indigo-600 font-medium hover:bg-indigo-50 transition-all duration-200"
                    onClick={toggleMenu}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-md transition-all duration-200 mt-2"
                    onClick={toggleMenu}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-slate-800">{user?.name || 'User'}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || ''}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;