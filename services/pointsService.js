// services/pointsService.js
const User = require('../models/User');

const pointsService = {
  getPointsRangeByLevel: (level) => {
    switch (level) {
      case 'Bronze':
        return { min: 1, max: 1 }; // 고정 1포인트
      case 'Silver':
        return { min: 1, max: 3 }; // 1~3포인트
      case 'Gold':
        return { min: 1, max: 5 }; // 1~5포인트
      default:
        throw new Error('Invalid user level');
    }
  },

  addPoints: async (userId, points) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.points += points;
    await user.save();
  },
};

module.exports = pointsService;