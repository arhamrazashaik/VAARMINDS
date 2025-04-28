import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookRide from './pages/BookRide';
import RideDetails from './pages/RideDetails';
import RideHistory from './pages/RideHistory';
import Groups from './pages/Groups';
import GroupDetails from './pages/GroupDetails';
import CreateGroup from './pages/CreateGroup';
import PublicGroups from './pages/PublicGroups';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Context
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/book-ride" element={<BookRide />} />
                <Route path="/rides/:id" element={<RideDetails />} />
                <Route path="/ride-history" element={<RideHistory />} />
                <Route path="/groups" element={<Groups />} />
                <Route path="/groups/create" element={<CreateGroup />} />
                <Route path="/groups/public" element={<PublicGroups />} />
                <Route path="/groups/:id" element={<GroupDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
