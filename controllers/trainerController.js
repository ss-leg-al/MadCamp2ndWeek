const Trainer = require('../models/Trainer');

const trainerController = {
  // 모든 트레이너 조회
  getAllTrainers: async (req, res) => {
    try {
      const trainers = await Trainer.find();
      res.status(200).json(trainers);
    } catch (error) {
      console.error('Error fetching trainers:', error);
      res.status(500).json({ message: 'Failed to fetch trainers' });
    }
  },

  // 특정 트레이너 조회
  getTrainerById: async (req, res) => {
    try {
      const { id } = req.params;
      const trainer = await Trainer.findById(id);
      if (!trainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
      res.status(200).json(trainer);
    } catch (error) {
      console.error('Error fetching trainer:', error);
      res.status(500).json({ message: 'Failed to fetch trainer' });
    }
  },

  // 트레이너 추가
  createTrainer: async (req, res) => {
    try {
      const trainerData = req.body;
      const newTrainer = new Trainer(trainerData);
      await newTrainer.save();
      res.status(201).json(newTrainer);
    } catch (error) {
      console.error('Error creating trainer:', error);
      res.status(500).json({ message: 'Failed to create trainer' });
    }
  },

  // 트레이너 수정
  updateTrainer: async (req, res) => {
    try {
      const { id } = req.params;
      const trainerData = req.body;
      const updatedTrainer = await Trainer.findByIdAndUpdate(id, trainerData, { new: true });
      if (!updatedTrainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
      res.status(200).json(updatedTrainer);
    } catch (error) {
      console.error('Error updating trainer:', error);
      res.status(500).json({ message: 'Failed to update trainer' });
    }
  },

  // 트레이너 삭제
  deleteTrainer: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTrainer = await Trainer.findByIdAndDelete(id);
      if (!deletedTrainer) {
        return res.status(404).json({ message: 'Trainer not found' });
      }
      res.status(200).json({ message: 'Trainer deleted successfully' });
    } catch (error) {
      console.error('Error deleting trainer:', error);
      res.status(500).json({ message: 'Failed to delete trainer' });
    }
  },
};

module.exports = trainerController;