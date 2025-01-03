const User = require('../models/User');

const updateUserLevel = (user) => {
  if (user.points >= 300) {
    user.level = 'Platinum';
  } else if (user.points >= 200) {
    user.level = 'Gold';
  } else if (user.points >= 100) {
    user.level = 'Silver';
  } else {
    user.level = 'Bronze';
  }
};

const userController = {
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
  
};


module.exports = userController;