const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  nameStudent: {
    type: String,
    required: true
  },
  pasworStudent: {
    type: String,
    required: true
  },
  Actividad1: {
    Nombre1: String,
    Correctas1: Number,
    incorrectas1: Number
  },
  Actividad2: {
    Nombre2: String,
    Correctas2: Number,
    incorrectas2: Number
  },
  Actividad3: {
    Nombre3: String,
    Correctas3: Number,
    incorrectas3: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', StudentSchema);