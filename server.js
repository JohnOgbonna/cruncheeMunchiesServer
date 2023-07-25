const express = require('express');
const app = express();
const cors = require('cors'); 
console.log('started');
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
require('dotenv').config();
const orderRequestRoute = require('./routes/orderRequest')
const contactMessageRoute = require('./routes/contactMessage')
const port = process.env.PORT || 5001;
const router = express.Router();
const bodyParser= require('body-parser');


app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

  app.use('/orderRequest', orderRequestRoute);
  app.use('/contactMessage', contactMessageRoute)
  app.listen(port, () => {
    console.log(`Express is listening on port ${port}`);
  });