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

module.exports = router;