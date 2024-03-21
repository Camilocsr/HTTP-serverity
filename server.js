require('dotenv');
const connectDB = require('./db/mongodb')
const { port, DB, DB_HOST, DB_PORT, DB_NAME } = require('./config');
const app = require('./app')

/**
 * The `startServer` function asynchronously connects to a database and starts a server listening on a
 * specified port.
 */
async function startServer() {
  try {
    // await connectDB(DB, DB_HOST, DB_PORT, DB_NAME);

    app.listen(port, () => {
      console.log(`Queda iniciado el servidor CSR😁👌 en el puerto ${port}`);
    });
  } catch (error) {
    console.error(`Error al inicializar todo tu server: ${error}`);
    process.exit(0)
  }
}

startServer();