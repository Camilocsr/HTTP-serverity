/* This code snippet is setting up routes for handling admin-related operations in a Node.js
application using the Express framework. Here's a breakdown of what each part does: */

const express = require('express');
const { addAdmin,getAdmin,authenticateAdmin,deleteAdmin } = require('../controllers/adminController');
const api = express.Router();

api.post('/Admins', addAdmin);
api.get('/Admins',getAdmin)
api.post('/admins/login',authenticateAdmin);
api.delete('/admins/:adminId', deleteAdmin);

module.exports = api;