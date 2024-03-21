const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ExcelJS = require('exceljs');
const Student = require('../models/Student');

/**
 * The function `addStudent` is an asynchronous function in JavaScript that adds a new student with
 * their details and activities to a database, handling errors appropriately.
 * @param req - The `req` parameter in the `addStudent` function is typically an object representing
 * the HTTP request. It contains information about the request made to the server, such as the request
 * headers, body, parameters, and more. In this case, the `req.body` is used to extract data sent
 * @param res - The `res` parameter in the `addStudent` function is the response object that will be
 * used to send a response back to the client making the request. In this case, it is used to send a
 * JSON response with status codes and messages to indicate the outcome of the operation.
 * @returns The function `addStudent` is returning a response based on the outcome of the operation. If
 * the student already exists in the database, it returns a status of 400 with a message indicating
 * that the student already exists. If the student is successfully added to the database, it returns a
 * status of 200 with the stored student object in the response. If an error occurs during the process,
 * it returns
 */
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


/**
 * The function `getStudents` asynchronously retrieves student data from the database and sends it as a
 * response, handling errors appropriately.
 * @param req - The `req` parameter in the `getStudents` function typically represents the HTTP request
 * object, which contains information about the incoming request such as headers, parameters, and body
 * data. This object is used to retrieve data sent by the client to the server.
 * @param res - The `res` parameter in the `getStudents` function is the response object that is used
 * to send a response back to the client making the request. In this case, it is being used to send a
 * response with the list of students retrieved from the database or an error message if there was an
 */
async function getStudents(req, res) {
  try {
    const students = await Student.find().lean().exec();
    res.status(200).send({ students });
  } catch (error) {
    console.error('Error al traer los datos de los estudiantes.', error);
    res.status(500).send({ message: 'Error interno del servidor' });
  }
}

/**
 * The function `authenticateStudent` is an asynchronous function that compares the password entered by
 * a student with the password stored in the database for authentication.
 * @param req - The `req` parameter in the `authenticateStudent` function typically represents the
 * request object, which contains information about the HTTP request that is being made. This object
 * includes properties such as `body` (which contains the parsed request body), `params` (which
 * contains route parameters), `query` (
 * @param res - The `res` parameter in the `authenticateStudent` function is the response object that
 * will be used to send the response back to the client making the request. It is typically used to set
 * the status code and send data in the response, such as JSON data or HTML content.
 * @returns The function `authenticateStudent` returns a JSON response with a message indicating the
 * result of the authentication process.
 */
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

/**
 * The function `editStudent` updates a student's data in a database based on the provided request
 * parameters and body, handling errors accordingly.
 * @param req - The `req` parameter in the `editStudent` function stands for the request object. It
 * contains information about the HTTP request that triggered the function, such as request parameters,
 * headers, body, and more. In this case, the function is expecting to receive data related to a
 * student to be edited
 * @param res - The `res` parameter in the `editStudent` function is the response object that will be
 * used to send a response back to the client making the request. It is typically used to send HTTP
 * responses with status codes and data back to the client. In this function, it is used to send a
 * @returns The function `editStudent` is returning a JSON response with the updated student data if
 * the student is found and updated successfully. If the student is not found, it returns a 404 status
 * with a message "Student not found". If there is an error during the process, it returns a 500 status
 * with an error message.
 */
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


/**
 * The function `exportExcel` retrieves student data from a database, creates an Excel file with the
 * data, and sends it as a downloadable file to the client.
 * @param req - The `req` parameter in your `exportExcel` function typically represents the HTTP
 * request object, which contains information about the incoming request such as headers, parameters,
 * and body data. It is commonly used to access data sent by the client to the server.
 * @param res - The `res` parameter in your `exportExcel` function represents the response object in
 * Node.js. It is used to send the response back to the client making the request. In this case, you
 * are using it to send an Excel file as a response to the client.
 */
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