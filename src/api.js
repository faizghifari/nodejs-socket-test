const io = require('socket.io-client')

const socket = io('http://localhost:8000/charts', {
    path: '/chartpath'
});

function getChartData(cb) {
    socket.on('data', data => cb(null, data));
}

export { getChartData }