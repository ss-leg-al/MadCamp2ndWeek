const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/rankings', userController.getUserRankings);
router.get('/:id', userController.getUser);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUserPoints);
router.get('/', userController.getAllUsers);
router.patch('/update-levels', userController.updateAllUserLevels);
router.get('/:id/level', userController.getUserLevel);
router.post('/:id/favoriteTrainers/:trainerId', userController.addFavoriteTrainer);
router.delete('/:id/favoriteTrainers/:trainerId', userController.removeFavoriteTrainer);
router.get('/:id/favoriteTrainers', userController.getFavoriteTrainers); // 관심 트레이너 조회
module.exports = router;