# HTTP Server from Scratch - Learning Journey

A step-by-step implementation of an HTTP server from scratch using Node.js. This project is designed to help developers understand how HTTP servers work at a fundamental level by building one progressively.

## Project Goal

The goal is to build a complete HTTP server from scratch, understanding each component as we add it. We'll start with basic TCP connections and gradually build up to a full HTTP implementation.

## Current Implementation: Step 2 - HTTP Request Parsing

### What We Have So Far

In this step, we've added HTTP request parsing capabilities:
- ✅ Accepts TCP connections
- ✅ Receives raw data
- ✅ **NEW**: Parses HTTP requests according to HTTP specification
- ✅ **NEW**: Extracts HTTP method, path, version, headers, and body
- ✅ **NEW**: Handles complete HTTP request detection
- ❌ Doesn't send proper HTTP responses yet
- ❌ Doesn't handle different routes yet

### HTTP Request Specification Implementation

The HTTP specification defines that a request consists of:
1. **Request Line**: `METHOD PATH VERSION`
2. **Headers**: Key-value pairs separated by `:`
3. **Empty Line**: `\r\n\r\n` marks the end of headers
4. **Body**: Optional data after the empty line

#### The `parseRequest()` Method

```javascript
parseRequest(data) {
    const requestString = data.toString();
    const lines = requestString.split('\r\n');
    
    // Parse request line (first line)
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
```

#### How HTTP Request Parsing Works

**1. Request Line Parsing:**
- First line: `GET / HTTP/1.1`
- Split by space: `[method, path, version]`
- Example: `["GET", "/", "HTTP/1.1"]`

**2. Header Parsing:**
- Each header line: `Key: Value`
- Split by first colon: `key.toLowerCase()` and `value.trim()`
- Headers are case-insensitive according to HTTP spec
- Example: `{"host": "localhost:4000", "user-agent": "curl/7.68.0"}`

**3. Body Detection:**
- Empty line (`\r\n\r\n`) marks end of headers
- Everything after empty line is the body
- Body can be empty for GET requests

**4. Complete Request Detection:**
- We accumulate data until we see `\r\n\r\n`
- This ensures we have the complete HTTP request before parsing

### HTTP Request Structure

The parsed request object contains:

```javascript
{
    method: "GET",           
    path: "/",             
    version: "HTTP/1.1",    
    headers: {             
        "host": "localhost:4000",
        "user-agent": "curl/7.68.0",
        "accept": "*/*"
    },
    body: ""                
}
```

### Enhanced Data Handling

Instead of just logging raw data, we now:

```javascript
let data = '';

socket.on('data', (chunk) => {
    data += chunk;
    
   
    if (data.includes('\r\n\r\n')) {
        try {
            const request = this.parseRequest(data);
            console.log('=== HTTP Request Parsed ===');
            console.log('Method:', request.method);
            console.log('Path:', request.path);
            console.log('Version:', request.version);
            console.log('Headers:', request.headers);
            console.log('Body:', request.body);
            console.log('==========================');
            

            
        } catch (error) {
            console.log('Error parsing HTTP request:', error);
            socket.end();
        }
    }
});
```

### HTTP Specification Compliance

Our parser follows the HTTP/1.1 specification:

- **Request Line Format**: `METHOD SP PATH SP VERSION CRLF`
- **Header Format**: `KEY: VALUE CRLF`
- **Header Separation**: Empty line (`CRLF`)
- **Body**: Optional data after empty line
- **Line Endings**: `\r\n` (CRLF) as per HTTP spec

### Error Handling

We've added basic error handling:
- **Parsing Errors**: Return 400 Bad Request if request can't be parsed
- **Malformed Requests**: Gracefully handle incomplete or invalid HTTP requests
- **Connection Errors**: Log socket errors for debugging

## How to Run

```bash
node http-server.js
```

You should see:
```
Server Started at Port:: 4000
```

## Testing the Current Implementation

You can test the HTTP request parsing using:

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

When you make requests, you'll see detailed parsing output:
```
Client connected:: ::1
=== HTTP Request Parsed ===
Method: GET
Path: /
Version: HTTP/1.1
Headers: {
  host: 'localhost:4000',
  user-agent: 'curl/7.68.0',
  accept: '*/*'
}
Body: 
==========================
```

## Learning Points

### HTTP Protocol Structure
- **Request Line**: Contains method, path, and HTTP version
- **Headers**: Key-value pairs providing metadata
- **Body**: Optional data payload
- **Line Endings**: HTTP uses `\r\n` (CRLF) for line endings

### HTTP Methods
- **GET**: Retrieve data (usually no body)
- **POST**: Submit data (usually has body)
- **PUT**: Update resource (usually has body)
- **DELETE**: Remove resource (usually no body)

### HTTP Headers
- **Host**: Required header specifying the server
- **Content-Type**: Specifies the type of data in body
- **Content-Length**: Size of the body in bytes
- **User-Agent**: Client identification

### Buffer vs String Handling
- **Raw Data**: Received as Buffer (bytes)
- **String Conversion**: `data.toString()` for parsing
- **Line Splitting**: `\r\n` for HTTP line endings

## Next Steps

In upcoming commits, we'll add:
1. **HTTP Response Generation**: Create proper HTTP responses with headers and body


## Contributing

This is a learning project! Feel free to:
- Ask questions about the implementation
- Suggest improvements
- Create issues for bugs
- Submit pull requests with enhancements

**Current Commit**: Step 2 - HTTP Request Parsing Implementation
**Next**: HTTP Response Generation
