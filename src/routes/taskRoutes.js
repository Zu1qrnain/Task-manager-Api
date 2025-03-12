const express = require('express');
const { getTasks, createTask, updateTask, deleteTask, markTaskComplete } = require('../controllers/taskController');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getTasks);         
router.post('/', createTask);       
router.put('/:id', updateTask);     
router.delete('/:id', deleteTask); 
router.patch('/:id/complete', markTaskComplete);  

module.exports = router;
