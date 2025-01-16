import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass:process.env.PASSWORD
    },
  });

  // console.log("Transportor", transporter);

const sendEventEmail = async (recipientEmails, eventData) => {
  // console.log(eventData);
    const { eventName, description, eventTime } = eventData;
  
    const mailOptions = {
      from: "luharhartik2002@gmail.com",
      to: recipientEmails,
      subject: `Invitation to ${eventName}`,
      html: 
      `
        <h1>${eventName}</h1>
        <p>${description}</p>
        <p><strong>Date:</strong> ${eventTime}</p>
        <p>We look forward to seeing you there!</p>
      `,
    };
  
    try {
        // console.log(mailOptions);
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error.message);
    }
  };
  
export default sendEventEmail;


