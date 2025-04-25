import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaUserCircle, FaBell } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // This would be from auth context in a real app
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const location = useLocation();

  // Check if user is scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleProfileDropdown = () => {
    setIsProfileOpen(!isProfileOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const toggleNotificationsDropdown = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  return (
    <motion.nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled || location.pathname !== '/' ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className={`text-2xl font-bold ${
            isScrolled || location.pathname !== '/' ? 'text-primary-600' : 'text-white'
          }`}>
            KR0354
          </span>
          <span className={`ml-2 text-sm font-medium ${
            isScrolled || location.pathname !== '/' ? 'text-gray-500' : 'text-white/80'
          }`}>
            Ride Sharing
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" label="Home" isScrolled={isScrolled || location.pathname !== '/'} />
          <NavLink to="/book-ride" label="Book a Ride" isScrolled={isScrolled || location.pathname !== '/'} />
          <NavLink to="/groups" label="Groups" isScrolled={isScrolled || location.pathname !== '/'} />

          {isLoggedIn ? (
            <>
              <div className="relative">
                <button
                  onClick={toggleNotificationsDropdown}
                  className={`p-2 rounded-full ${
                    isScrolled || location.pathname !== '/' ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-white/80'
                  } focus:outline-none`}
                >
                  <FaBell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                </button>

                {isNotificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        <div className="px-4 py-2 hover:bg-gray-100 border-b">
                          <p className="text-sm text-gray-700">Your ride is arriving in 5 minutes.</p>
                          <p className="text-xs text-gray-500">2 minutes ago</p>
                        </div>
                        <div className="px-4 py-2 hover:bg-gray-100 border-b">
                          <p className="text-sm text-gray-700">New message in "Office Commute" group.</p>
                          <p className="text-xs text-gray-500">1 hour ago</p>
                        </div>
                        <div className="px-4 py-2 hover:bg-gray-100">
                          <p className="text-sm text-gray-700">Your payment for last ride was successful.</p>
                          <p className="text-xs text-gray-500">Yesterday</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 border-t text-center">
                        <Link to="/notifications" className="text-xs text-primary-600 hover:text-primary-800">
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className={`flex items-center ${
                    isScrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  <FaUserCircle className="h-5 w-5 mr-2" />
                  <span>Account</span>
                </button>

                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Dashboard
                      </Link>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Profile
                      </Link>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className={`${
                  isScrolled || location.pathname !== '/' ? 'text-gray-700 hover:text-gray-900' : 'text-white hover:text-white/80'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`px-4 py-2 rounded-md ${
                  isScrolled || location.pathname !== '/'
                    ? 'bg-primary-600 hover:bg-primary-700 text-white'
                    : 'bg-white hover:bg-white/90 text-primary-600'
                }`}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? (
            <FaTimes className={isScrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white'} />
          ) : (
            <FaBars className={isScrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-white'} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-white shadow-lg absolute top-full left-0 right-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-3 space-y-1">
            <MobileNavLink to="/" label="Home" />
            <MobileNavLink to="/book-ride" label="Book a Ride" />
            <MobileNavLink to="/groups" label="Groups" />

            {isLoggedIn ? (
              <>
                <MobileNavLink to="/dashboard" label="Dashboard" />
                <MobileNavLink to="/profile" label="Profile" />
                <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                <Link
                  to="/login"
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

// Desktop Navigation Link
const NavLink = ({ to, label, isScrolled }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative ${
        isScrolled
          ? isActive
            ? 'text-primary-600'
            : 'text-gray-700 hover:text-primary-600'
          : isActive
          ? 'text-white'
          : 'text-white/80 hover:text-white'
      }`}
    >
      {label}
      {isActive && (
        <motion.div
          className={`absolute -bottom-1 left-0 right-0 h-0.5 ${isScrolled ? 'bg-primary-600' : 'bg-white'}`}
          layoutId="navbar-underline"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
};

// Mobile Navigation Link
const MobileNavLink = ({ to, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`block px-4 py-2 rounded-md ${
        isActive
          ? 'bg-primary-50 text-primary-600 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </Link>
  );
};

export default Navbar;
