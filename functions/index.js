/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const app = express();
const nodemailer = require('nodemailer');

app.use(cors);
app.use(cookieParser);

app.get('/', (req, res) => {
    // var smtpTransport = nodemailer.createTransport({
    //     host: 'smtp.gmail.com',
    //     port: 465,
    //     secure: true,
    //     auth: {
    //         user: "himanshukumar077@gmail.com",
    //         pass: "hvxglwmpwapxilgi"
    //     }
    // });

    // var mail = {
    //     from: "Job costing Web App <himanshukumar077@gmail.com>",
    //     to: req.query.to,
    //     subject: req.query.subject,
    //     text: req.query.mess,
    //     //html:req.params.mess,
    // }
    
    // smtpTransport.sendMail(mail, function (error, response) {
    //     res.send(req.query);
    // });

});

// This HTTPS endpoint can only be accessed by your Firebase Users.
// Requests need to be authorized by providing an `Authorization` HTTP header
// with value `Bearer <Firebase ID Token>`.
exports.app = functions.https.onRequest(app);

