const express = require('express');
const { addStudent,getStudents,authenticateStudent,editStudent,deleteStudent,exportExcel } = require('../controllers/studentsController');
const {main,MensajeTCP} = require('../controllers/OpenAi')
const api = express.Router();

api.post('/Students', addStudent);
api.get('/Students',getStudents);
api.post('/Students/login',authenticateStudent);
api.post('/Students/edition/:nameStudent',editStudent);
api.delete('/Students/delete/:id', deleteStudent);
api.get('/Students/export-excel',exportExcel);
api.post('/OpenAi', MensajeTCP);

module.exports = api;