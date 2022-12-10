require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { logger, logEvents } = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const connectDB = require('./config/dbConn');
const socket = require('socket.io');
const PORT = process.env.PORT || 8000;

const app = express();

console.log(process.env.NODE_ENV);

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root'));
app.use('/api/auth', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messagesRoutes'));

app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ message: '404 Introuvable' });
  } else {
    res.type(txt).send('404 Introuvable');
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connecté à MongoDB');
});

const server = app.listen(PORT, () =>
  console.log(`Serveur connecté sur le port ${PORT}`)
);

mongoose.connection.on('error', (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoErrLog.log'
  );
});

const io = socket(server, {
  cors: { origins: 'http://localhost:3001', credentials: true },
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieved', data.message);
    }
  });
});
