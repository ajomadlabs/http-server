const net = require('net');

class HTTP {
    constructor(port = 4000) {
        this.port = port;
        this.server = null;
    }

    parseRequest(data) {
        const requestString = data.toString();
        const lines = requestString.split('\r\n');
        
        const requestLine = lines[0];
        const [method, path, version] = requestLine.split(' ');
        
        const headers = {};
        let bodyStartIndex = -1;
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            
            if (line === '') {
                bodyStartIndex = i + 1;
                break;
            }
            
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const key = line.substring(0, colonIndex).toLowerCase();
                const value = line.substring(colonIndex + 1).trim();
                headers[key] = value;
            }
        }
        
        let body = '';
        if (bodyStartIndex !== -1 && bodyStartIndex < lines.length) {
            body = lines.slice(bodyStartIndex).join('\r\n');
        }
        
        return {
            method,
            path,
            version,
            headers,
            body
        };
    }

    start() {
        this.server = net.createServer((socket) => {
            console.log('Client connected::', socket.remoteAddress);
            
            let data = '';
            
            socket.on('data', (chunk) => {
                data += chunk;
                
                if (data.includes('\r\n\r\n')) {
                    try {
                        const request = this.parseRequest(data);
                        console.log('=== HTTP Request Parsed ===');
                        console.log('Method::', request.method);
                        console.log('Path::', request.path);
                        console.log('Version::', request.version);
                        console.log('Headers::', request.headers);
                        console.log('Body::', request.body);
                        console.log('==========================');
                        
                    } catch (error) {
                        console.log('Error parsing HTTP request::', error);
                        socket.end();
                    }
                }
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
