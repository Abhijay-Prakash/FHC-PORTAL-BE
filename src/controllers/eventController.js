import { title } from 'process';
import Event from '../models/Event.js';
import User from '../models/User.js';

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const registerForEvent = async (req, res) => {
    const { eventId } = req.body;
    const userId =  req.user._id;

    if(!eventId){
      res.status(400).json({message:'Event ID is required'});
    }

    try {

      const event = await Event.findById(eventId);

      if(!event){
        return res.status(404).json({message:'Event not found'});
      }


      //check if they have already registered for this event
      //here also #addToSet will work but a message to frontend for informing them that they have already registered will be hard to put out
     
      if(event.registeredUsers.includes(userId)){
        return res.status(400).json({message:'User is already registered for this event'});
      }

      event.registeredUsers.push(userId);
      await event.save()


      //$addToSet will make sure no duplication takes place
      await User.findByIdAndUpdate(
        userId,
        {$addToSet: {eventsRegistered: eventId}},
        {new: true}

      );
    
  
      res.status(200).json({ message: 'Registered for event' });
  
    } catch (err) {
      console.error('Error during event registration:', err);
      res.status(500).json({ message: err.message });
    }
  };
  

export const addEvent = async(req,res) =>{
    const {title,description,category,date} = req.body;

    if( !title || !description || !category ||date){
      res.status(400).json({message:'All fields are required'});
    }

    try{
      const event = new Event({title,description,category,date});
      await event.save();
      res.status(201).json({message:'Event added successfully',event});
    }catch(err){
      res.status(500).json({message: err.message});
    }

  };


//in here it for marking attendance for the users
//this is where we have to implement qr based attendance marking
export const markAttendanceForEvent = async(req,res) =>{
  const {eventId,userId} = req.body;

  if(!eventId || !userId){
    return res.status(400).json({message:'All fields are required required'});
  }

  try{

    //here also you could do it with sending a message to frontend if they have already been marked present, but no scn it common sense
    await User.findByIdAndUpdate(
      userId,
      {$addToSet: {eventsAttended: eventId}},
      {new:true}
    );

    await Event.findByIdAndUpdate(
      eventId,
      {$addToSet: {attendedUsers:userId}},
      {new: true}
    );


    res.status(200).json({message:'Attendance marked successfully'});
  }catch(err){
    console.log("Error while marking attendance", err);
    res.status(500).json({message:'Internal server error'});
  }


};


//here it returns both attendance and registrations as well
export const getAllRegistrations = async(req,res) => {

  const {eventId} = req.body;
  
  if(!eventId){
    return res.status(400).json({message:"Event ID is required"});
  }

  try{

    const event = await Event.findById(eventId)
    .populate('registeredUsers', 'name email')
    .populate('attendedUsers', 'name email');

    if(!event){
      return res.status(404).json({message:'Event not found'});
    }


    res.status(200).json({
      eventId: event._id,
      title: event.title,
      date: event.date,
      registeredUsers: event.registeredUsers,
      attendedUsers: event.attendedUsers,
    });

  }catch(err){
    console.log("Error while fetching  registrations",err);
    res.status(500).json({message:'Internal server error'});
  }



};