import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserGroupIcon,
  MapPinIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  PencilIcon,
  ArrowRightIcon,
  ChartBarIcon,
  PlusIcon,
  MapIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { Card, CardHeader, CardBody, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import MapComponent from '../components/common/MapComponent';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';

const GroupDetails = () => {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  // Poll creation state
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [pollTitle, setPollTitle] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [pollDuration, setPollDuration] = useState('7'); // Default 7 days
  const [pollDurationHours, setPollDurationHours] = useState('24'); // Default 24 hours
  const [isCreatingPoll, setIsCreatingPoll] = useState(false);

  // Poll voting state
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [currentPoll, setCurrentPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isVoting, setIsVoting] = useState(false);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);

  // Chat state
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatBodyRef = useRef(null);

  useEffect(() => {
    // In a real implementation, this would fetch group data from the API
    // For now, we'll use mock data
    const mockGroup = {
      _id: id,
      name: 'Tech Park Commuters',
      description: 'Daily office commute to Whitefield Tech Park. We share rides to save costs and reduce traffic congestion. Join us if you work in the Whitefield area!',
      type: 'office',
      creator: {
        _id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg'
      },
      members: [
        {
          user: {
            _id: '1',
            name: 'John Doe',
            profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          role: 'admin',
          joinedAt: '2023-01-15T10:30:00Z'
        },
        {
          user: {
            _id: '2',
            name: 'Alice Smith',
            profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg'
          },
          role: 'member',
          joinedAt: '2023-01-20T14:45:00Z'
        },
        {
          user: {
            _id: '3',
            name: 'Bob Johnson',
            profilePicture: 'https://randomuser.me/api/portraits/men/46.jpg'
          },
          role: 'member',
          joinedAt: '2023-02-05T09:15:00Z'
        },
        {
          user: {
            _id: '4',
            name: 'Emily Davis',
            profilePicture: 'https://randomuser.me/api/portraits/women/67.jpg'
          },
          role: 'member',
          joinedAt: '2023-02-10T11:30:00Z'
        }
      ],
      destination: {
        address: 'Whitefield Tech Park, Bangalore',
        coordinates: [77.7480, 12.9698]
      },
      origin: {
        address: 'Indiranagar, Bangalore',
        coordinates: [77.6410, 12.9784]
      },
      schedule: {
        startDate: '2023-01-15T00:00:00Z',
        endDate: null,
        recurring: {
          isRecurring: true,
          frequency: 'weekdays',
          days: [1, 2, 3, 4, 5],
          time: '09:00'
        }
      },
      rides: [
        {
          _id: 'r1',
          scheduledTime: '2023-04-10T09:00:00Z',
          status: 'completed'
        },
        {
          _id: 'r2',
          scheduledTime: '2023-04-11T09:00:00Z',
          status: 'completed'
        },
        {
          _id: 'r3',
          scheduledTime: '2023-04-12T09:00:00Z',
          status: 'completed'
        },
        {
          _id: 'r4',
          scheduledTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'confirmed'
        }
      ],
      chat: {
        messages: [
          {
            sender: {
              _id: '1',
              name: 'John Doe',
              profilePicture: 'https://randomuser.me/api/portraits/men/32.jpg'
            },
            content: 'Good morning everyone! Ready for today\'s ride?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
          },
          {
            sender: {
              _id: '2',
              name: 'Alice Smith',
              profilePicture: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            content: 'Yes, I\'ll be at the pickup point on time.',
            timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
          },
          {
            sender: {
              _id: '3',
              name: 'Bob Johnson',
              profilePicture: 'https://randomuser.me/api/portraits/men/46.jpg'
            },
            content: 'I might be 5 minutes late, traffic is heavy today.',
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      polls: [
        {
          _id: 'p1',
          title: 'Preferred pickup time',
          options: [
            { text: '8:30 AM', votes: 1 },
            { text: '9:00 AM', votes: 2 },
            { text: '9:30 AM', votes: 1 }
          ],
          isActive: false
        }
      ],
      settings: {
        fareCalculation: 'distance-based'
      },
      isPublic: true
    };

    setTimeout(() => {
      setGroup(mockGroup);
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

  if (!group) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Group not found</h2>
        <p className="mt-2 text-gray-600">The group you're looking for doesn't exist or has been removed.</p>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get upcoming rides
  const upcomingRides = group.rides.filter(ride =>
    new Date(ride.scheduledTime) > new Date() &&
    (ride.status === 'pending' || ride.status === 'confirmed')
  );

  // Poll creation functions
  const openPollModal = () => {
    setPollTitle('');
    setPollOptions(['', '']);
    setPollDuration('7');
    setIsPollModalOpen(true);
  };

  const closePollModal = () => {
    setIsPollModalOpen(false);
  };

  const handlePollTitleChange = (e) => {
    setPollTitle(e.target.value);
  };

  const handlePollOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const removePollOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    }
  };

  const handlePollDurationChange = (e) => {
    setPollDuration(e.target.value);
  };

  const handlePollDurationHoursChange = (e) => {
    setPollDurationHours(e.target.value);
  };

  const createPoll = () => {
    // Validate inputs
    if (!pollTitle.trim()) {
      alert('Please enter a poll title');
      return;
    }

    const validOptions = pollOptions.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      alert('Please enter at least 2 options');
      return;
    }

    setIsCreatingPoll(true);

    // Create new poll object
    const newPoll = {
      _id: Date.now().toString(), // Generate a unique ID
      title: pollTitle.trim(),
      options: validOptions.map(option => ({
        text: option.trim(),
        votes: 0
      })),
      isActive: true,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (parseInt(pollDuration) * 24 * 60 * 60 * 1000) + (parseInt(pollDurationHours) * 60 * 60 * 1000)).toISOString()
    };

    // Update group state with new poll
    setGroup(prevGroup => ({
      ...prevGroup,
      polls: [newPoll, ...prevGroup.polls]
    }));

    // Close modal and reset state
    setIsCreatingPoll(false);
    closePollModal();
  };

  // Poll voting functions
  const openVotingModal = (poll) => {
    setCurrentPoll(poll);
    setSelectedOption(null);
    setIsVotingModalOpen(true);
  };

  const closeVotingModal = () => {
    setIsVotingModalOpen(false);
    setCurrentPoll(null);
    setSelectedOption(null);
  };

  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };

  const submitVote = () => {
    if (selectedOption === null) {
      alert('Please select an option to vote');
      return;
    }

    setIsVoting(true);

    // Update the poll with the new vote
    setGroup(prevGroup => {
      const updatedPolls = prevGroup.polls.map(poll => {
        if (poll._id === currentPoll._id) {
          const updatedOptions = poll.options.map((option, index) => {
            if (index === selectedOption) {
              return { ...option, votes: option.votes + 1 };
            }
            return option;
          });

          return { ...poll, options: updatedOptions };
        }
        return poll;
      });

      return { ...prevGroup, polls: updatedPolls };
    });

    // Show success message and then close modal
    setTimeout(() => {
      setIsVoting(false);
      setShowVoteSuccess(true);

      // Close modal after showing success message
      setTimeout(() => {
        setShowVoteSuccess(false);
        closeVotingModal();
      }, 1500);
    }, 800); // Add a delay to show the loading state
  };

  // Chat functionality
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    setIsSendingMessage(true);

    // Create a new message object
    const message = {
      sender: {
        _id: '1', // Assuming the current user is the first member
        name: group.members[0].user.name,
        profilePicture: group.members[0].user.profilePicture
      },
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // Update the group state with the new message
    setGroup(prevGroup => ({
      ...prevGroup,
      chat: {
        ...prevGroup.chat,
        messages: [...prevGroup.chat.messages, message]
      }
    }));

    // Clear the input field and reset state
    setNewMessage('');
    setIsSendingMessage(false);
  };

  // Handle pressing Enter to send a message
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to the bottom of the chat when new messages are added
  useEffect(() => {
    if (chatBodyRef.current && activeTab === 'chat') {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [group?.chat?.messages, activeTab]);

  return (
    <motion.div
      className="max-w-4xl mx-auto py-8 pt-16 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary-100 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-gray-900">{group.name}</h1>
        <div className="flex space-x-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="outline" icon={PencilIcon}>
              Edit Group
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
              Book Group Ride
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Group Type Badge */}
      <motion.div
        className="mb-6"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          group.type === 'office' ? 'bg-primary-100 text-primary-800' :
          group.type === 'event' ? 'bg-accent-100 text-accent-800' :
          group.type === 'tour' ? 'bg-emerald-100 text-emerald-800' :
          'bg-secondary-100 text-secondary-800'
        }`}>
          {group.type.charAt(0).toUpperCase() + group.type.slice(1)} Group
        </span>
        {group.isPublic && (
          <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold-100 text-gold-800">
            Public
          </span>
        )}
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="border-b border-gray-200 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <nav className="-mb-px flex space-x-8 overflow-x-auto">
          {[
            { id: 'details', label: 'Group Details', icon: <MapIcon className="h-4 w-4 mr-1" /> },
            { id: 'members', label: `Members (${group.members.length})`, icon: <UserGroupIcon className="h-4 w-4 mr-1" /> },
            { id: 'rides', label: `Rides (${group.rides.length})`, icon: <CalendarIcon className="h-4 w-4 mr-1" /> },
            { id: 'chat', label: 'Chat', icon: <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" /> },
            { id: 'polls', label: 'Polls', icon: <ChartBarIcon className="h-4 w-4 mr-1" /> }
          ].map((tab) => (
            <motion.button
              key={tab.id}
              className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
            >
              {tab.icon}
              {tab.label}
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'details' && (
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            key="details"
          >
            <Card className="overflow-hidden shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <h2 className="text-xl font-semibold">About This Group</h2>
              </CardHeader>
              <CardBody>
                <p className="text-gray-600 mb-6">{group.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-primary-500 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Origin</h3>
                        <p className="text-sm text-gray-600">{group.origin.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPinIcon className="h-5 w-5 text-primary-500 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Destination</h3>
                        <p className="text-sm text-gray-600">{group.destination.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CalendarIcon className="h-5 w-5 text-primary-500 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Schedule</h3>
                        <p className="text-sm text-gray-600">
                          {group.schedule.recurring.isRecurring ? (
                            <>
                              Recurring: {group.schedule.recurring.frequency}
                              <br />
                              Time: {formatTime(group.schedule.recurring.time)}
                            </>
                          ) : (
                            'Non-recurring'
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <UserGroupIcon className="h-5 w-5 text-primary-500 mt-0.5 mr-3" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Created by</h3>
                        <p className="text-sm text-gray-600">{group.creator.name}</p>
                        <p className="text-sm text-gray-600">
                          Since {formatDate(group.schedule.startDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Map Card */}
            <Card className="overflow-hidden shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Route Map</h2>
                  <span className="text-sm bg-white/20 px-2 py-1 rounded">Interactive</span>
                </div>
              </CardHeader>
              <CardBody className="p-0">
                <MapComponent
                  origin={{
                    address: group.origin.address,
                    lat: group.origin.coordinates ? group.origin.coordinates[1] : null,
                    lng: group.origin.coordinates ? group.origin.coordinates[0] : null
                  }}
                  destination={{
                    address: group.destination.address,
                    lat: group.destination.coordinates ? group.destination.coordinates[1] : null,
                    lng: group.destination.coordinates ? group.destination.coordinates[0] : null
                  }}
                  height="400px"
                  showRoute={true}
                  interactive={true}
                />
              </CardBody>
            </Card>

          {upcomingRides.length > 0 && (
            <Card className="overflow-hidden shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <h2 className="text-xl font-semibold">Upcoming Rides</h2>
              </CardHeader>
              <CardBody className="p-0">
                <div className="divide-y">
                  {upcomingRides.map((ride, index) => (
                    <motion.div
                      key={ride._id}
                      className="p-4 hover:bg-gray-50"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index, duration: 0.3 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {new Date(ride.scheduledTime).toLocaleDateString('en-US', {
                              weekday: 'long',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(ride.scheduledTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Link to={`/rides/${ride._id}`}>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button size="sm" variant="outline" icon={ArrowRightIcon} iconPosition="right">
                              View
                            </Button>
                          </motion.div>
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardBody>
              <CardFooter className="bg-gray-50 text-right">
                <Link to="/rides" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  View all rides
                </Link>
              </CardFooter>
            </Card>
          )}

          <Card className="overflow-hidden shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <h2 className="text-xl font-semibold">Group Stats</h2>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  className="text-center p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="text-3xl font-bold text-primary-600">{group.rides.length}</div>
                  <div className="text-sm text-gray-600">Total Rides</div>
                </motion.div>
                <motion.div
                  className="text-center p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="text-3xl font-bold text-primary-600">{group.members.length}</div>
                  <div className="text-sm text-gray-600">Members</div>
                </motion.div>
                <motion.div
                  className="text-center p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="text-3xl font-bold text-emerald-600">₹12,450</div>
                  <div className="text-sm text-gray-600">Total Saved</div>
                </motion.div>
                <motion.div
                  className="text-center p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                >
                  <div className="text-3xl font-bold text-emerald-600">320 kg</div>
                  <div className="text-sm text-gray-600">CO₂ Reduced</div>
                </motion.div>
              </div>
            </CardBody>
          </Card>
          </motion.div>
        )}

      {activeTab === 'members' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          key="members"
        >
          <Card className="overflow-hidden shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Members ({group.members.length})</h2>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" variant="outline" className="bg-white/20 text-white border-white/30 hover:bg-white/30" icon={PlusIcon}>
                    Invite Member
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y">
                {group.members.map((member, index) => (
                  <motion.div
                    key={index}
                    className="p-4 hover:bg-gray-50"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {member.user.profilePicture ? (
                          <motion.img
                            className="h-10 w-10 rounded-full"
                            src={member.user.profilePicture}
                            alt={member.user.name}
                            whileHover={{ scale: 1.1 }}
                          />
                        ) : (
                          <motion.div
                            className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="text-primary-700 font-medium">
                              {member.user.name.charAt(0)}
                            </span>
                          </motion.div>
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-gray-900">{member.user.name}</h3>
                        <div className="flex items-center">
                          <span className={`text-xs ${
                            member.role === 'admin' ? 'text-primary-600' : 'text-gray-500'
                          }`}>
                            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                          </span>
                          <span className="mx-1 text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            Joined {formatDate(member.joinedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {activeTab === 'rides' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          key="rides"
        >
          <Card className="overflow-hidden shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Rides History</h2>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    icon={ChartBarIcon}
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                  >
                    Ride Statistics
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardBody className="p-0">
              <div className="divide-y">
                {group.rides.map((ride, index) => (
                  <motion.div
                    key={ride._id}
                    className="p-4 hover:bg-gray-50"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.3 }}
                    whileHover={{ backgroundColor: 'rgba(139, 92, 246, 0.05)' }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {new Date(ride.scheduledTime).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </h3>
                        <div className="flex items-center mt-1">
                          <p className="text-sm text-gray-600 mr-2">
                            {new Date(ride.scheduledTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            ride.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            ride.status === 'confirmed' ? 'bg-primary-100 text-primary-800' :
                            ride.status === 'pending' ? 'bg-gold-100 text-gold-800' :
                            'bg-accent-100 text-accent-800'
                          }`}>
                            {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <Link to={`/rides/${ride._id}`}>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            size="sm"
                            variant="outline"
                            icon={ArrowRightIcon}
                            iconPosition="right"
                            className="border-primary-300 text-primary-700 hover:bg-primary-50"
                          >
                            Details
                          </Button>
                        </motion.div>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}

      {activeTab === 'chat' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          key="chat"
        >
          <Card className="h-[600px] flex flex-col overflow-hidden shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Group Chat</h2>
                <div className="text-sm bg-white/20 px-2 py-1 rounded">
                  {group.members.length} members online
                </div>
              </div>
            </CardHeader>
            <CardBody ref={chatBodyRef} className="p-0 flex-1 overflow-y-auto bg-gray-50">
              <div className="p-4 space-y-4">
                {group.chat.messages.map((message, index) => {
                  const isCurrentUser = message.sender._id === '1';
                  return (
                    <motion.div
                      key={index}
                      className={`flex items-start ${isCurrentUser ? 'justify-end' : ''}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * Math.min(index, 5), duration: 0.3 }}
                    >
                      {!isCurrentUser && (
                        <div className="flex-shrink-0 mr-3">
                          {message.sender.profilePicture ? (
                            <motion.img
                              className="h-10 w-10 rounded-full border-2 border-white shadow-md"
                              src={message.sender.profilePicture}
                              alt={message.sender.name}
                              whileHover={{ scale: 1.1 }}
                            />
                          ) : (
                            <motion.div
                              className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center border-2 border-white shadow-md"
                              whileHover={{ scale: 1.1 }}
                            >
                              <span className="text-primary-700 font-medium">
                                {message.sender.name.charAt(0)}
                              </span>
                            </motion.div>
                          )}
                        </div>
                      )}
                      <motion.div
                        className={`rounded-lg p-3 max-w-[80%] shadow-sm ${
                          isCurrentUser
                            ? 'bg-primary-100 border border-primary-200'
                            : 'bg-white'
                        }`}
                        whileHover={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      >
                        <div className="flex items-center mb-1">
                          <h3 className="text-sm font-medium text-gray-900">{message.sender.name}</h3>
                          <span className="ml-2 text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-gray-800">{message.content}</p>
                      </motion.div>
                      {isCurrentUser && (
                        <div className="flex-shrink-0 ml-3">
                          {message.sender.profilePicture ? (
                            <motion.img
                              className="h-10 w-10 rounded-full border-2 border-white shadow-md"
                              src={message.sender.profilePicture}
                              alt={message.sender.name}
                              whileHover={{ scale: 1.1 }}
                            />
                          ) : (
                            <motion.div
                              className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center border-2 border-white shadow-md"
                              whileHover={{ scale: 1.1 }}
                            >
                              <span className="text-primary-700 font-medium">
                                {message.sender.name.charAt(0)}
                              </span>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardBody>
            <div className="border-t p-4 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="input flex-1 mr-2 shadow-sm focus:ring-2 focus:ring-primary-500 transition-all duration-300"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleSendMessage}
                    disabled={isSendingMessage || !newMessage.trim()}
                    icon={ChatBubbleLeftRightIcon}
                    className={`${
                      !newMessage.trim()
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800'
                    }`}
                  >
                    {isSendingMessage ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Sending...
                      </div>
                    ) : (
                      'Send'
                    )}
                  </Button>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {activeTab === 'polls' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          key="polls"
          className="space-y-6"
        >
          <Card className="overflow-hidden shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Group Polls</h2>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    size="sm"
                    variant="outline"
                    icon={PlusIcon}
                    className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                    onClick={openPollModal}
                  >
                    Create Poll
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardBody>
              {group.polls.length > 0 ? (
                <div className="space-y-6">
                  {group.polls.map((poll, pollIndex) => (
                    <motion.div
                      key={poll._id}
                      className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 * pollIndex, duration: 0.4 }}
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{poll.title}</h3>
                      <div className="space-y-4 mb-6">
                        {poll.options.map((option, index) => {
                          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
                          const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;

                          return (
                            <motion.div
                              key={index}
                              initial={{ width: 0 }}
                              animate={{ width: '100%' }}
                              transition={{ delay: 0.1 * index + 0.3, duration: 0.5 }}
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-gray-700">{option.text}</span>
                                <span className="text-sm text-gray-500 font-medium">{option.votes} votes ({percentage}%)</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                <motion.div
                                  className={`h-3 rounded-full ${
                                    index === 0 ? 'bg-primary-500' :
                                    index === 1 ? 'bg-secondary-500' :
                                    index === 2 ? 'bg-emerald-500' :
                                    'bg-accent-500'
                                  }`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentage}%` }}
                                  transition={{ delay: 0.1 * index + 0.5, duration: 0.7, ease: "easeOut" }}
                                ></motion.div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-medium px-2 py-1 rounded ${
                          poll.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {poll.isActive ? 'Active' : 'Closed'}
                        </span>
                        {poll.isActive && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                              onClick={() => openVotingModal(poll)}
                            >
                              Vote
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ChartBarIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 mb-4">No polls have been created yet</p>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                    <Button
                      icon={PlusIcon}
                      className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
                      onClick={openPollModal}
                    >
                      Create Your First Poll
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Poll Creation Modal */}
      <Modal
        isOpen={isPollModalOpen}
        onClose={closePollModal}
        title="Create New Poll"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="poll-title" className="block text-sm font-medium text-gray-700 mb-1">
              Poll Question
            </label>
            <Input
              id="poll-title"
              type="text"
              value={pollTitle}
              onChange={handlePollTitleChange}
              placeholder="e.g., What time should we meet tomorrow?"
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Options (minimum 2)
              </label>
              {pollOptions.length < 6 && (
                <button
                  type="button"
                  onClick={addPollOption}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Option
                </button>
              )}
            </div>

            <div className="space-y-3">
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center">
                  <Input
                    type="text"
                    value={option}
                    onChange={(e) => handlePollOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removePollOption(index)}
                      className="ml-2 text-gray-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Poll Duration
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="poll-duration-days" className="block text-sm text-gray-600 mb-1">
                  Days
                </label>
                <select
                  id="poll-duration-days"
                  value={pollDuration}
                  onChange={handlePollDurationChange}
                  className="input w-full"
                >
                  <option value="0">0 days</option>
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
              <div>
                <label htmlFor="poll-duration-hours" className="block text-sm text-gray-600 mb-1">
                  Hours
                </label>
                <select
                  id="poll-duration-hours"
                  value={pollDurationHours}
                  onChange={handlePollDurationHoursChange}
                  className="input w-full"
                >
                  <option value="1">1 hour</option>
                  <option value="2">2 hours</option>
                  <option value="4">4 hours</option>
                  <option value="8">8 hours</option>
                  <option value="12">12 hours</option>
                  <option value="24">24 hours</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Poll will be active for {pollDuration} days and {pollDurationHours} hours
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={closePollModal}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={createPoll}
              disabled={isCreatingPoll}
              className="bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
            >
              {isCreatingPoll ? 'Creating...' : 'Create Poll'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Poll Voting Modal */}
      <Modal
        isOpen={isVotingModalOpen}
        onClose={closeVotingModal}
        title="Vote on Poll"
        size="md"
      >
        {currentPoll && (
          <AnimatePresence mode="wait">
            {showVoteSuccess ? (
              <motion.div
                className="py-12 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                key="success"
              >
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 mb-4">
                  <svg className="h-10 w-10 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Vote Submitted!</h3>
                <p className="text-gray-600">Your vote has been recorded successfully.</p>
              </motion.div>
            ) : (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                key="form"
              >
                <h3 className="text-lg font-medium text-gray-900">{currentPoll.title}</h3>

                <div className="space-y-3">
                  {currentPoll.options.map((option, index) => (
                    <motion.div
                      key={index}
                      className={`flex items-center p-4 rounded-lg cursor-pointer border ${
                        selectedOption === index
                          ? 'border-primary-500 bg-primary-50 shadow-md'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => handleOptionSelect(index)}
                      whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      whileTap={{ y: 0, scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-center w-full">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedOption === index
                              ? 'border-primary-600'
                              : 'border-gray-400'
                          }`}
                        >
                          {selectedOption === index && (
                            <motion.div
                              className="w-3 h-3 rounded-full bg-primary-600"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            />
                          )}
                        </div>
                        <label className="ml-3 block text-sm font-medium text-gray-700 cursor-pointer flex-1">
                          {option.text}
                        </label>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={closeVotingModal}
                    className="border-gray-300 text-gray-700"
                  >
                    Cancel
                  </Button>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={submitVote}
                      disabled={isVoting || selectedOption === null}
                      className={`px-8 py-2 ${
                        selectedOption === null
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 shadow-lg'
                      }`}
                    >
                      {isVoting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Submit Vote
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </Modal>
    </motion.div>
  );
};

export default GroupDetails;
