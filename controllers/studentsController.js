const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');
const Student = require('../models/Student');

async function addStudent(req, res) {
  try {
      const { nameStudent, pasworStudent, Nombre1,Correctas1, incorrectas1,Nombre2,Correctas2,incorrectas2,Nombre3,Correctas3,incorrectas3 } = req.body;


      const existingStudent = await Student.findOne({ nameStudent });

      if (existingStudent) {
          return res.status(400).json({ message: 'Este estudiante ya existe' });
      }

      const student = {
          nameStudent,
          pasworStudent,
          Actividad1:{
            Nombre1,
            Correctas1,
            incorrectas1,
          },
          Actividad2:{
            Nombre2,
            Correctas2,
            incorrectas2,
          },
          Actividad3:{
            Nombre3,
            Correctas3,
            incorrectas3,
          },
      };

      console.log(student.pasworStudent);
      const studentStored = await Student.create(student);
      res.status(200).send({ studentStored });
  } catch (error) {
      res.status(500).send({ message: error.message });
  }
};


async function getStudents(req, res) {
  try {
    const students = await Student.find().lean().exec();
    res.status(200).send({ students });
  } catch (error) {
    console.error('Error al traer los datos de los estudiantes.', error);
    res.status(500).send({ message: 'Error interno del servidor' });
  }
}

async function authenticateStudent(req, res) {
  try {
    const { nameStudent, pasworStudent } = req.body;

    
    const student = await Student.findOne({ nameStudent });

    if (!student) {
      return res.status(404).json({ message: 'Estudiante no encontrado' });
    }

    // Comparar la contraseña ingresada en texto plano con la contraseña almacenada en texto plano
    const passwordMatch = pasworStudent === student.pasworStudent;

    console.log('Contraseña ingresada por el usuario:', pasworStudent);
    console.log('Contraseña almacenada en la base de datos:', student.pasworStudent);
    console.log('¿Coinciden las contraseñas en texto plano?', passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Autenticación exitosa' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const editStudent = async (req, res) => {
  try {
    const { nameStudent } = req.params;
    const { pasworStudent, Nombre1, Correctas1, incorrectas1, Nombre2, Correctas2, incorrectas2, Nombre3, Correctas3, incorrectas3 } = req.body;

    const studentData = {
      pasworStudent,
      Actividad1: {
        Nombre1,
        Correctas1,
        incorrectas1
      },
      Actividad2: {
        Nombre2,
        Correctas2,
        incorrectas2
      },
      Actividad3: {
        Nombre3,
        Correctas3,
        incorrectas3
      }
    };

    const studentStored = await Student.findOneAndUpdate({ nameStudent }, studentData, { new: true });
    if (!studentStored) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ studentStored });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


async function deleteStudent(req, res) {
  try {
    const studentId = req.params.id;

    // Lógica para eliminar al estudiante de la base de datos
    const deletedStudent = await Student.findByIdAndDelete(studentId);

    if (!deletedStudent) {
      return res.status(404).send({ message: 'Estudiante no encontrado' });
    }

    res.status(200).send({ message: 'Estudiante eliminado exitosamente' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}


async function exportExcel(req, res) {
  try {
    // Consultar datos de estudiantes desde la base de datos (sin la posición)
    const students = await Student.find({}, '-_id nameStudent pasworStudent').lean();

    // Crear un nuevo libro de trabajo y hoja de cálculo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Agregar datos al archivo Excel
    worksheet.addRow(['Nombre', 'Contraseña']);
    students.forEach(student => {
      worksheet.addRow([student.nameStudent, student.pasworStudent]);
    });

    // Configurar las cabeceras de la respuesta para indicar que se está enviando un archivo Excel
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');

    // Enviar el libro de trabajo como una secuencia de bytes al cliente
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error al exportar datos:', error);
    res.status(500).send('Error interno del servidor');
  }
}

module.exports = {
  addStudent,
  getStudents,
  authenticateStudent,
  editStudent,
  deleteStudent,
  exportExcel
};