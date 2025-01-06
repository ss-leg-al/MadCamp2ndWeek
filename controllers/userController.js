const User = require('../models/User');

const updateUserLevel = (user) => {
  if  (user.points >= 200) {
    user.level = 'Gold';
  } else if (user.points >= 100) {
    user.level = 'Silver';
  } else {
    user.level = 'Bronze';
  }
};


const userController = {
  updateAllUserLevels: async (req, res) => {
    try {
      // 모든 유저를 가져옵니다
      const users = await User.find();

      // 각 유저의 레벨을 업데이트
      for (const user of users) {
        updateUserLevel(user);
        await user.save(); // 변경사항 저장
      }

      res.status(200).json({ message: '모든 유저의 레벨이 업데이트되었습니다.' });
    } catch (err) {
      console.error('Error updating all user levels:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const { name, email } = req.body;
      const user = new User({ name, email });
      await user.save();
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  updateUserPoints: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.points = req.body.points;
      updateUserLevel(user);

      await user.save();
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().sort({ createdAt: -1 }); // 최신 순으로 정렬
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getUserRankings: async (req, res) => {
    try {
      // MongoDB 쿼리를 사용해 포인트 순으로 정렬된 유저 목록 가져오기
      const users = await User.find().sort({ points: -1 }); // 내림차순 정렬
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching user rankings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};


module.exports = userController;