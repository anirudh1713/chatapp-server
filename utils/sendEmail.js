const nodemailer = require('nodemailer');

const sendEmail = (receiver, subject, content) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS
    }
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: receiver,
    subject: subject,
    html: content
  };

  //TODO error handling
  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log(err);
    }else {
      console.log('email sent');
    }
  });
};

module.exports = sendEmail;