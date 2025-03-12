const Task = require('../models/Task')

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().select('_id title description completed createdAt updatedAt'); 
        console.log(tasks);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

const createTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const newTask = new Task({ title, description, completed });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



const updateTask = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedTask) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };
const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


const markTaskComplete = async (req,res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id, 
            { completed: true },  
            { new: true } 
        );

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.json(task);  
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { getTasks, createTask, updateTask, deleteTask,markTaskComplete };



