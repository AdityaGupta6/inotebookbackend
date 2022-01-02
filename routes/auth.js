const fetchuser=require('../middleware/fetchuser')

    const express = require('express');
    
const router=express.Router();
const User=require('../models/User')

const { body, validationResult } = require('express-validator');

var bcrypt = require('bcryptjs');
const JWT_SECRET="foruseinlogin"
var jwt = require('jsonwebtoken');
const { success } = require('concurrently/src/defaults');
//Create a user using using Postno login required
router.post('/createUser',[
    body('email',"enter a valid email ").isEmail(),
    body('password',"Password at least must be 5 character").isLength({ min: 5}),
    body('name',"enter a valid name ").isLength({ min: 3}),
],async (req,res)=>{
 
 const errors = validationResult(req);
let success=true
 //if there are error return a bad request
 if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
 }
try{

    // check the email validation
    let user=await User.findOne({email:req.body.email})
    if (user) {
        success=false
        return res.json({success,error:"Email Alredy Exist"})
    }
    const salt=await bcrypt.genSalt(10)

    var secPass=await bcrypt.hash(req.body.password,salt);
    //  making the user
    user=await User.create({
        name: req.body.name,
        email: req.body.email,
        password:secPass,
    })
    const data={
        user:{id:user.id}
    }
    const authToken= jwt.sign(data,JWT_SECRET)
    

        res.json({success,authToken})
    }
    catch(err){
        console.error(err);
        res.status(500).send("Some error occured")

    }
})
//auth the login
router.post('/login',[
    body('email',"enter a valid email ").isEmail(),
    body('password',"Password cannot be blank").exists(),
  
],async (req,res)=>{
    const errors = validationResult(req);
    let success=false
    //if there are error return a bad request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email,password}=req.body;
    try {
        let user=await User.findOne({email})
        if (!user) {

            return res.json({success,error:"Please try to login with current crediantials"})
        }
        const comparePass=await bcrypt.compare(password,user.password)
        if (!comparePass) {
          
            return res.json({success,error:"Please try to login with current crediantials"})
            
        }
        const data={
            user:{id:user.id}
        }
        const authToken= jwt.sign(data,JWT_SECRET)
        
  success=true
            res.json({success,authToken})
    }   catch(err){
        console.error(err);
        res.status(500).send("Some error occured")

    }
})

router.post('/getUser',fetchuser,async (req,res)=>{
    try {
        let userId=req.user.id
        const user=await User.findById(userId).select("-password") 
        res.send(user)
     }   catch(err){
         console.error(err);
         res.status(500).send("Some error occured")
     
     }

})
module.exports=router