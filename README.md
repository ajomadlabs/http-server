# HTTP Server from Scratch - Learning Journey

A step-by-step implementation of an HTTP server from scratch using Node.js. This project is designed to help developers understand how HTTP servers work at a fundamental level by building one progressively.

## Project Goal

The goal is to build a complete HTTP server from scratch, understanding each component as we add it. We'll start with basic TCP connections and gradually build up to implementing the core GET and POST HTTP methods.

## Current Implementation: Step 3 - HTTP Response Generation

### What We Have So Far

In this step, we've added complete HTTP response generation:
- ✅ Accepts TCP connections
- ✅ Receives raw data
- ✅ Parses HTTP requests according to HTTP specification
- ✅ **NEW**: Generates proper HTTP responses according to HTTP specification
- ✅ **NEW**: Sends simple text responses with request details
- ✅ **NEW**: Handles error responses with proper status codes
- ❌ Doesn't handle different routes yet
- ❌ Doesn't have middleware system yet

### HTTP Response Specification Implementation

The HTTP specification defines that a response consists of:
1. **Status Line**: `VERSION STATUS_CODE STATUS_MESSAGE`
2. **Headers**: Key-value pairs separated by `:`
3. **Empty Line**: `\r\n\r\n` marks the end of headers
4. **Body**: Response data after the empty line

#### The `createResponse()` Method

```javascript
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
```

#### How HTTP Response Generation Works

**1. Status Line Creation:**
- Format: `HTTP/1.1 STATUS_CODE STATUS_MESSAGE`
- Example: `HTTP/1.1 200 OK`
- Status codes follow HTTP specification (200, 400, 404, 500, etc.)

**2. Header Generation:**
- **Content-Type**: Specifies the type of response (text/plain, text/html, application/json)
- **Content-Length**: Size of the body in bytes (calculated automatically)
- **Connection**: Set to 'close' for simple HTTP/1.1 responses
- **Custom Headers**: Can be passed as parameters

**3. Body Attachment:**
- Empty line (`\r\n\r\n`) separates headers from body
- Body can be plain text, HTML, JSON, or any content type
- Content-Length header must match actual body size

**4. Complete Response Structure:**
```
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 234
Connection: close

Request received successfully!

Method: GET
Path: /
Version: HTTP/1.1

Headers:
  host: localhost:4000
  user-agent: curl/7.68.0

Body: (empty)

This is a simple HTTP response showing the parsed request details.
```

### HTTP Response Structure

The generated response follows the HTTP/1.1 specification:

```javascript
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Length: 234
Connection: close

Request received successfully!

Method: GET
Path: /
Version: HTTP/1.1

Headers:
  host: localhost:4000
  user-agent: curl/7.68.0

Body: (empty)

This is a simple HTTP response showing the parsed request details.
```

### Status Code Handling

Our server now handles different HTTP status codes:

- **200 OK**: Successful response
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid HTTP request format
- **404 Not Found**: Resource not found (will implement in next step)
- **500 Internal Server Error**: Server error

### Error Response Generation

When parsing fails, we send a proper error response:

```javascript
const errorResponse = this.createResponse(400, {
    'Content-Type': 'text/plain'
}, 'Bad Request - Invalid HTTP format');
```

This generates:
```
HTTP/1.1 400 Bad Request
Content-Type: text/plain
Content-Length: 35
Connection: close

Bad Request - Invalid HTTP format
```

### Complete Request-Response Flow

Now our server handles the complete HTTP cycle:

1. **Client sends HTTP request** → TCP connection established
2. **Server receives raw data** → Accumulates until complete request
3. **Server parses request** → Extracts method, path, headers, body
4. **Server generates response** → Creates proper HTTP response
5. **Server sends response** → Client receives formatted response
6. **Connection closes** → TCP connection terminated

### Enhanced Logging

We now log both request parsing and response generation:

```
=== HTTP Request Parsed ===
Method:: GET
Path:: /
Version:: HTTP/1.1
Headers:: { host: 'localhost:4000', user-agent: 'curl/7.68.0' }
Body:: 
==========================

=== HTTP Response Generated ===
Status: 200 OK
Headers: { 'Content-Type': 'text/plain', 'Content-Length': 234 }
==========================
```

## How to Run

```bash
node http-server.js
```

You should see:
```
Server Started at Port:: 4000
```

## Testing the Current Implementation

You can test the complete HTTP request-response cycle:

```bash
# Basic GET request
curl http://localhost:4000/

# POST request with body
curl -X POST -H "Content-Type: application/json" \
  -d '{"message": "Hello World"}' \
  http://localhost:4000/api/test

# Request with custom headers
curl -H "X-Custom-Header: test" \
  -H "Authorization: Bearer token123" \
  http://localhost:4000/
```

When you make requests, you'll see:
1. **Request parsing logs** showing the parsed HTTP request
2. **Response generation logs** showing the HTTP response details
3. **Plain text response** showing the request details in a clear, readable format

## Learning Points

### HTTP Response Specification
- **Status Line**: Must include version, status code, and status message
- **Headers**: Key-value pairs with proper formatting
- **Body Separation**: Empty line (`\r\n\r\n`) required between headers and body
- **Content-Length**: Must accurately reflect body size in bytes

### HTTP Status Codes
- **2xx Success**: 200 OK, 201 Created
- **4xx Client Error**: 400 Bad Request, 404 Not Found
- **5xx Server Error**: 500 Internal Server Error

### Content-Type Headers
- **text/plain**: For simple text responses (what we're using)
- **text/html**: For HTML responses
- **application/json**: For JSON responses
- **image/png**: For image responses

### Buffer.byteLength()
- **Purpose**: Calculates the exact byte length of a string
- **Why Important**: Content-Length header must be accurate
- **Example**: `Buffer.byteLength("Hello")` returns `5`

### HTTP/1.1 vs HTTP/1.0
- **HTTP/1.1**: Supports persistent connections (Connection: keep-alive)
- **HTTP/1.0**: Defaults to Connection: close
- **Our Implementation**: Uses Connection: close for simplicity

## Next Steps

In upcoming commits, we'll implement the core HTTP methods:

1. **GET Method Implementation**: Handle GET requests with proper responses
2. **POST Method Implementation**: Handle POST requests with body parsing

**Note**: We're focusing only on GET and POST methods as these are the most fundamental HTTP methods. This keeps the learning focused and manageable.

## Contributing

This is a learning project! Feel free to:
- Ask questions about the implementation
- Suggest improvements
- Create issues for bugs
- Submit pull requests with enhancements

**Current Commit**: Step 3 - HTTP Response Generation Implementation
**Next**: GET Method Implementation
