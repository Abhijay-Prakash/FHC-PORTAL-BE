import { error } from 'pdf-lib';
import { generateCertificateBuffer } from '../services/certificateService.js';
import { sendCertificateEmail } from '../services/mailService.js';
import Event from '../models/Event.js';
export async function sendCertificate(req, res) {
  try {
    const { name, email, event } = req.body;

    const pdfBuffer = await generateCertificateBuffer({ name, event });

    await sendCertificateEmail({
      to: email,
      name,
      event,
      pdfBuffer,
    });

    res.status(200).json({ message: 'Certificate sent successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send certificate.' });
  }
}


export async function sendCertificateToAll(req,res) {
  try{
    const {eventId} =  req.params;
    const event = await Event.findById(eventId).populate('registeredUsers');

    if(!event){
      return res.status(404).json({error: "Event not found"});
    }

    const {registeredUsers,title} = event;

    if(registeredUsers.length === 0){
      return res.status(400).json({error: "No attended users to send certificates to "});

    }

    const results = [];

    for(const user of registeredUsers){
      try{
        const pdfBuffer = await generateCertificateBuffer({name:user.name, event:title});

        await sendCertificateEmail({
          to:user.email,
          name:user.name,
          event:title,
          pdfBuffer,
        });
       
        results.push({email:user.email, status:'sent'});
      }catch(err){
        console.error("Failed to send certificate to ${user.email}:",err);
        results.push({email:user.email, status:'Failed'});
      }
    }

    res.status(200).json({
      message:'Certificate processing complete',
      results,
    });

  }catch (err) {
    console.error('Error in sendCertificatesToAllAttendees:', err);
    res.status(500).json({ error: 'Internal Server Error.' });
  }

}