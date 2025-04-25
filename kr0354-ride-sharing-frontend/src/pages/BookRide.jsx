import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCar, FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaMoneyBillWave, FaArrowRight, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';

const BookRide = () => {
  const [step, setStep] = useState(1);

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
                    <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                      <option>Office Commute</option>
                      <option>Event Transportation</option>
                      <option>Tour Group</option>
                      <option>Custom</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking Type</label>
                    <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
                      <option>Instant Booking</option>
                      <option>Scheduled</option>
                      <option>Recurring</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                    <input
                      type="datetime-local"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Number of Passengers</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      defaultValue="4"
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Preference</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                      {[
                        { name: 'Sedan', capacity: '4 passengers' },
                        { name: 'SUV', capacity: '6 passengers' },
                        { name: 'Van', capacity: '12 passengers' }
                      ].map((vehicle, index) => (
                        <div
                          key={index}
                          className="border border-gray-300 rounded-lg p-4 cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors duration-300"
                        >
                          <div className="font-medium">{vehicle.name}</div>
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
                        placeholder="Enter pickup address"
                        className="flex-1 border border-gray-300 rounded-l-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button className="bg-gray-100 px-4 rounded-r-md border border-l-0 border-gray-300">
                        Use Current
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
                    <input
                      type="text"
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

                  <div className="bg-gray-100 p-4 rounded-lg text-center text-gray-500">
                    Map preview would appear here with Google Maps integration
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
                      <span className="font-medium">Office Commute</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium">May 15, 2023 - 9:00 AM</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Pickup:</span>
                      <span className="font-medium">123 Main St, Anytown</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Destination:</span>
                      <span className="font-medium">456 Office Park, Business District</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle:</span>
                      <span className="font-medium">SUV (6 passengers)</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Distance:</span>
                      <span className="font-medium">12.5 km</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Duration:</span>
                      <span className="font-medium">25 minutes</span>
                    </div>

                    <div className="border-t pt-4 mt-4">
                      <div className="flex justify-between text-lg">
                        <span className="font-medium">Estimated Fare:</span>
                        <span className="font-bold text-primary-600">₹450</span>
                      </div>
                      <div className="text-sm text-gray-500 text-right">
                        ₹75 per person with 6 passengers
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <select className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500">
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
