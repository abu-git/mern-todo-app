const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

//import Task schema
const Task = require('../models/Task');

router.get('/dashboard/', (req, res) => {
	const owner = req.query.data
	Task.find({ owner: owner }, (err, docs) => {
		if(err){
			return res.status(500).send(err);
		}else{
			console.log("found docs");
			return res.status(200).json(docs);
		}
	});
});

router.post('/add', (req, res) => {
	var newTask = new Task();
	newTask.description = req.body.description;
	newTask.done = false;
	newTask.owner = req.body.owner;
	newTask.deadline = req.body.deadline;

	newTask.save()
		.then(task => {
			res.status(200).json({ 'task': 'task added successfully'});
		})
		.catch(err => {
			res.status(400).send('error adding task');
		});
});

module.exports = router;