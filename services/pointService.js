// services/pointsService.js
const User = require('../models/User');

const POINTS_PER_FEEDBACK = 10;

const pointsService = {
  calculatePoints: (content) => {
    // 간단한 예: 글자 수에 따라 포인트 부여
    return Math.min(content.length / 10, POINTS_PER_FEEDBACK);
  },

  addPoints: async (userId, points) => {
    const user = await User.findById(userId);
    user.points += points;

    // 등급 업그레이드 로직
    if (user.points >= 100 && user.level === 'Bronze') {
      user.level = 'Silver';
    } else if (user.points >= 200 && user.level === 'Silver') {
      user.level = 'Gold';
    } else if (user.points >= 300 && user.level === 'Gold') {
      user.level = 'Platinum';
    }

    await user.save();
  },
};

module.exports = pointsService;