var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '<email address',
    pass: '<pass>'
  },
  tls: {
    rejectUnauthorized: false
}
});

var mailOptions = {
  from: '<sender\' email address>',
  to: '<reciever\' email address',
  subject: 'Amazon data',
  text: 'will send the data soon!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});