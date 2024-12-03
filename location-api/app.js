//////////////////////
// EXTERNAL IMPORTS //
//////////////////////
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();

//////////////////////
// INTERNAL IMPORTS //
//////////////////////
const upServer = require('./utils/upServer');
const locationRoutes = require('./routes/location');

const app = express();
//////////////////////////////////
//         SET UP SERVER        //
// 1. ALLOW JSON IN REQ AND RES //
// 2. ALLOW REQ FROM ANY ORIGIN //
// 3. SET UP ROUTES             //
//////////////////////////////////

// 1. ALLOW JSON IN REQ AND RES
app.use(express.json());

// 2. ALLOW REQ FROM ANY ORIGIN
app.use(cors());

// 3. SET UP ROUTES
app.use('/api/location', locationRoutes);

const serverName = 'location';
const serverPort = process.env.LOCATION_SERVER_PORT;

const onSucessMessage = `${serverName} microservice is running at Port: ${serverPort}`;
const onFailMessage = `upServer ${serverName} ERROR:`;

upServer(app, serverName, serverPort, onSucessMessage, onFailMessage);
