import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const CreateGroup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'office',
    isPublic: true,
    origin: {
      address: ''
    },
    destination: {
      address: ''
    },
    schedule: {
      recurring: {
        isRecurring: false,
        frequency: 'weekdays',
        days: [1, 2, 3, 4, 5],
        time: '09:00'
      }
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleRecurringChange = (e) => {
    const { checked } = e.target;
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        recurring: {
          ...formData.schedule.recurring,
          isRecurring: checked
        }
      }
    });
  };

  const handleFrequencyChange = (e) => {
    const { value } = e.target;
    let days = [];

    if (value === 'weekdays') {
      days = [1, 2, 3, 4, 5]; // Monday to Friday
    } else if (value === 'daily') {
      days = [0, 1, 2, 3, 4, 5, 6]; // All days
    } else if (value === 'weekly') {
      days = [1]; // Just Monday by default
    }

    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        recurring: {
          ...formData.schedule.recurring,
          frequency: value,
          days
        }
      }
    });
  };

  const handleTimeChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      schedule: {
        ...formData.schedule,
        recurring: {
          ...formData.schedule.recurring,
          time: value
        }
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // In a real implementation, this would call the API to create a group
      // For now, we'll simulate a successful creation
      console.log('Creating group with data:', formData);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to the groups page
      navigate('/groups');
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <div className="flex items-center mb-8">
        <Link to="/groups" className="mr-4">
          <Button variant="outline" icon={ArrowLeftIcon} size="sm" className="border-primary-300 text-primary-700 hover:bg-primary-50">
            Back to Groups
          </Button>
        </Link>
        <h1 className="text-4xl font-bold text-gray-900">Create New Group</h1>
      </div>

      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <h2 className="text-xl font-semibold">Group Information</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Group Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Tech Park Commuters"
                required
              />

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  className="input"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the purpose of your group..."
                ></textarea>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                  Group Type
                </label>
                <select
                  id="type"
                  name="type"
                  className="input"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="office">Office Commute</option>
                  <option value="event">Event</option>
                  <option value="tour">Weekend/Tour</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={formData.isPublic}
                  onChange={handleChange}
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                  Make this group public (visible to all users)
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-medium text-primary-700 mb-4 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                Route Information
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <Input
                  label="Origin Location"
                  id="origin.address"
                  name="origin.address"
                  value={formData.origin.address}
                  onChange={handleChange}
                  placeholder="e.g., Indiranagar, Bangalore"
                  icon={MapPinIcon}
                />

                <Input
                  label="Destination Location"
                  id="destination.address"
                  name="destination.address"
                  value={formData.destination.address}
                  onChange={handleChange}
                  placeholder="e.g., Whitefield Tech Park, Bangalore"
                  icon={MapPinIcon}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-xl font-medium text-primary-700 mb-4 flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Schedule
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRecurring"
                    name="isRecurring"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    checked={formData.schedule.recurring.isRecurring}
                    onChange={handleRecurringChange}
                  />
                  <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-700">
                    This is a recurring group
                  </label>
                </div>

                {formData.schedule.recurring.isRecurring && (
                  <div className="pl-6 space-y-4 border-l-2 border-gray-100">
                    <div>
                      <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-1">
                        Frequency
                      </label>
                      <select
                        id="frequency"
                        name="frequency"
                        className="input"
                        value={formData.schedule.recurring.frequency}
                        onChange={handleFrequencyChange}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekdays">Weekdays (Mon-Fri)</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        className="input"
                        value={formData.schedule.recurring.time}
                        onChange={handleTimeChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link to="/groups">
                <Button
                  variant="outline"
                  type="button"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                icon={CheckIcon}
                disabled={loading}
                className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-6"
              >
                {loading ? 'Creating...' : 'Create Group'}
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default CreateGroup;
