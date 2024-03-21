/* This code snippet is setting up routes for a Node.js application using the Express framework. Here's
a breakdown of what each part is doing: */
const express = require('express');
const { addStudent,getStudents,authenticateStudent,editStudent,deleteStudent,exportExcel } = require('../controllers/studentsController');
const {handleAudioUpload, MensajeResivido } = require('../controllers/OpenAi');
const api = express.Router();

api.post('/Students', addStudent);
api.get('/Students',getStudents);
api.post('/Students/login',authenticateStudent);
api.post('/Students/edition/:nameStudent',editStudent);
api.delete('/Students/delete/:id', deleteStudent);
api.get('/Students/export-excel',exportExcel);
api.post('/OpenAi', handleAudioUpload);
api.get('/MensajeResivido', MensajeResivido);
module.exports = api;