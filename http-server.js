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
        
        return { method, path, version, headers, body };
    }

    createResponse(statusCode = 200, headers = {}, body = '') {
        const statusMessages = {
            200: 'OK',
            201: 'Created',
            400: 'Bad Request',
            404: 'Not Found',
            500: 'Internal Server Error'
        };
        
        const statusMessage = statusMessages[statusCode] || 'Unknown';
        
        let response = `HTTP/1.1 ${statusCode} ${statusMessage}\r\n`;
        
        const defaultHeaders = {
            'Content-Type': 'text/plain',
            'Content-Length': Buffer.byteLength(body),
            'Connection': 'close',
            ...headers
        };
        
        for (const [key, value] of Object.entries(defaultHeaders)) {
            response += `${key}: ${value}\r\n`;
        }
        
        response += '\r\n';
        
        response += body;
        
        return response;
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
                        
                        // Create simple text response
                        const responseBody = `Request received successfully!

                        Method: ${request.method}
                        Path: ${request.path}
                        Version: ${request.version}

                        Headers:
                            ${Object.entries(request.headers).map(([key, value]) => `  ${key}: ${value}`).join('\n')}

                        Body: ${request.body || '(empty)'}

                        This is a simple HTTP response showing the parsed request details.`;

                        const response = this.createResponse(200, {
                            'Content-Type': 'text/plain'
                        }, responseBody);
                        
                        console.log('=== HTTP Response Generated ===');
                        console.log('Status: 200 OK');
                        console.log('Headers:', {
                            'Content-Type': 'text/plain',
                            'Content-Length': Buffer.byteLength(responseBody)
                        });
                        console.log('==========================');
                        
                        socket.write(response);
                        socket.end();
                        
                    } catch (error) {
                        console.log('Error parsing HTTP request::', error);
                        
                        const errorResponse = this.createResponse(400, {
                            'Content-Type': 'text/plain'
                        }, 'Bad Request - Invalid HTTP format');
                        
                        socket.write(errorResponse);
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
