const express = require('express');
const router = express.Router();
const app = express();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
require('dotenv').config();
const bodyParser = require('body-parser');
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


router.post('/', async (req, res) => {
    const { body } = req.body
    req.body.date = `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`

    if (!req.body.name || req.body.name === '' || !req.body.email || req.body.email === '') {
        return res.status(400).send('Cannot send message, please provide your name and email')
    }
    //test email
    if (!(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email))) {
        res.status(400).send('Please enter a valid email address');
        return
    }

    if (!req.body.message || req.body.message == '') {
        res.status(400).send('Please provide a message to send!')
        return
    }
    let message = `${req.body.name} Sent a message on the Crunchee Munchies website: \n ${req.body.message} \n reply @ ${req.body.email}`

    async function sendMail(subject, text, address) {
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
                text: text
            }
            const result = transport.sendMail(mailOptions)
            return result;
        }
        catch (err) {
            console.log('error')
            res.status(400).send('Could not send message, please try again later')
            return
        }
    }
    //send mail first to vendor
    sendMail(`test: ${req.body.name} Sent a message`, message, `cruncheemunchies@gmail.com`)
    .then(result => {
        res.status(200).send('message sent')
        let customMessage = `Thanks ${req.body.name} for contacting us. We will get back to you regarding any questions or concerns you may have! have a great day!`

        //send mail to potential customer
        sendMail('Thanks for contacting Crunchee Munchies', customMessage, req.body.email).then(result=>{
            console.log('message attempt to customer sent?')
        }).catch (err=>{
            if(err) console.log('message to customer not sent!')
        })
        return
    }).catch(err => {
        console.log('not sent')
        res.status(400).send('not sent')
    }
    )
})


module.exports = router;