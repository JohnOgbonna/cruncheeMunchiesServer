const express = require('express');
const router = express.Router();
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();
const port = process.env.PORT || 5000;
const bodyParser = require('body-parser');
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
const { customerMessage } = require('../mail/sendOrderMail')

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

router.post('/', async (req, res) => {
  const { body } = req.body;
  req.body.date = `${new Date()}`
  if (!req.body.fullName || req.body.fullName.replace(/\s+/g, '') === '' || !req.body.email || req.body.email.replace(/\s+/g, '') === '') {
    return res.status(400).send('Could not send order request, need name and email')
  }

  //test email
  if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email))) {
    res.status(400).send('Please enter a valid email address');
  }

  if (req.body.needsDelivery && !(req.body.address.country && req.body.address.country && req.body.address.country)) {
    return res.status(400).send('Could not send order request, Address not Complete')
  }

  async function sendMail(subject, address, html, text) {

    try {
      const accessToken = await oAuth2Client.getAccessToken()
      const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: process.env.EMAIL1,
          clientSecret: process.env.CLIENT_SECRET,
          clientId: process.env.CLIENT_ID,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: accessToken,
        }
      });
      let mailOptions = {
        from: `cruncheemunchies.com <${process.env.EMAIL1}>`,
        to: address,
        subject: subject,
        html: html,
        text: text
      }
      const result = transport.sendMail(mailOptions)
      return result;
    }
    catch (err) {
      console.log('error')
      return res.status(400).send('Could not send message, please try again later')
    }
  }
  let subject = `test: \n ${req.body.fullName} requested an order on crunchee munchies.com!`

  sendMail(subject, `cruncheemunchies@gmail.com, ${req.body.email}`, customerMessage(req.body.date, req.body.type, req.body.order, req.body.firstName, req.body.message), '')
    .then(result => {
      console.log('Email sent', result)
      res.status(200).send('Your message has been sent!')

    })
    .catch(err => console.log('Not sent'));
})

module.exports = router;
