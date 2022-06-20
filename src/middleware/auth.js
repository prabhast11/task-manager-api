const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req, res, next)  => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')

         
        const decode = jwt.verify(token, process.env.JWT_SECRET)


        const user = await User.findOne({_id : decode._id, 'tokens.tokens' : token})

        

        if(!user){
            throw new Error()
        }

            req.token = token
            req.user = user
            // console.log(req.user._id)
            next()
        }
    catch(e){
        res.status(401).send({ error: 'Please authenticate.' })

    }
}    

module.exports = auth