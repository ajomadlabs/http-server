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

    handleGET(request) {
        console.log('=== GET Request Handling ===');
        console.log('RFC 7231: GET method is safe and idempotent');
        console.log('Path:', request.path);
        console.log('Headers:', request.headers);
        console.log('Body length:', request.body.length);
        console.log('==========================');

        if (request.body.length > 0) {
            console.log('Warning: GET request contains body (RFC 7231 violation)');
        }

        const urlParts = request.path.split('?');
        const path = urlParts[0];
        const queryString = urlParts[1] || '';
        
        const queryParams = {};
        if (queryString) {
            queryString.split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (key) {
                    queryParams[decodeURIComponent(key)] = decodeURIComponent(value || '');
                }
            });
        }

        let responseBody = '';
        let statusCode = 200;

        switch (path) {
            case '/':
                responseBody = `GET Request Received Successfully!

                    RFC 7231 Compliance:
                    - Method: GET (Safe and Idempotent)
                    - Path: ${path}
                    - Version: ${request.version}

                    Request Details:
                    - Host: ${request.headers.host || 'Not specified'}
                    - User-Agent: ${request.headers['user-agent'] || 'Not specified'}
                    - Accept: ${request.headers.accept || 'Not specified'}

                    Query Parameters: ${Object.keys(queryParams).length > 0 ? 
                        Object.entries(queryParams).map(([k, v]) => `${k}=${v}`).join(', ') : 
                        'None'}

                    RFC References:
                    - RFC 7231: HTTP/1.1 Semantics and Content (GET method)
                    - RFC 3986: Uniform Resource Identifier (URI) Generic Syntax
                    - RFC 7230: HTTP/1.1 Message Syntax and Routing`;
                break;

            case '/api/status':
                responseBody = `Server Status (GET /api/status)

                    RFC 7231: GET method for resource retrieval
                    Status: Running
                    Timestamp: ${new Date().toISOString()}
                    Uptime: ${process.uptime().toFixed(2)} seconds
                    Port: ${this.port}

                    RFC Compliance:
                    - Safe: GET requests should not cause side effects
                    - Idempotent: Multiple identical GET requests have same effect
                    - Cacheable: GET responses can be cached (RFC 7234)`;
                break;

            case '/api/info':
                responseBody = `HTTP Server Information (GET /api/info)

                    RFC 7231 GET Method Characteristics:
                    1. Safe: No side effects on server state
                    2. Idempotent: Multiple requests produce same result
                    3. Cacheable: Responses can be cached
                    4. Body: Should not have request body (RFC 7231 Section 4.3.1)

                    Request Information:
                    - Method: ${request.method}
                    - Path: ${request.path}
                    - Version: ${request.version}
                    - Headers Count: ${Object.keys(request.headers).length}

                    RFC References:
                    - RFC 7231 Section 4.3.1: GET method definition
                    - RFC 7234: HTTP/1.1 Caching
                    - RFC 3986: URI syntax and query parameters`;
                break;

            default:
                statusCode = 404;
                responseBody = `404 Not Found

                    RFC 7231: GET method for resource retrieval
                    Requested path '${path}' not found.

                    Available GET endpoints:
                    - GET / - Welcome page
                    - GET /api/status - Server status
                    - GET /api/info - Server information

                    RFC 7231 Section 6.5.4: 404 Not Found status code
                    The origin server did not find a current representation for the target resource.`;
        }

        return this.createResponse(statusCode, {
            'Content-Type': 'text/plain'
        }, responseBody);
    }

    handlePOST(request) {
        console.log('=== POST Request Handling ===');
        console.log('RFC 7231: POST method for resource creation');
        console.log('Path:', request.path);
        console.log('Headers:', request.headers);
        console.log('Body length:', request.body.length);
        console.log('==========================');

        let parsedBody = {};
        let contentType = request.headers['content-type'] || 'text/plain';
        
        try {
            if (contentType.includes('application/json')) {
                parsedBody = JSON.parse(request.body);
            } else if (contentType.includes('application/x-www-form-urlencoded')) {
                request.body.split('&').forEach(param => {
                    const [key, value] = param.split('=');
                    if (key) {
                        parsedBody[decodeURIComponent(key)] = decodeURIComponent(value || '');
                    }
                });
            } else {
                parsedBody = { content: request.body };
            }
        } catch (error) {
            console.log('Error parsing POST body:', error);
            return this.createResponse(400, {
                'Content-Type': 'text/plain'
            }, 'Bad Request - Invalid request body format');
        }

        let responseBody = '';
        let statusCode = 201;

        switch (request.path) {
            case '/api/users':
                responseBody = `POST Request Processed Successfully!

                    RFC 7231 Compliance:
                    - Method: POST (Resource Creation)
                    - Path: ${request.path}
                    - Version: ${request.version}
                    - Status: 201 Created

                    Request Details:
                    - Content-Type: ${contentType}
                    - Body Length: ${request.body.length} bytes
                    - Host: ${request.headers.host || 'Not specified'}

                    Parsed Body:
                    ${JSON.stringify(parsedBody, null, 2)}

                    RFC 7231 Section 4.3.3: POST method characteristics:
                    1. Not Safe: May cause side effects on server
                    2. Not Idempotent: Multiple requests may have different effects
                    3. Not Cacheable: Responses should not be cached
                    4. Body: Contains data to be processed

                    RFC References:
                    - RFC 7231 Section 4.3.3: POST method definition
                    - RFC 7231 Section 6.3.2: 201 Created status code
                    - RFC 3986: URI syntax and resource identification`;
                break;

            case '/api/data':
                responseBody = `Data Processing Complete (POST /api/data)

                    RFC 7231: POST method for data processing
                    Status: 201 Created
                    Timestamp: ${new Date().toISOString()}

                    Received Data:
                    ${JSON.stringify(parsedBody, null, 2)}

                    Processing Results:
                    - Data Type: ${contentType}
                    - Fields Count: ${Object.keys(parsedBody).length}
                    - Processing Time: ${Date.now()}ms

                    RFC Compliance:
                    - Not Safe: POST may cause side effects
                    - Not Idempotent: Multiple requests may have different effects
                    - Not Cacheable: Responses should not be cached
                    - Body Required: POST requests should have a body (RFC 7231 Section 4.3.3)`;
                break;

            case '/api/echo':
                responseBody = `Echo Response (POST /api/echo)

                    RFC 7231: POST method for data submission
                    Status: 200 OK

                    Original Request:
                    - Method: ${request.method}
                    - Path: ${request.path}
                    - Content-Type: ${contentType}
                    - Body Length: ${request.body.length} bytes

                    Echoed Data:
                    ${JSON.stringify(parsedBody, null, 2)}

                    RFC 7231 Section 4.3.3: POST method characteristics:
                    - Purpose: Submit data to be processed
                    - Body: Contains the data to be processed
                    - Response: Contains the result of processing`;
                break;

            default:
                statusCode = 404;
                responseBody = `404 Not Found

                    RFC 7231: POST method for resource creation
                    Requested path '${request.path}' not found.

                    Available POST endpoints:
                    - POST /api/users - Create user resource
                    - POST /api/data - Process data
                    - POST /api/echo - Echo back request data

                    RFC 7231 Section 6.5.4: 404 Not Found status code
                    The origin server did not find a current representation for the target resource.`;
        }

        return this.createResponse(statusCode, {
            'Content-Type': 'text/plain'
        }, responseBody);
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
                        

                        let response;
                        switch (request.method) {
                            case 'GET':
                                response = this.handleGET(request);
                                break;
                            case 'POST':
                                response = this.handlePOST(request);
                                break;
                            default:
                                response = this.createResponse(405, {
                                    'Content-Type': 'text/plain'
                                }, `405 Method Not Allowed - Method '${request.method}' not supported`);
                        }
                        
                        console.log('=== HTTP Response Generated ===');
                        console.log('Status: 200 OK');
                        console.log('Headers:', {
                            'Content-Type': 'text/plain',
                            'Content-Length': Buffer.byteLength(response) - response.indexOf('\r\n\r\n') - 4
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
