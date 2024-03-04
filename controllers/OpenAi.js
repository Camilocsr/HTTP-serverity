const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const wav = require('wav');

const openai = new OpenAI({
  apiKey: "bkFJtwljUXKDsMqkiWfz7mZZ",
});

let processingAudio = false;

async function main(text) {
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: text }],
      model: 'gpt-3.5-turbo',
      max_tokens: 100,
      temperature: 0.2,
    });

    const response = chatCompletion.choices[0].message.content;
    console.log('Respuesta de OpenAI:', response);
    return response;
  } catch (error) {
    console.error('Error al completar la conversación con OpenAI:', error);
    throw error;
  }
}

const handleAudioUpload = async (req, res) => {
  if (processingAudio) {
    res.writeHead(409, { 'Content-Type': 'text/plain' });
    res.end('Error: Ya se está procesando un audio');
    return;
  }

  processingAudio = true;

  if (req.method === 'POST' && req.url === '/OpenAi') {
    let isNewAudio = true; // Restablecer la bandera isNewAudio aquí
    
    // Vaciar la carpeta audioFTP antes de procesar otro audio
    try {
      const files = fs.readdirSync('audioFTP');
      files.forEach((file) => {
        const filePath = path.join('audioFTP', file);
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado: ${filePath}`);
      });
    } catch (error) {
      console.error('Error al vaciar la carpeta audioFTP:', error);
    }

    const audioFilePath = 'audioFTP/audio.wav';
    
    if (fs.existsSync(audioFilePath)) {
      const previousAudioContent = fs.readFileSync(audioFilePath);
      let newAudioContent = Buffer.alloc(0);

      req.on('data', (chunk) => {
        newAudioContent = Buffer.concat([newAudioContent, chunk]);
      });

      req.on('end', async () => {
        if (Buffer.compare(previousAudioContent, newAudioContent) === 0) {
          isNewAudio = false;
        }

        // Continuar con el procesamiento del audio después de verificar si es nuevo
        await continueAudioProcessing(req, audioFilePath, isNewAudio, res);
      });
    } else {
      // Si el archivo no existe, continuar con el procesamiento del audio
      await continueAudioProcessing(req, audioFilePath, isNewAudio, res);
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 - Not Found');
  }
};

const continueAudioProcessing = async (req, audioFilePath, isNewAudio, res) => {
  const audioFileStream = new wav.FileWriter(audioFilePath, {
    channels: 1,
    sampleRate: 44100,
    bitDepth: 16,
  });

  const writePromise = new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      audioFileStream.write(chunk);
    });

    req.on('end', () => {
      audioFileStream.end();
      console.log('Archivo de audio recibido y guardado:', audioFilePath);
      resolve();
    });

    req.on('error', (error) => {
      reject(error);
    });
  });

  try {
    await writePromise;

    if (isNewAudio) {
      const textoModificado = await audioFun(audioFilePath);
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(textoModificado);
    } else {
      console.log('El audio recibido es igual al anterior. No se realizará la transcripción.');
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('El audio recibido es igual al anterior. No se realizará la transcripción.');
    }
  } catch (error) {
    console.error('Error en el manejo del audio:', error);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Error en el manejo del audio');
  } finally {
    processingAudio = false;
  }
};

const audioFun = async (audioFilePath) => {
  try {
    
    if (path.extname(audioFilePath).toLowerCase() !== '.wav') {
      throw new Error('El archivo no es un archivo WAV');
    }

    
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-1",
      sample_rate: 44100,
      language: "es",
      format: "wav",
      punctuation: true,
      word_level: true
    });

    
    let textoWisper = transcription.text;
    const textoModificado = await main(textoWisper);

    
    fs.unlinkSync(audioFilePath);

    return textoModificado;
  } catch (error) {
    console.error('Error al crear la transcripción de audio con OpenAI:', error);
    throw error;
  }
};

module.exports = {
  handleAudioUpload
};