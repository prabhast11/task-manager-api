const express = require('express')
const router =new express.Router()
const Task = require('../models/task')
const User = require('../models/user')
const auth = require('../middleware/auth')


router.post('/tasks', auth, async (req,res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.user._id

    })
    // console.log(req.body._id)

    try{ 
        await task.save()
        res.status(201).send(task)
        }
    catch(e){
        res.status(400).send(e)
    }
})
    
    
 
router.get('/tasks', auth, async (req,res) => {
    
    const match ={}
    const sort ={}

    if(req.query.completed)
    {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){

        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc'?-1:1
        

    }






    console.log(match)
    
    try{

    // const tasks =await Task.find({owner : req.user._id})
        // res.send(tasks)

        await req.user.populate({
            path : 'tasks',
            match : match,
            options : {
                limit : parseInt(req.query.limit) || null,
                skip : parseInt(req.query.skip) || null,
                sort 
            }
        })
        res.send(req.user.tasks)


    }catch(e)  {
        console.log(e)
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req,res) =>{
    const _id = req.params.id
     try{
            // const task = await Task.findById(_id)

            const task = await Task.findOne({_id : _id, owner : req.user._id})


        if(!task){
            return res.status(404).send()
        }     
        res.send(task)
    }
    catch(e){
        console.log(e)
        res.status(500).send(e)

    }
})

    // Task.findById(_id).then((task) => {
    //     if(!task) {
    //         return res.status(404).send()
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     console.log(e)
    //     res.status(500).send()
    // })

    router.patch('/tasks/:id', auth, async (req,res) =>{

        const updates = Object.keys(req.body)
        const allowedUpdates = ['description','completed']
        const isValidOperation = updates.every((upd) =>{
            return allowedUpdates.includes(upd)
        })

        if(!isValidOperation){
            return res.status(400).send({eror : 'Invalid Updates!'})
        }


        try{
            // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new : true,runValidators : true})
            // const task = await Task.findById(req.params.id)

            const task = await Task.findOne({_id : req.params.id, owner : req.user._id})
            
            if(!task)    {
                return res.status(404).send()
            }

            updates.forEach((update) => {
                task[update] = req.body[update]
            })
            
            await task.save()
            return res.send(task)
    }
    catch(e) {
        return res.status(400).send()
    }

    })

    router.delete('/tasks/:id', auth,  async (req,res) => {
        try{
            const task =await Task.findOneAndDelete({_id : req.params.id,owner : req.user._id})
           if(!task){
               return res.status(404).send()
            }
                res.send(task)
            }
    catch(e){
        res.status(500).send()
    }
    })

    module.exports = router