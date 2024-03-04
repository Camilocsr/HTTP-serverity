# Descripción del Código

Este codigo es un servidor HTTP ideado y creado por Juan camilo Solano Rodriguez, se utilizo node.js con express, en el esta todo el codigo necesario para manejar peticiones http, como post, delete y get.

- **Carpeta controller**: En esta carpeta estan los methodos mas importantes de este Server, aca encontraras cuatro archivos js

## Funcionalidades Principales

- **Creacion de alumnos, eliminacion, edicion, actualizacion**: se hace una solicitud http de tipo post, delete o get depende de tus necesidades, a este server con los datos en tipo JSON los cuales especifique en la carpeta models, en esta carpeta encontraras todos los modelos los cuales resive la base de datos mongodb.


- **Creacion de administradores, eliminacion, edicion, actualizacion**: se hace una solicitud http de tipo post, delete o get depende de tus necesidades, a este server con los datos en tipo JSON los cuales especifique en la carpeta models, en esta carpeta encontraras todos los modelos los cuales resive la base de datos mongodb.


- **Recepcion de Audios**: Este server resive audios de tipo wav los cuales se envian via http post para procesarlos con openai, uso Wisper para trascribir el audio a texto despues se usa chatgpt turbo para que responda a la trascripcion que se realizo con wisper.