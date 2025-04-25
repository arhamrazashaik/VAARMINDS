import { useState, useContext } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import AuthContext from '../context/AuthContext';
import AlertContext from '../context/AlertContext';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const { addAlert } = useContext(AlertContext);
  
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    profilePicture: user?.profilePicture || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await updateProfile(formData);
      
      if (result.success) {
        addAlert('Profile updated successfully', 'success');
        setIsEditing(false);
      } else {
        addAlert(result.error || 'Failed to update profile', 'error');
      }
    } catch (error) {
      addAlert('An error occurred while updating profile', 'error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        {activeTab === 'personal' && !isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
        {activeTab === 'personal' && isEditing && (
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'personal'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Information
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'locations'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('locations')}
          >
            Saved Locations
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('payment')}
          >
            Payment Methods
          </button>
          <button
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'preferences'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      {activeTab === 'personal' && (
        <Card>
          <CardBody>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                <div className="relative">
                  {user?.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={user.name}
                      className="h-32 w-32 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-32 w-32 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserIcon className="h-16 w-16 text-primary-600" />
                    </div>
                  )}
                  {isEditing && (
                    <button
                      className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  )}
                </div>
                {!isEditing && (
                  <div className="mt-4 text-center">
                    <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
                    <p className="text-gray-600">{user?.email}</p>
                  </div>
                )}
              </div>
              
              <div className="md:w-2/3 md:pl-8">
                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <Input
                      label="Full Name"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      icon={UserIcon}
                      required
                    />
                    
                    <Input
                      label="Email Address"
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      icon={EnvelopeIcon}
                      required
                    />
                    
                    <Input
                      label="Phone Number"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      icon={PhoneIcon}
                      required
                    />
                    
                    <Input
                      label="Profile Picture URL"
                      id="profilePicture"
                      name="profilePicture"
                      value={formData.profilePicture}
                      onChange={handleChange}
                      placeholder="https://example.com/image.jpg"
                    />
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <UserIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Full Name</h3>
                        <p className="text-sm text-gray-600">{user?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Address</h3>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <PhoneIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Phone Number</h3>
                        <p className="text-sm text-gray-600">{user?.phoneNumber}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <Button variant="outline">
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      )}
      
      {activeTab === 'locations' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Saved Locations</h2>
                <Button size="sm">
                  Add New Location
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {user?.savedLocations && user.savedLocations.length > 0 ? (
                <div className="divide-y">
                  {user.savedLocations.map((location, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{location.name}</h3>
                            <p className="text-sm text-gray-600">{location.address}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <MapPinIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No saved locations</h3>
                  <p className="mt-1 text-gray-500">Add your frequently visited places for quicker booking</p>
                  <div className="mt-6">
                    <Button>
                      Add Home Address
                    </Button>
                    <Button className="ml-4" variant="outline">
                      Add Work Address
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
      
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                <Button size="sm">
                  Add Payment Method
                </Button>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              {user?.paymentMethods && user.paymentMethods.length > 0 ? (
                <div className="divide-y">
                  {user.paymentMethods.map((method, index) => (
                    <div key={index} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start">
                          <CreditCardIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {method.type === 'card' ? 'Credit/Debit Card' : 
                               method.type === 'upi' ? 'UPI' : 'Net Banking'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {method.type === 'card' ? `**** **** **** ${method.details.last4}` : 
                               method.type === 'upi' ? method.details.upiId : 
                               method.details.bankName}
                            </p>
                            {method.isDefault && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <CreditCardIcon className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No payment methods</h3>
                  <p className="mt-1 text-gray-500">Add a payment method to make booking easier</p>
                  <div className="mt-6">
                    <Button>
                      Add Payment Method
                    </Button>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
      
      {activeTab === 'preferences' && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Notification Preferences</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <BellIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive ride updates and group messages via email</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      defaultChecked={user?.preferences?.notifications?.email}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <BellIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                      <p className="text-sm text-gray-600">Receive real-time alerts on your device</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      defaultChecked={user?.preferences?.notifications?.push}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <BellIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                      <p className="text-sm text-gray-600">Receive text messages for important updates</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      defaultChecked={user?.preferences?.notifications?.sms}
                    />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader className="bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Appearance</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-900">Theme</label>
                  <div className="mt-2">
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="light"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          defaultChecked={user?.preferences?.theme === 'light'}
                        />
                        <span className="ml-2 text-sm text-gray-700">Light</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="dark"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          defaultChecked={user?.preferences?.theme === 'dark'}
                        />
                        <span className="ml-2 text-sm text-gray-700">Dark</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="theme"
                          value="system"
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                          defaultChecked={user?.preferences?.theme === 'system'}
                        />
                        <span className="ml-2 text-sm text-gray-700">System</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
          
          <Card>
            <CardHeader className="bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">Privacy & Security</h2>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Enable
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Location Sharing</h3>
                      <p className="text-sm text-gray-600">Control when your location is shared with others</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-start">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Data Privacy</h3>
                      <p className="text-sm text-gray-600">Manage your personal data and privacy settings</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Manage
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
