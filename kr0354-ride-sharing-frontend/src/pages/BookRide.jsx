import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCar,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaArrowRight,
  FaArrowLeft,
  FaCheckCircle,
  FaMotorcycle,
  FaTaxi,
  FaBus,
  FaShuttleVan
} from 'react-icons/fa';
import { GoogleMap, DirectionsService, DirectionsRenderer, Autocomplete, useJsApiLoader, Marker } from '@react-google-maps/api';

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

// Helper function to get color values
const getColorClass = (color, shade) => {
  const colorMap = {
    blue: {
      '100': '#dbeafe',
      '600': '#2563eb'
    },
    yellow: {
      '100': '#fef9c3',
      '600': '#ca8a04'
    },
    green: {
      '100': '#dcfce7',
      '600': '#16a34a'
    },
    teal: {
      '100': '#ccfbf1',
      '600': '#0d9488'
    },
    purple: {
      '100': '#f3e8ff',
      '600': '#9333ea'
    },
    red: {
      '100': '#fee2e2',
      '600': '#dc2626'
    }
  };

  return colorMap[color]?.[shade] || (shade === '100' ? '#f3f4f6' : '#4b5563');
};

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
    pickupLocation: '',
    destination: '',
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
  const startRef = useRef(null);
  const endRef = useRef(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');

  // Booking state
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [showOptimization, setShowOptimization] = useState(false);
  const [optimizationDetails, setOptimizationDetails] = useState(null);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [driverDetails, setDriverDetails] = useState(null);

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

  // Generate random driver details
  const generateDriverDetails = () => {
    const drivers = [
      {
        name: "Rahul Singh",
        rating: 4.8,
        trips: 1245,
        vehicle: "Toyota Innova",
        vehicleNumber: "DL 01 AB 1234",
        vehicleColor: "White",
        phoneNumber: "+91 98765 43210",
        photo: "https://randomuser.me/api/portraits/men/32.jpg",
        eta: Math.floor(Math.random() * 5) + 2 // 2-7 minutes
      },
      {
        name: "Priya Sharma",
        rating: 4.9,
        trips: 856,
        vehicle: "Honda City",
        vehicleNumber: "DL 02 CD 5678",
        vehicleColor: "Silver",
        phoneNumber: "+91 87654 32109",
        photo: "https://randomuser.me/api/portraits/women/44.jpg",
        eta: Math.floor(Math.random() * 5) 
      },
      {
        name: "Amit Kumar",
        rating: 4.7,
        trips: 1532,
        vehicle: "Maruti Swift",
        vehicleNumber: "DL 03 EF 9012",
        vehicleColor: "Red",
        phoneNumber: "+91 76543 21098",
        photo: "https://randomuser.me/api/portraits/men/67.jpg",
        eta: Math.floor(Math.random() * 5) 
      }
    ];

    return drivers[Math.floor(Math.random() * drivers.length)];
  };


  useEffect(() => {
    console.log('Route calculation effect triggered:', { startAddress, endAddress, isLoaded });
    if (startAddress && endAddress && isLoaded) {
      console.log('Calculating route from', startAddress, 'to', endAddress);
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: startAddress,
          destination: endAddress,
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            console.log('Route calculation successful:', result);
            setDirectionsResponse(result);
            setDistance(result.routes[0].legs[0].distance.text);
            setDuration(result.routes[0].legs[0].duration.text);

            const distanceValue = parseFloat(result.routes[0].legs[0].distance.text.replace(/[^\d.]/g, ''));

            const vehicleRates = {
              'Bike': 15,
              'Auto': 20,
              'Sedan': 25,
              'SUV': 30,
              'Tempo': 35,
              'Bus': 50
            };
            const rate = vehicleRates[formData.vehicleType] || vehicleRates['Sedan'];
            const fare = Math.round(distanceValue * rate);
            const perPersonFare = Math.round(fare / formData.passengers);

            const newEstimatedValues = {
              distance: result.routes[0].legs[0].distance.text,
              duration: result.routes[0].legs[0].duration.text,
              fare,
              perPersonFare
            };

            console.log('Updated estimated values:', newEstimatedValues);
            setEstimatedValues(newEstimatedValues);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    }
  }, [startAddress, endAddress, isLoaded, formData.vehicleType, formData.passengers]);

  // Handle confirm booking
  const handleConfirmBooking = () => {
    // Show loading state
    setIsBookingConfirmed(true);

    // Simulate API call delay
    setTimeout(() => {
      // Generate route optimization details
      const optimizationData = {
        originalRoute: {
          distance: estimatedValues.distance,
          duration: estimatedValues.duration,
          fare: estimatedValues.fare
        },
        optimizedRoute: {
          distance: `${(parseFloat(estimatedValues.distance.replace(/[^\d.]/g, '')) * 0.85).toFixed(1)} km`,
          duration: `${Math.round(parseInt(estimatedValues.duration.replace(/[^\d]/g, '')) * 0.85)} minutes`,
          fare: Math.round(estimatedValues.fare * 0.85)
        },
        savings: {
          distance: `${(parseFloat(estimatedValues.distance.replace(/[^\d.]/g, '')) * 0.15).toFixed(1)} km`,
          duration: `${Math.round(parseInt(estimatedValues.duration.replace(/[^\d]/g, '')) * 0.15)} minutes`,
          fare: Math.round(estimatedValues.fare * 0.15),
          fuel: `${(parseFloat(estimatedValues.distance.replace(/[^\d.]/g, '')) * 0.15 * 0.1).toFixed(1)} liters`,
          co2: `${(parseFloat(estimatedValues.distance.replace(/[^\d.]/g, '')) * 0.15 * 2.3).toFixed(1)} kg`
        },
        percentImprovement: {
          distance: "15%",
          duration: "15%",
          fare: "15%"
        }
      };

      // Set optimization details
      setOptimizationDetails(optimizationData);

      // Show optimization modal
      setShowOptimization(true);

      // After 3 seconds, show driver acceptance
      setTimeout(() => {
        // Hide optimization modal
        setShowOptimization(false);

        // Generate driver details
        const driver = generateDriverDetails();

        // Set driver details
        setDriverDetails(driver);

        // Show driver modal
        setShowDriverModal(true);
      }, 10000);
    }, 1500);
  };

  return (
    <div
      className="max-w-4xl mx-auto py-12 px-4 relative"
    >
      <h1
        className="text-4xl font-bold font-heading mb-8 text-primary-600"
      >
        Book a Group Ride
      </h1>

      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200"
      >
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h2 className="text-xl font-semibold font-heading text-primary-600 mb-4 sm:mb-0">New Ride Request</h2>
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-base ${
                      step >= stepNumber ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className="w-16 h-1 mx-2"
                      style={{ backgroundColor: step > stepNumber ? '#0ea5e9' : '#e5e7eb' }}
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
              <div
                key="step1"
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
                            <div className={`bg-gray-100 p-2 rounded-full mr-2`} style={{ backgroundColor: getColorClass(vehicle.color, '100') }}>
                              <vehicle.icon className={`h-4 w-4 text-gray-600`} style={{ color: getColorClass(vehicle.color, '600') }} />
                            </div>
                            <div className="font-medium">{vehicle.name}</div>
                          </div>
                          <div className="text-sm text-gray-500">{vehicle.capacity}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div
                key="step2"
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
                      {isLoaded ? (
                        <Autocomplete
                          onLoad={autocomplete => startRef.current = autocomplete}
                          onPlaceChanged={() => {
                            if (startRef.current) {
                              const place = startRef.current.getPlace();
                              console.log('Pickup place selected:', place);
                              if (place && place.formatted_address) {
                                console.log('Setting pickup address:', place.formatted_address);
                                setStartAddress(place.formatted_address);
                                setFormData(prev => ({
                                  ...prev,
                                  pickupLocation: place.formatted_address
                                }));
                              }
                            }
                          }}
                          className="flex-1"
                        >
                          <input
                            type="text"
                            name="pickupLocation"
                            value={formData.pickupLocation}
                            onChange={(e) => {
                              console.log('Pickup input changed:', e.target.value);
                              setFormData(prev => ({
                                ...prev,
                                pickupLocation: e.target.value
                              }));
                            }}
                            placeholder="Enter pickup address"
                            className="w-full border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          />
                        </Autocomplete>
                      ) : (
                        <input
                          type="text"
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleChange}
                          placeholder="Enter pickup address"
                          className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      )}
                      <button
                        className="bg-gray-100 px-4 rounded-r-md border border-l-0 border-gray-300 hover:bg-gray-200"
                        onClick={(e) => {
                          e.preventDefault();
                          // In a real app, this would use the browser's geolocation API
                          if (navigator.geolocation && isLoaded) {
                            navigator.geolocation.getCurrentPosition(
                              (position) => {
                                const geocoder = new window.google.maps.Geocoder();
                                const latlng = {
                                  lat: position.coords.latitude,
                                  lng: position.coords.longitude
                                };
                                geocoder.geocode({ location: latlng }, (results, status) => {
                                  if (status === "OK" && results[0]) {
                                    const currentAddress = results[0].formatted_address;
                                    setStartAddress(currentAddress);
                                    setFormData(prev => ({
                                      ...prev,
                                      pickupLocation: currentAddress
                                    }));
                                  }
                                });
                              },
                              () => {
                                const fallbackAddress = "Current Location (detected)";
                                setStartAddress(fallbackAddress);
                                setFormData(prev => ({
                                  ...prev,
                                  pickupLocation: fallbackAddress
                                }));
                              }
                            );
                          } else {
                            const fallbackAddress = "Current Location (detected)";
                            setStartAddress(fallbackAddress);
                            setFormData(prev => ({
                              ...prev,
                              pickupLocation: fallbackAddress
                            }));
                          }
                        }}
                      >
                        Use Current
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={autocomplete => endRef.current = autocomplete}
                        onPlaceChanged={() => {
                          if (endRef.current) {
                            const place = endRef.current.getPlace();
                            console.log('Destination place selected:', place);
                            if (place && place.formatted_address) {
                              console.log('Setting destination address:', place.formatted_address);
                              setEndAddress(place.formatted_address);
                              setFormData(prev => ({
                                ...prev,
                                destination: place.formatted_address
                              }));
                            }
                          }
                        }}
                      >
                        <input
                          type="text"
                          name="destination"
                          value={formData.destination}
                          onChange={(e) => {
                            console.log('Destination input changed:', e.target.value);
                            setFormData(prev => ({
                              ...prev,
                              destination: e.target.value
                            }));
                          }}
                          placeholder="Enter destination address"
                          className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        />
                      </Autocomplete>
                    ) : (
                      <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="Enter destination address"
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    )}
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
                          onClick={() => {
                            // Set as pickup if pickup is empty, otherwise set as destination
                            if (!formData.pickupLocation) {
                              setStartAddress(location.address);
                              setFormData(prev => ({
                                ...prev,
                                pickupLocation: location.address
                              }));
                            } else {
                              setEndAddress(location.address);
                              setFormData(prev => ({
                                ...prev,
                                destination: location.address
                              }));
                            }
                          }}
                        >
                          <div className="font-medium">{location.name}</div>
                          <div className="text-sm text-gray-500">{location.address}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg overflow-hidden">
                    {loadError ? (
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-red-500">Error loading Google Maps: {loadError.message}</p>
                      </div>
                    ) : !isLoaded ? (
                      <div className="h-[300px] flex items-center justify-center">
                        <p className="text-gray-500">Loading Google Maps...</p>
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
              </div>
            )}

            {step === 3 && (
              <div
                key="step3"
                className="space-y-6"
              >
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <FaCheckCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Review & Confirm</h3>
                </div>

                <div
                  className="bg-gray-50 rounded-lg p-6 mt-6"
                >
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
                      <span className="font-medium">{formData.pickupLocation || 'Not selected'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Destination:</span>
                      <span className="font-medium">{formData.destination || 'Not selected'}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">{formData.vehicleType} ({formData.passengers} passengers)</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Distance:</span>
                      <span className="font-medium">
                        {!formData.pickupLocation || !formData.destination
                          ? 'Enter locations'
                          : estimatedValues.distance || 'Calculating...'}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Duration:</span>
                      <span className="font-medium">
                        {!formData.pickupLocation || !formData.destination
                          ? 'Enter locations'
                          : estimatedValues.duration || 'Calculating...'}
                      </span>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-medium">Estimated Fare:</span>
                        <span className="font-bold text-primary-600">
                          {!formData.pickupLocation || !formData.destination
                            ? 'Enter locations'
                            : estimatedValues.fare ? `₹${estimatedValues.fare}` : 'Calculating...'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 text-right">
                        {!formData.pickupLocation || !formData.destination
                          ? 'Please enter pickup and destination'
                          : estimatedValues.perPersonFare
                            ? `₹${estimatedValues.perPersonFare} per person with ${formData.passengers} passengers`
                            : 'Calculating fare...'}
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
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t flex justify-between">
          {step > 1 && (
            <button
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setStep(step - 1)}
            >
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Back
            </button>
          )}

          <div className="flex-1"></div>

          {step < 3 ? (
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={() => setStep(step + 1)}
            >
              Continue
              <FaArrowRight className="ml-2 h-4 w-4" />
            </button>
          ) : (
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              onClick={handleConfirmBooking}
              disabled={isBookingConfirmed}
            >
              {isBookingConfirmed ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Confirm Booking
                  <FaCheckCircle className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Route Optimization Modal */}
      {showOptimization && optimizationDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Real-Time Route Optimization</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowOptimization(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                <div className="flex items-center mb-2">
                  <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold text-green-800">Optimization Complete!</h3>
                </div>
                <p className="text-green-700">
                  Our AI has analyzed traffic patterns, historical data, and current conditions to optimize your route.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="font-semibold text-gray-700 mb-2">Original Route</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span>{optimizationDetails.originalRoute.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span>{optimizationDetails.originalRoute.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Fare:</span>
                      <span>₹{optimizationDetails.originalRoute.fare}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-700 mb-2">Optimized Route</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-blue-600">Distance:</span>
                      <span className="font-medium">{optimizationDetails.optimizedRoute.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Duration:</span>
                      <span className="font-medium">{optimizationDetails.optimizedRoute.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-600">Fare:</span>
                      <span className="font-medium">₹{optimizationDetails.optimizedRoute.fare}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 mb-6">
                <h3 className="font-semibold text-indigo-700 mb-3">Your Savings</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-600">{optimizationDetails.percentImprovement.distance}</div>
                    <div className="text-sm text-gray-600">Distance</div>
                    <div className="text-xs text-indigo-500">{optimizationDetails.savings.distance} saved</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-600">{optimizationDetails.percentImprovement.duration}</div>
                    <div className="text-sm text-gray-600">Time</div>
                    <div className="text-xs text-indigo-500">{optimizationDetails.savings.duration} saved</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-600">{optimizationDetails.percentImprovement.fare}</div>
                    <div className="text-sm text-gray-600">Cost</div>
                    <div className="text-xs text-indigo-500">₹{optimizationDetails.savings.fare} saved</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{optimizationDetails.savings.fuel}</div>
                    <div className="text-sm text-gray-600">Fuel Saved</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{optimizationDetails.savings.co2}</div>
                    <div className="text-sm text-gray-600">CO₂ Reduction</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <p className="text-gray-500 italic">Finding you a driver...</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Driver Acceptance Modal */}
      {showDriverModal && driverDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Driver Assigned!</h2>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDriverModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex items-center mb-6">
                <img
                  src={driverDetails.photo}
                  alt={driverDetails.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-lg">{driverDetails.name}</h3>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400 mr-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${i < Math.floor(driverDetails.rating) ? 'fill-current' : 'stroke-current fill-none'}`} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 text-sm">{driverDetails.rating} • {driverDetails.trips} trips</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">ETA:</span>
                  </div>
                  <span className="font-bold text-blue-700">{driverDetails.eta} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="font-medium">OTP:</span>
                  </div>
                  <span className="font-bold text-blue-700">{Math.floor(1000 + Math.random() * 9000)}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex">
                  <div className="w-24 text-gray-600">Vehicle:</div>
                  <div className="font-medium">{driverDetails.vehicle} ({driverDetails.vehicleColor})</div>
                </div>
                <div className="flex">
                  <div className="w-24 text-gray-600">Number:</div>
                  <div className="font-medium">{driverDetails.vehicleNumber}</div>
                </div>
                <div className="flex">
                  <div className="w-24 text-gray-600">Phone:</div>
                  <div className="font-medium">{driverDetails.phoneNumber}</div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  className="flex-1 px-5 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
                  onClick={() => setShowDriverModal(false)}
                >
                  Call Driver
                </button>
                <button
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-medium hover:from-primary-600 hover:to-primary-700 transition-all duration-300"
                  onClick={() => setShowDriverModal(false)}
                >
                  Track Ride
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookRide;