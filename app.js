/* This code snippet is setting up a Node.js server using Express framework. Here's a breakdown of what
each part is doing: */
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const productsRoutes = require('./routes/product');
const adminRoutes = require('./routes/admin');
const studentsRoutes = require('./routes/student')

app = express();// creo la app express.

app.use(cors());// permitir protocolos http desde apps externas.

app.use(bodyParser.urlencoded({extended:false}));// esto parsea a un objeto js
app.use(bodyParser.json())

app.use('/public',express.static(`${__dirname}/storage/imgs`));//direccion falsa la cual le aparecera al cliente.
app.use('/v1',productsRoutes);
app.use('/v1',adminRoutes);
app.use('/v1',studentsRoutes);

module.exports = app;