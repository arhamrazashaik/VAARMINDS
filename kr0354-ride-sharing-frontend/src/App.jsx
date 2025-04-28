
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaRoute, FaMoneyBillWave, FaCar, FaCalendarAlt, FaMapMarkedAlt } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookRide from './pages/BookRide';
import RideDetails from './pages/RideDetails';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import CreateGroup from './pages/CreateGroup';
import PublicGroups from './pages/PublicGroups';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import Payment from './pages/Payment';
// MapboxNavigation component removed as it doesn't exist

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/common/ScrollToTop';
import ScrollToTopButton from './components/common/ScrollToTopButton';

function App() {
  useEffect(() => {
    // Initialize AOS animation library
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <AnimatedRoutes />
        <Footer />
        <ScrollToTopButton />
      </div>
    </Router>
  );
}

// AnimatedRoutes component for page transitions
function AnimatedRoutes() {
  const location = useLocation();

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    in: {
      opacity: 1,
      y: 0
    },
    out: {
      opacity: 0,
      y: -20
    }
  };

  const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.5
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="flex-grow"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book-ride" element={<BookRide />} />
          <Route path="/rides/:id" element={<RideDetails />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/create" element={<CreateGroup />} />
          <Route path="/groups/public" element={<PublicGroups />} />
          <Route path="/groups/:id" element={<GroupDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/payment" element={<Payment />} /> 
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
