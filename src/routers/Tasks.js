const express = require('express')
const router = new express.Router
const Tasks = require('../models/Tasks')
const auth = require('../middleware/auth')

router.post('/tasks', auth, async (req,res) => {
    const task = new Tasks({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/tasks', auth, async (req,res) => {

    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        sort[parts[0]] = parts[1] === 'asc'? 1 : -1
    }

    try{
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    
    try {
        // const task = await Tasks.findById(req.params.id)
        const task = await Tasks.findOne({
            _id: req.params.id,
            owner: req.user._id            
        })
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send()
    }

    // Tasks.findById(req.params.id).then((task) => {
    //     if(!task){
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((error) => {
    //     res.status(500).send()
    // })
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const validateUpdte = updates.every((updates) => {
        return allowedUpdates.includes(updates)
    })

    if(!validateUpdte) {
        return res.status(400).send({'error' : 'Invalid update parameter'})
    }

    try {
        const task = await Tasks.findOne({
            _id: req.params.id,
            owner: req.user._id
        })
        if(!task) {
            res.status(404).send()
        }
        
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)

    } catch(error) {
        res.status(500).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const task = await Tasks.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch(error){
        res.status(500).send()
    }
})

module.exports = router