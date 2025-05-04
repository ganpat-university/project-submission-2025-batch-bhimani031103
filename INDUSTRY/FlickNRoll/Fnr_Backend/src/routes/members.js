const express = require('express');
const router = express.Router();
const {
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  renewMember,
} = require('../controllers/memberController');
const { protect } = require('../middleware/auth');

router.route('/')
    .get(protect, getMembers)
    .post(protect, createMember);

router.route('/:id')
    .put(protect, updateMember)
    .delete(protect, deleteMember);

router.post('/:id/renew', protect, renewMember);

module.exports = router;