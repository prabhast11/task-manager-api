const express = require('express')
const Task = require('./models/task')
const User = require('./models/user')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT 


app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,() =>{
    console.log('Server is up for listen on port no ',port)
})



const main = async () =>{
    // const task = await Task.findById('62986c4d485968b9f9d135fa')
    // await task.populate('owner')
    // console.log(task.owner)

    const user = await User.findById('62986be2485968b9f9d135f5')
    await user.populate('tasks')
    console.log(user.tasks)
}

// // main()

// const multer = require('multer')

// const upload = multer({
//     dest : 'images',
//     limits :{
//         fileSize : 1000000
//         },

//     fileFilter(req, file, cb){

        // if(!(file.originalname.endsWith('.doc') ||file.originalname.endsWith('.docx'))){
        //     return cb(new Error('please upload a word file'))
        // }

//         if(!file.originalname.match(/\.(doc|docx)$/)){
//             return cb(new Error('please upload a word document'))
//         }

//         cb(undefined, true)

//     }
// })

// const errorMiddleware = (req, res, next) =>{
//     throw new Error('From my middleware')
// }


// app.post('/upload', upload.single('upload'), (req,res) =>{
//     res.send()
// },(error, req, res, next) =>{
//     res.status(400).send({error : error.message})
// })


const nodemailer = require('nodemailer')


app.post('/mail',(req,res) =>{
    
let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'prabhast11@gmail.com',
        pass : 'djgbzpa2'
    }
}) 



let info = transporter.sendMail({
    from : 'prabhast11@gmail.com',
    to : req.body.to,
    subject : req.body.subject,
    text : req.body.text
})

transporter.sendMail(info, function(err,data)  {
if(err)     {
        console.log('Error occurs')
}

else{

    console.log('email sent')
}
 })

console.log('hi')

res.send('mail sent successfully')



})













