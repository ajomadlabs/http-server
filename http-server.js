const net = require('net');

class HTTP {
    constructor(port = 4000) {
        this.port = port;
        this.server = null;
    }

    start() {
        this.server = net.createServer((socket) => {
            console.log('Client connected::', socket.remoteAddress);
            
            socket.on('data',(data) => {
                console.log('Receieved Data in Bytes::', data);
                console.log('Recieved Data in String::', data.toString());
            })

            socket.on('error', (error) => {
                console.log('Socket Error ::', error);
            })

            socket.on('close', () => {
                console.log('Client Disconnected::', socket.remoteAddress);
            })
        })

        this.server.listen(this.port, ()=> {
            console.log('Server Started at Port::', this.port)
        })

        this.server.on('error',(error) => {
            console.log('Server Error::', error);
        })
    }
}

const httpServer = new HTTP(4000);
httpServer.start();

process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    if (httpServer.server) {
        httpServer.server.close(() => {
            console.log('Server stopped');
            process.exit(0);
        });
    }
});

module.exports = HTTP;
