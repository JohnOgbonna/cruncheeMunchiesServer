const express = require('express');
const app = express();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();
const bodyParser = require('body-parser');
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
const {customerMessage} = require('../mail/sendOrderMail')
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


module.exports ={
    sendMail: sendMail
}
async function sendMail(res, req) {
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
        to: `cruncheemunchies@gmail.com`,
        subject: `test: \n ${req.body.fullName} requested an order on crunchee munchies.com!`,
        html: customerMessage(req.body.date, req.body.type, req.body.order, req.body.firstName, req.body.message),
        text: 'Order!'
      }
      console.log('access token: \n', accessToken);
      const result = transport.sendMail(mailOptions)
      return result;
    } 
    catch (err) {
      console.log('error')
      return('Could not send message, please try again later')
    }
  }