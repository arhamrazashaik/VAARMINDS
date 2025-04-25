import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  MapPinIcon, 
  ClockIcon, 
  UserIcon, 
  TruckIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';

const RideDetails = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  
  useEffect(() => {
    // In a real implementation, this would fetch ride data from the API
    // For now, we'll use mock data
    const mockRide = {
      _id: id,
      type: 'office',
      status: 'confirmed',
      bookingType: 'scheduled',
      scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      vehicle: {
        type: 'van',
        make: 'Toyota',
        model: 'HiAce',
        licensePlate: 'KA-01-AB-1234',
        color: 'White',
        features: ['ac', 'wifi']
      },
      driver: {
        name: 'John Doe',
        phoneNumber: '+91 9876543210',
        ratings: {
          average: 4.8,
          count: 120
        }
      },
      passengers: [
        {
          user: {
            _id: '1',
            name: 'Alice Smith',
            phoneNumber: '+91 9876543211'
          },
          pickupLocation: {
            address: '123 Main St, Bangalore',
            coordinates: [77.5946, 12.9716]
          },
          dropoffLocation: {
            address: 'Tech Park, Whitefield, Bangalore',
            coordinates: [77.7480, 12.9698]
          },
          fare: {
            total: 350,
            currency: 'INR',
            paid: false
          }
        },
        {
          user: {
            _id: '2',
            name: 'Bob Johnson',
            phoneNumber: '+91 9876543212'
          },
          pickupLocation: {
            address: '456 Park Ave, Bangalore',
            coordinates: [77.6033, 12.9762]
          },
          dropoffLocation: {
            address: 'Tech Park, Whitefield, Bangalore',
            coordinates: [77.7480, 12.9698]
          },
          fare: {
            total: 280,
            currency: 'INR',
            paid: true
          }
        }
      ],
      route: {
        totalDistance: 18.5,
        totalDuration: 45,
        optimized: true
      },
      totalFare: 630
    };
    
    setTimeout(() => {
      setRide(mockRide);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!ride) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Ride not found</h2>
        <p className="mt-2 text-gray-600">The ride you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {ride.type.charAt(0).toUpperCase() + ride.type.slice(1)} Ride
        </h1>
        <div className="flex space-x-2">
          <Button variant="outline">Cancel Ride</Button>
          <Button>Track Ride</Button>
        </div>
      </div>
      
      {/* Status Badge */}
      <div className="mb-6">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          ride.status === 'confirmed' ? 'bg-green-100 text-green-800' :
          ride.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          ride.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
          ride.status === 'completed' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
        </span>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('details')}
          >
            Ride Details
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'passengers'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('passengers')}
          >
            Passengers
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'map'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('map')}
          >
            Map & Route
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Ride Information</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start">
                  <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Scheduled Time</h3>
                    <p className="text-sm text-gray-600">{formatDate(ride.scheduledTime)}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Pickup Location</h3>
                    <p className="text-sm text-gray-600">{ride.passengers[0].pickupLocation.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Destination</h3>
                    <p className="text-sm text-gray-600">{ride.passengers[0].dropoffLocation.address}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Fare</h3>
                    <p className="text-sm text-gray-600">₹{ride.totalFare} ({ride.passengers.length} passengers)</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader className="bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Vehicle & Driver</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-start">
                  <TruckIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Vehicle</h3>
                    <p className="text-sm text-gray-600">
                      {ride.vehicle.make} {ride.vehicle.model} ({ride.vehicle.color})
                    </p>
                    <p className="text-sm text-gray-600">
                      License Plate: {ride.vehicle.licensePlate}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Driver</h3>
                    <p className="text-sm text-gray-600">{ride.driver.name}</p>
                    <p className="text-sm text-gray-600">{ride.driver.phoneNumber}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-sm font-medium text-yellow-500">{ride.driver.ratings.average}</span>
                      <div className="ml-1 flex">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(ride.driver.ratings.average)
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 15.934l-6.18 3.254 1.18-6.875L.001 7.466l6.902-1.001L10 0l3.097 6.465 6.902 1.001-4.999 4.847 1.18 6.875z"
                            />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">
                        ({ride.driver.ratings.count} ratings)
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <Button size="sm" variant="outline">
                      Contact Driver
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
      
      {activeTab === 'passengers' && (
        <Card>
          <CardHeader className="bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Passengers ({ride.passengers.length})</h2>
          </CardHeader>
          <CardBody className="p-0">
            <div className="divide-y">
              {ride.passengers.map((passenger, index) => (
                <div key={index} className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-medium">
                          {passenger.user.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{passenger.user.name}</h3>
                        <p className="text-xs text-gray-500">{passenger.user.phoneNumber}</p>
                        <div className="mt-1 flex items-center">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500 truncate">{passenger.pickupLocation.address}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">₹{passenger.fare.total}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        passenger.fare.paid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {passenger.fare.paid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
      
      {activeTab === 'map' && (
        <Card>
          <CardHeader className="bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Route Map</h2>
          </CardHeader>
          <CardBody>
            <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
              <p className="text-gray-600">
                Map placeholder - In a real implementation, this would show a Google Map with the route
              </p>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Distance:</span>
                <span className="text-sm font-medium text-gray-900">{ride.route.totalDistance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Estimated Duration:</span>
                <span className="text-sm font-medium text-gray-900">{ride.route.totalDuration} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Route Optimization:</span>
                <span className="text-sm font-medium text-gray-900">{ride.route.optimized ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default RideDetails;
