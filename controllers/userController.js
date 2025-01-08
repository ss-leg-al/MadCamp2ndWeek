const User = require('../models/User');
const Trainer = require('../models/Trainer');

const updateUserLevel = (user) => {
  if (user.points >= 200) {
    user.level = 'Gold';
  } else if (user.points >= 100) {
    user.level = 'Silver';
  } else {
    user.level = 'Bronze';
  }
};

const userController = {
  getFavoriteTrainers: async (req, res) => {
    try {
      const {id:userId } = req.params;

      // 유저 확인
      const user = await User.findById(userId).populate('favoriteTrainers');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 관심 트레이너 반환
      res.status(200).json(user.favoriteTrainers);
    } catch (error) {
      console.error('Error fetching favorite trainers:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
  addFavoriteTrainer: async (req, res) => {
    try {
      const { id:userId, trainerId } = req.params;
      console.log('Request Parameters:', req.params);
      console.log(userId);
      // 유저 및 트레이너 확인
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const trainer = await Trainer.findById(trainerId);
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }

      // 이미 추가된 트레이너인지 확인
      if (user.favoriteTrainers.includes(trainerId)) {
        return res.status(400).json({ message: 'Trainer already added to favorites' });
      }

      // 관심 트레이너 추가
      user.favoriteTrainers.push(trainerId);
      await user.save();

      res.status(200).json({ message: 'Trainer added to favorites', favoriteTrainers: user.favoriteTrainers });
    } catch (error) {
      console.error('Error adding favorite trainer:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // 관심 트레이너 삭제
  removeFavoriteTrainer: async (req, res) => {
    try {
      const { id:userId, trainerId } = req.params;

      // 유저 확인
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 트레이너 삭제
      user.favoriteTrainers = user.favoriteTrainers.filter((id) => id.toString() !== trainerId);
      await user.save();

      res.status(200).json({ message: 'Trainer removed from favorites', favoriteTrainers: user.favoriteTrainers });
    } catch (error) {
      console.error('Error removing favorite trainer:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  updateAllUserLevels: async (req, res) => {
    try {
      const users = await User.find();
      for (const user of users) {
        updateUserLevel(user);
        await user.save();
      }
      res.status(200).json({ message: '모든 유저의 레벨이 업데이트되었습니다.' });
    } catch (err) {
      console.error('Error updating all user levels:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getUserLevel: async (req, res) => {
    try {
      const { id } = req.params; // URL에서 유저 ID 추출
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // 유저 레벨 반환
      res.status(200).json({ level: user.level });
    } catch (err) {
      console.error('Error fetching user level:', err);
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
      const users = await User.find().sort({ points: -1 }); // 내림차순 정렬
      res.status(200).json(users);
    } catch (error) {
      console.error('Error fetching user rankings:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = userController;