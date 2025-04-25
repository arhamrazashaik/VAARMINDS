const Group = require('../models/group.model');
const User = require('../models/user.model');

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
exports.createGroup = async (req, res) => {
  try {
    const { name, description, type, isPublic, commonRoutes } = req.body;

    // Validate input
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Please provide name and type' });
    }

    // Create group
    const group = await Group.create({
      name,
      description,
      type,
      creator: req.user.id,
      members: [
        {
          user: req.user.id,
          role: 'admin',
          joinedAt: Date.now()
        }
      ],
      commonRoutes: commonRoutes || [],
      isPublic: isPublic !== undefined ? isPublic : true
    });

    res.status(201).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
exports.getGroups = async (req, res) => {
  try {
    // Build query
    let query = {};

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by user's groups or public groups
    if (req.query.myGroups === 'true') {
      query['members.user'] = req.user.id;
    } else {
      query.$or = [
        { isPublic: true },
        { 'members.user': req.user.id }
      ];
    }

    const groups = await Group.find(query)
      .populate('creator', 'name email')
      .populate('members.user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups
    });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Private
exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'name email')
      .populate('members.user', 'name email phoneNumber');

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is member or group is public
    const isMember = group.members.some(m => m.user._id.toString() === req.user.id);
    if (!isMember && !group.isPublic) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this group' });
    }

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update group
// @route   PUT /api/groups/:id
// @access  Private
exports.updateGroup = async (req, res) => {
  try {
    const { name, description, type, isPublic } = req.body;

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description !== undefined) updateFields.description = description;
    if (type) updateFields.type = type;
    if (isPublic !== undefined) updateFields.isPublic = isPublic;

    let group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is admin
    const memberIndex = group.members.findIndex(
      m => m.user.toString() === req.user.id && m.role === 'admin'
    );

    if (memberIndex === -1) {
      return res.status(403).json({ success: false, message: 'Only admins can update the group' });
    }

    // Update group
    group = await Group.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Join group
// @route   POST /api/groups/:id/join
// @access  Private
exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if group is public
    if (!group.isPublic) {
      return res.status(403).json({ success: false, message: 'This group is private' });
    }

    // Check if user is already a member
    if (group.members.some(m => m.user.toString() === req.user.id)) {
      return res.status(400).json({ success: false, message: 'You are already a member of this group' });
    }

    // Add member
    group.members.push({
      user: req.user.id,
      role: 'member',
      joinedAt: Date.now()
    });

    await group.save();

    res.status(200).json({
      success: true,
      data: group
    });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Leave group
// @route   DELETE /api/groups/:id/leave
// @access  Private
exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    // Check if user is a member
    const memberIndex = group.members.findIndex(
      m => m.user.toString() === req.user.id
    );

    if (memberIndex === -1) {
      return res.status(400).json({ success: false, message: 'You are not a member of this group' });
    }

    // Check if user is the creator and last admin
    if (group.creator.toString() === req.user.id) {
      const adminCount = group.members.filter(m => m.role === 'admin').length;
      if (adminCount === 1) {
        return res.status(400).json({ success: false, message: 'You cannot leave the group as you are the only admin. Transfer admin role to another member first.' });
      }
    }

    // Remove member
    group.members.splice(memberIndex, 1);
    await group.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
