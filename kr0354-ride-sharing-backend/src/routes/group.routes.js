const express = require('express');
const {
  createGroup,
  getGroups,
  getGroup,
  updateGroup,
  joinGroup,
  leaveGroup
} = require('../controllers/group.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .get(getGroups)
  .post(createGroup);

router.route('/:id')
  .get(getGroup)
  .put(updateGroup);

router.route('/:id/join')
  .post(joinGroup);

router.route('/:id/leave')
  .delete(leaveGroup);

module.exports = router;
