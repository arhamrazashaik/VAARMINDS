import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Card, CardBody, CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const PublicGroups = () => {
  const [publicGroups, setPublicGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // In a real implementation, this would fetch public groups from the API
    // For now, we'll use mock data
    const mockPublicGroups = [
      {
        _id: '1',
        name: 'Tech Park Commuters',
        description: 'Daily office commute to Whitefield Tech Park. We share rides to save costs and reduce traffic congestion.',
        type: 'office',
        members: new Array(12).fill(null),
        destination: {
          address: 'Whitefield Tech Park, Bangalore'
        },
        schedule: {
          recurring: {
            isRecurring: true,
            frequency: 'weekdays'
          }
        },
        isPublic: true
      },
      {
        _id: '2',
        name: 'Weekend Getaway Group',
        description: 'Group for weekend trips to nearby destinations like Nandi Hills, Mysore, and other tourist spots around Bangalore.',
        type: 'tour',
        members: new Array(8).fill(null),
        destination: {
          address: 'Various locations'
        },
        schedule: {
          recurring: {
            isRecurring: false
          }
        },
        isPublic: true
      },
      {
        _id: '3',
        name: 'Concert Goers',
        description: 'Group for attending concerts and music events in the city. Save on transportation and parking by sharing rides.',
        type: 'event',
        members: new Array(15).fill(null),
        destination: {
          address: 'Various event venues'
        },
        schedule: {
          recurring: {
            isRecurring: false
          }
        },
        isPublic: true
      },
      {
        _id: '4',
        name: 'Airport Travelers',
        description: 'Share rides to and from the airport. Perfect for frequent flyers and business travelers.',
        type: 'custom',
        members: new Array(6).fill(null),
        destination: {
          address: 'Kempegowda International Airport'
        },
        schedule: {
          recurring: {
            isRecurring: false
          }
        },
        isPublic: true
      },
      {
        _id: '5',
        name: 'College Carpool',
        description: 'For students and faculty commuting to university campuses. Save money and make friends on your daily commute.',
        type: 'education',
        members: new Array(10).fill(null),
        destination: {
          address: 'Various college campuses'
        },
        schedule: {
          recurring: {
            isRecurring: true,
            frequency: 'weekdays'
          }
        },
        isPublic: true
      },
      {
        _id: '6',
        name: 'Shopping Mall Trips',
        description: 'Weekend trips to major shopping malls. Share rides, shop together, and split parking costs.',
        type: 'leisure',
        members: new Array(7).fill(null),
        destination: {
          address: 'Major shopping malls'
        },
        schedule: {
          recurring: {
            isRecurring: true,
            frequency: 'weekly'
          }
        },
        isPublic: true
      }
    ];

    setTimeout(() => {
      setPublicGroups(mockPublicGroups);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and search groups
  const filteredGroups = publicGroups.filter(group => {
    const matchesFilter = filter === 'all' || group.type === filter;
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center mb-6">
        <Link to="/groups" className="mr-4">
          <Button variant="outline" icon={ArrowLeftIcon} size="sm">
            Back to My Groups
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Explore Public Groups</h1>
      </div>

      <Card className="mb-8 shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
          <h2 className="text-xl font-semibold">Find Groups Near You</h2>
        </CardHeader>
        <CardBody className="p-6 bg-gradient-to-b from-white to-gray-50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-2/3">
              <Input
                type="text"
                placeholder="Search public groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={MagnifyingGlassIcon}
                className="shadow-md focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              />
            </div>
            <div className="md:w-1/3">
              <select
                className="input shadow-md focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="office">Office</option>
                <option value="event">Event</option>
                <option value="tour">Tour/Weekend</option>
                <option value="education">Education</option>
                <option value="leisure">Leisure</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Groups List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map(group => (
            <Link key={group._id} to={`/groups/${group._id}`}>
              <Card hover className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 overflow-hidden">
                <div className={`h-2 w-full ${
                  group.type === 'office' ? 'bg-primary-600' :
                  group.type === 'event' ? 'bg-accent-600' :
                  group.type === 'tour' ? 'bg-emerald-600' :
                  group.type === 'education' ? 'bg-gold-500' :
                  group.type === 'leisure' ? 'bg-secondary-500' :
                  'bg-dark-600'
                }`}></div>
                <CardBody className="p-6">
                  <div className="flex items-start mb-4">
                    <div className={`p-3 rounded-full mr-4 ${
                      group.type === 'office' ? 'bg-primary-100 text-primary-600' :
                      group.type === 'event' ? 'bg-accent-100 text-accent-600' :
                      group.type === 'tour' ? 'bg-emerald-100 text-emerald-600' :
                      group.type === 'education' ? 'bg-gold-100 text-gold-600' :
                      group.type === 'leisure' ? 'bg-secondary-100 text-secondary-600' :
                      'bg-dark-100 text-dark-600'
                    }`}>
                      <UserGroupIcon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{group.name}</h3>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full text-white capitalize ${
                        group.type === 'office' ? 'bg-primary-500' :
                        group.type === 'event' ? 'bg-accent-500' :
                        group.type === 'tour' ? 'bg-emerald-500' :
                        group.type === 'education' ? 'bg-gold-500' :
                        group.type === 'leisure' ? 'bg-secondary-500' :
                        'bg-dark-500'
                      }`}>
                        {group.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{group.description}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      {group.members.length} members
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {group.destination.address}
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {group.schedule.recurring.isRecurring
                        ? `Recurring (${group.schedule.recurring.frequency})`
                        : 'Non-recurring'}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button
                      size="sm"
                      className={`w-full ${
                        group.type === 'office' ? 'bg-primary-600 hover:bg-primary-700' :
                        group.type === 'event' ? 'bg-accent-600 hover:bg-accent-700' :
                        group.type === 'tour' ? 'bg-emerald-600 hover:bg-emerald-700' :
                        group.type === 'education' ? 'bg-gold-600 hover:bg-gold-700' :
                        group.type === 'leisure' ? 'bg-secondary-600 hover:bg-secondary-700' :
                        'bg-dark-600 hover:bg-dark-700'
                      }`}
                    >
                      Join Group
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <UserGroupIcon className="h-12 w-12 mx-auto text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No groups found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      <div className="text-center py-12 bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl shadow-inner mt-12 px-6">
        <div className="max-w-md mx-auto">
          <h3 className="text-2xl font-bold text-primary-800 mb-3">Don't see a group that fits your needs?</h3>
          <p className="text-gray-600 mb-6">Create your own group and invite others to join. It's easy and takes just a few minutes.</p>
          <Link to="/groups/create">
            <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 px-8 py-3">
              Create Your Own Group
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PublicGroups;
