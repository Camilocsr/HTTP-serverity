const express = require('express');
const { addAdmin,getAdmin,authenticateAdmin,deleteAdmin } = require('../controllers/adminController');
const api = express.Router();

api.post('/Admins', addAdmin);
api.get('/Admins',getAdmin)
api.post('/admins/login',authenticateAdmin);
api.delete('/admins/:adminId', deleteAdmin);

module.exports = api;