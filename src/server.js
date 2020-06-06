const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
const path = require('path');
const socketio = require('socket.io');
const http = require('http');
const wakeUpDyno = require('./wakeUpDyno');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb+srv://omnistack:omnistack@teste-usfrr.mongodb.net/semana09?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const connectedUsers = {};

io.on('connection', socket => {
    console.log('Client connected');
    const { user_id } = socket.handshake.query;
    connectedUsers[user_id] = socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

// GET, POST, PUT, DELETE

// req.query = Acessar query params ( para filtros )
// req.params = Acessar route params ( para edicao, delete )
// req.body = Acessar corpo da requisicao ( para criacao, edicao )

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

const port = process.env.PORT || 3333;
server.listen(port);