const fetchuser=require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');

const Notes=require('../models/Notes')

const express = require('express');

const router=express.Router();

router.get('/fetchallnotes',fetchuser,async(req,res)=>{
try {
  const notes=await Notes.find({user:req.user.id})
  
    res.json(notes)
  
} catch (err) {
  console.error(err);
        res.status(500).send("Some error occured")

}
})



router.post('/addnotes',fetchuser,[
  body('title',"Description at least must be 5 character ").isLength({ min: 5}),
  body('desc',"Description at least must be 10 character").isLength({ min: 10}),
 
],async(req,res)=>{
  try {
    
    const errors = validationResult(req);
    const{title,desc,tag}=req.body
    //if there are error return a bad request
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const note=new Notes({
      title,desc,tag,user:req.user.id
    })
    const saveNote=await note.save()
    res.json(saveNote)
  } 
  catch (err) {
    console.error(err);
        res.status(500).send("Some error occured")

  }
  })
  
  router.put('/updatenotes/:id',fetchuser,async(req,res)=>{

const{title,desc,tag}=req.body
try {
  

const newNote={}

if (title) {
  newNote.title=title
}
if (desc) {
  newNote.desc=desc
}
if (tag) {
  newNote.tag=tag
}


let note= await Notes.findById(req.params.id)
if (!note) {
  res.status(404).send("Not found")
}

if (note.user.toString()!== req.user.id) {
  return res.status(401).send("not allowed")
}

note=await Notes.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})

res.json(note)
}
catch (err) {
  console.error(err);
      res.status(500).send("Some error occured")

}
  })



  router.delete('/deletenotes/:id',fetchuser,async(req,res)=>{

    const{title,desc,tag}=req.body
try {
  

    let note= await Notes.findById(req.params.id)
    if (!note) {
      res.status(404).send("Not found")
    }
    
    if (note.user.toString()!== req.user.id) {
      return res.status(401).send("not allowed")
    }
    
    note=await Notes.findByIdAndDelete(req.params.id)
    
    res.json({"success":"Your note has been deleted","note":note})
  }
  catch (err) {
    console.error(err);
        res.status(500).send("Some error occured")

  }
      })
module.exports=router