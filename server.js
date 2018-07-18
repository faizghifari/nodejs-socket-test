var io = require('socket.io')({
    path: '/chartpath'
});

var port = 8000;

var chartNsp = io.of('/charts');
chartNsp.on('connection', (client) => {
    console.log('a Client Connected');

    client.on('disconnect', () => {
        console.log('a Client Disconnected');
    });
});

setInterval(() => {
    data = Math.random() * (40 - 20) + 20;
    chartNsp.emit('data', data);
}, 1000);

io.listen(port);
console.log('Listening on port : ', port)