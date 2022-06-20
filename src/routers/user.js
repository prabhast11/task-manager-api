const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')





router.post('/users',async (req,res) =>{
    const user = new User(req.body)
    try{
        // const user = await User.findByCredentials(req.body.email,req.body.password)
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        // res.send({user,token})
        // user.save()
        res.status(201).send({user,token})
    }
    catch(e){
        console.log(e)
        res.status(400).send(e)
    
    }
    })

    router.post('/users/login', async (req,res) =>{
        try{
            const user = await User.findByCredentials(req.body.email,req.body.password)

            const token = await user.generateAuthToken()
    
            // res.send({user : user.getPublicProfile(),token})

            sendWelcomeEmail(user.email, user.name)

            res.send({user,token})

        }
        catch(e) {
            console.log(e)
            res.status(400).send(e)

        }
    })

    router.post('/users/logout',auth, async (req,res) =>{

        try{
                   console.log(req.user.tokens.length)
                    req.user.tokens = req.user.tokens.filter((token) =>{
                    return token.tokens !== req.token

                })
                console.log(req.user.tokens.length)
                // console.log(req.user.tokens)
                await req.user.save()
                 res.send()
            }  
        
        catch(e){
            res.status(500).send()

        }
    })

    router.post('/users/logoutAll', auth, async (req,res) =>{

         try{   req.user.tokens = []

            await req.user.save() 

            res.send()

         }

         catch(e){
             res.status(500).send()
         }


    })


    
    
    router.get('/users/me', auth, async (req,res) =>{
        try{
               //const users = await User.find({})
               //res.send(users) 

               res.send(req.user)
        }
    
        catch(e){
            
            res.status(500).send()
        }
        
     })
    
   

    router.get('/users/:id',async (req,res) =>{
        const _id = req.params.id
         try{
        const user = await User.findById(_id)
            if(!user){
                return res.status(404).send()
            }    
            res.send(user)
        }
        catch(e){
            console.log(e)
            res.status(500).send(e)
    
        }
    })
    
    router.patch('/users/me', auth, async (req,res) =>{
    
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name','email','password','age']
        
        const isValidOperation = updates.every((upd) =>{
            return allowedUpdates.includes(upd)
        })
    
        if(!isValidOperation){
            return res.status(400).send({error : "Invalid updates!"})
        }
    
        
            try{
                // const user = await User.findByIdAndUpdate(req.params.id,req.body,{new : true,runValidators : true})
            
                // const user = await User.findById(req.params.id)

                // const user = await User.findById(req.user._id)

                updates.forEach((update) =>{
                    req.user[update] = req.body[update]
                })

                await req.user.save()



                // if(!user) {
                //         return res.status(404).send()
                //     }
                return res.send(req.user)
    }
        catch(e) {
                return res.status(400).send(e)
        }
    })
    
    router.delete('/users/me', auth, async (req,res) =>{
        // const user = await User.findByIdAndDelete(req.params.id)
        try{
            await req.user.remove()
            sendCancelEmail(req.user.email, req.user.name)
            return res.send(req.user)
        }
    
        catch(e){
            return res.status(400).send(e)
        }
    })
    


    
    const upload = multer({
        
        limits : {
            fieldSize : 1000000
        },
        fileFilter(req, file, cb){

            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){

                cb(new Error('please upload an image'))

            }

            cb(undefined,true)
        
        }
    })

    router.post('/users/me/avatar', auth,  upload.single('avatar'), async (req,res) =>{
        
        const buffer = await sharp(req.file.buffer).resize({width : 250, height: 250 }).png().toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()

    },(error, req, res, next) =>{
        res.status(400).send({error : error.message})
    })

    router.delete('/users/me/avatar', auth, async (req,res) => {
        req.user.avatar = undefined
        await req.user.save()
        res.send()
    })

    router.get('/users/:id/avatar', async (req, res) => {
        try{

            const user = await User.findById(req.params.id)

            if(!user || !user.avatar){
                throw new Error()
            }

            res.set('Content-Type', 'image/png')
            res.send(user.avatar)

        }catch(e) {
            res.status(404).send()

        }
    })






module.exports = router