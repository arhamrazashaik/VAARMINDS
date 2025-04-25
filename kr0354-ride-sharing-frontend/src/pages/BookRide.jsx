import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaArrowRight, FaArrowLeft, FaCheckCircle, FaMotorcycle, FaTaxi, FaBus, FaShuttleVan } from 'react-icons/fa';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = "AIzaSyDHlM6-39YYVj7iVlbTKZZN91jql4piJd4";

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '0.5rem'
};

// Default center (will be updated based on user location)
const defaultCenter = {
  lat: 28.6139,  // New Delhi coordinates as default
  lng: 77.2090
};

// Libraries for Google Maps
const libraries = ['places'];

const BookRide = () => {
  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries
  });

  // Form data state
  const [formData, setFormData] = useState({
    rideType: 'Office Commute',
    bookingType: 'Instant Booking',
    dateTime: '',
    passengers: 4,
    vehicleType: 'Sedan',
    pickupLocation: '123 Main St, Anytown',
    destination: '456 Office Park, Business District',
    paymentMethod: 'Credit Card (•••• 4242)'
  });

  // Estimated values
  const [estimatedValues, setEstimatedValues] = useState({
    distance: '12.5 km',
    duration: '25 minutes',
    fare: 450,
    perPersonFare: 75
  });

  // Map references
  const mapRef = useRef(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  // Step state
  const [step, setStep] = useState(1);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update fare calculation based on vehicle type and passengers
    if (name === 'vehicleType' || name === 'passengers') {
      updateFareEstimate();
    }
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicleType) => {
    setFormData(prev => ({
      ...prev,
      vehicleType
    }));
    updateFareEstimate(vehicleType);
  };

  // Update fare estimate based on vehicle type
  const updateFareEstimate = (vehicleType = formData.vehicleType) => {
    // Base rates for different vehicle types
    const rates = {
      'Bike': 15,
      'Auto': 20,
      'Sedan': 25,
      'SUV': 30,
      'Tempo': 35,
      'Bus': 50
    };

    // Calculate fare based on distance and vehicle type
    const distance = 12.5; // Example distance in km
    const rate = rates[vehicleType] || rates['Sedan'];
    const fare = Math.round(distance * rate);
    const perPersonFare = Math.round(fare / formData.passengers);

    setEstimatedValues({
      distance: `${distance} km`,
      duration: '25 minutes',
      fare,
      perPersonFare
    });
  };

  // Format date and time for display
  const formatDateTime = () => {
    if (!formData.dateTime) return 'Now';

    const date = new Date(formData.dateTime);
    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto py-12 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h1
        className="text-3xl font-bold text-gray-900 mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Book a Group Ride
      </motion.h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">New Ride Request</h2>
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= stepNumber ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                    animate={{
                      scale: step === stepNumber ? [1, 1.1, 1] : 1,
                      backgroundColor: step >= stepNumber ? '#2563eb' : '#e5e7eb',
                      color: step >= stepNumber ? '#ffffff' : '#4b5563'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {stepNumber}
                  </motion.div>
                  {stepNumber < 3 && (
                    <motion.div
                      className="w-16 h-1 mx-2"
                      animate={{
                        backgroundColor: step > stepNumber ? '#2563eb' : '#e5e7eb'
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaCar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Ride Details</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ride Type</label>
                    <select
                      name="rideType"
                      value={formData.rideType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option>Office Commute</option>
                      <option>Event Transportation</option>
                      <option>Tour Group</option>
                      <option>Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                    <select
                      name="bookingType"
                      value={formData.bookingType}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option>Instant Booking</option>
                      <option>Scheduled</option>
                      <option>Recurring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      name="dateTime"
                      value={formData.dateTime}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Passengers</label>
                    <input
                      type="number"
                      name="passengers"
                      min="1"
                      max="20"
                      value={formData.passengers}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Preference</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      {[
                        { name: 'Bike', icon: FaMotorcycle, capacity: '1 passenger', color: 'blue' },
                        { name: 'Auto', icon: FaTaxi, capacity: '3 passengers', color: 'yellow' },
                        { name: 'Sedan', icon: FaCar, capacity: '4 passengers', color: 'green' },
                        { name: 'SUV', icon: FaCar, capacity: '6 passengers', color: 'teal' },
                        { name: 'Tempo', icon: FaShuttleVan, capacity: '8 passengers', color: 'purple' },
                        { name: 'Bus', icon: FaBus, capacity: '20+ passengers', color: 'red' }
                      ].map((vehicle, index) => (
                        <div
                          key={index}
                          className={`border ${formData.vehicleType === vehicle.name ? 'border-primary-500 bg-primary-50' : 'border-gray-300'} rounded-lg p-4 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors duration-300`}
                          onClick={() => handleVehicleSelect(vehicle.name)}
                        >
                          <div className="flex items-center mb-2">
                            <div className={`bg-${vehicle.color}-100 p-2 rounded-full mr-2`}>
                              <vehicle.icon className={`h-4 w-4 text-${vehicle.color}-600`} />
                            </div>
                            <div className="font-medium">{vehicle.name}</div>
                          </div>
                          <div className="text-sm text-gray-500">{vehicle.capacity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FaMapMarkerAlt className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Pickup & Destination</h3>
                </div>

                <div className="mt-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
                    <div className="flex">
                      <input
                        type="text"
                        name="pickupLocation"
                        value={formData.pickupLocation}
                        onChange={handleChange}
                        placeholder="Enter pickup address"
                        className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        className="bg-gray-100 px-4 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-200"
                        onClick={(e) => {
                          e.preventDefault();
                          // In a real app, this would use the browser's geolocation API
                          setFormData(prev => ({
                            ...prev,
                            pickupLocation: "Current Location (detected)"
                          }));
                        }}
                      >
                        Use Current
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Enter destination address"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saved Locations</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      {[
                        { name: 'Home', address: '123 Main St, Anytown' },
                        { name: 'Work', address: '456 Office Park, Business District' }
                      ].map((location, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors duration-300"
                        >
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.address}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg overflow-hidden">
                    {!isLoaded ? (
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-gray-500">Loading Google Maps...</p>
                      </div>
                    ) : loadError ? (
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-red-500">Error loading Google Maps: {loadError.message}</p>
                      </div>
                    ) : (
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={defaultCenter}
                        zoom={12}
                        options={{
                          zoomControl: true,
                          streetViewControl: false,
                          mapTypeControl: false,
                          fullscreenControl: false,
                        }}
                      >
                        {/* Pickup marker */}
                        {formData.pickupLocation && (
                          <Marker
                            position={defaultCenter}
                            label={{
                              text: "P",
                              color: "white",
                            }}
                            icon={{
                              url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                            }}
                          />
                        )}

                        {/* Destination marker */}
                        {formData.destination && (
                          <Marker
                            position={{
                              lat: defaultCenter.lat + 0.02,
                              lng: defaultCenter.lng + 0.02
                            }}
                            label={{
                              text: "D",
                              color: "white",
                            }}
                            icon={{
                              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                            }}
                          />
                        )}

                        {/* Route */}
                        {directionsResponse && (
                          <DirectionsRenderer
                            directions={directionsResponse}
                            options={{
                              polylineOptions: {
                                strokeColor: "#2563eb",
                                strokeWeight: 5,
                              },
                            }}
                          />
                        )}
                      </GoogleMap>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <FaCheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Review & Confirm</h3>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mt-6">
                  <h4 className="font-medium text-lg mb-4">Ride Summary</h4>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ride Type:</span>
                      <span className="font-medium">{formData.rideType}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium">{formatDateTime()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup:</span>
                      <span className="font-medium">{formData.pickupLocation}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Destination:</span>
                      <span className="font-medium">{formData.destination}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">{formData.vehicleType} ({formData.passengers} passengers)</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Distance:</span>
                      <span className="font-medium">{estimatedValues.distance}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Duration:</span>
                      <span className="font-medium">{estimatedValues.duration}</span>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-medium">Estimated Fare:</span>
                        <span className="font-bold text-primary-600">₹{estimatedValues.fare}</span>
                      </div>
                      <div className="text-sm text-gray-500 text-right">
                        ₹{estimatedValues.perPersonFare} per person with {formData.passengers} passengers
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option>Credit Card (•••• 4242)</option>
                    <option>UPI</option>
                    <option>Cash</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-primary-600 hover:text-primary-500">Terms and Conditions</a>
                  </label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between">
          {step > 1 && (
            <motion.button
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setStep(step - 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back
            </motion.button>
          )}

          <div className="flex-1"></div>

          {step < 3 ? (
            <motion.button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setStep(step + 1)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
              <FaArrowRight className="ml-2 h-4 w-4" />
            </motion.button>
          ) : (
            <motion.button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Confirm Booking
              <FaCheckCircle className="ml-2 h-4 w-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default BookRide;