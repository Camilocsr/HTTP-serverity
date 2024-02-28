const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: "",
});

async function main(text) {
  try {
    console.time("main"); // Iniciar el temporizador
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: 'user', content: text }],
      model: 'gpt-3.5-turbo',
      max_tokens: 100,
      temperature: 0.5,
    });

    const response = chatCompletion.choices[0].message.content;
    console.log('Respuesta de OpenAI:', response);
    console.timeEnd("main"); // Finalizar el temporizador
    return response;
  } catch (error) {
    console.error('Error al completar la conversación con OpenAI:', error);
    throw error;
  }
}

async function MensajeTCP(req, res) {
  try {
    console.time("MensajeTCP"); // Iniciar el temporizador
    const { texto } = req.body;
    console.log('Texto recibido:', texto);
    const textoModificado = await main(texto);
    console.timeEnd("MensajeTCP"); // Finalizar el temporizador

    res.status(200).json({ textoModificado });
  } catch (error) {
    console.error('Error al procesar el mensaje TCP:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

module.exports = {
  MensajeTCP
};