# HTTP Server from Scratch - Learning Journey

A step-by-step implementation of an HTTP server from scratch using Node.js. This project is designed to help developers understand how HTTP servers work at a fundamental level by building one progressively.

## Project Goal

The goal is to build a complete HTTP server from scratch, understanding each component as we add it. We'll start with basic TCP connections and gradually build up to implementing the core GET and POST HTTP methods.

## Current Implementation: Step 4 - GET Method Implementation

### What We Have So Far

In this step, we've implemented the GET method according to HTTP RFC specifications:
- ✅ Accepts TCP connections
- ✅ Receives raw data
- ✅ Parses HTTP requests according to HTTP specification
- ✅ Generates proper HTTP responses according to HTTP specification
- ✅ **NEW**: Implements GET method according to RFC 7231
- ✅ **NEW**: Handles query parameters according to RFC 3986
- ✅ **NEW**: Validates GET request compliance (no body, safe, idempotent)
- ✅ **NEW**: Provides multiple GET endpoints with educational content
- ❌ POST method not yet implemented
- ❌ Doesn't have middleware system yet

### GET Method Specification (RFC 7231)

The GET method is defined in **RFC 7231: HTTP/1.1 Semantics and Content** with the following characteristics:

#### RFC 7231 Section 4.3.1 - GET Method
- **Purpose**: Retrieve a representation of the target resource
- **Safe**: GET requests should not cause side effects on the server
- **Idempotent**: Multiple identical GET requests have the same effect
- **Cacheable**: GET responses can be cached (RFC 7234)
- **Body**: GET requests should not have a request body

#### RFC 3986 - URI Query Parameters
- **Query String**: Parameters after `?` in the URI
- **Format**: `key=value&key2=value2`
- **Encoding**: URL-encoded parameters
- **Example**: `/api/data?name=john&age=25`

#### The `handleGET()` Method

```javascript
handleGET(request) {
    console.log('=== GET Request Handling ===');
    console.log('RFC 7231: GET method is safe and idempotent');
    
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

    switch (path) {
        case '/':
            break;
        case '/api/status':
            break;
        case '/api/info':
            break;
        default:
            break;
    }
}
```

#### How GET Request Handling Works

**1. RFC 7231 Compliance Check:**
- **Body Validation**: GET requests should not have a body
- **Safe Method**: No side effects on server state
- **Idempotent**: Multiple requests produce same result
- **Cacheable**: Responses can be cached

**2. Query Parameter Parsing (RFC 3986):**
- **URI Structure**: `scheme://authority/path?query#fragment`
- **Query Format**: `key=value&key2=value2`
- **URL Decoding**: `decodeURIComponent()` for parameter values
- **Example**: `/api/data?name=john&age=25`

**3. Path-Based Routing:**
- **Root Path**: `/` - Welcome page with RFC information
- **Status Path**: `/api/status` - Server status information
- **Info Path**: `/api/info` - Detailed RFC compliance information
- **404 Handling**: Unknown paths return proper 404 response

**4. Response Generation:**
- **Educational Content**: Each response includes RFC references
- **Compliance Info**: Explains GET method characteristics
- **Query Parameters**: Shows parsed query parameters
- **Status Codes**: Proper HTTP status codes (200, 404)

### Available GET Endpoints

#### GET / - Welcome Page
```bash
curl http://localhost:4000/
```

**Response:**
```
GET Request Received Successfully!

RFC 7231 Compliance:
- Method: GET (Safe and Idempotent)
- Path: /
- Version: HTTP/1.1

Request Details:
- Host: localhost:4000
- User-Agent: curl/7.68.0
- Accept: */*

Query Parameters: None

RFC References:
- RFC 7231: HTTP/1.1 Semantics and Content (GET method)
- RFC 3986: Uniform Resource Identifier (URI) Generic Syntax
- RFC 7230: HTTP/1.1 Message Syntax and Routing
```

#### GET /api/status - Server Status
```bash
curl http://localhost:4000/api/status
```

**Response:**
```
Server Status (GET /api/status)

RFC 7231: GET method for resource retrieval
Status: Running
Timestamp: 2024-01-01T12:00:00.000Z
Uptime: 123.45 seconds
Port: 4000

RFC Compliance:
- Safe: GET requests should not cause side effects
- Idempotent: Multiple identical GET requests have same effect
- Cacheable: GET responses can be cached (RFC 7234)
```

#### GET /api/info - Server Information
```bash
curl http://localhost:4000/api/info
```

**Response:**
```
HTTP Server Information (GET /api/info)

RFC 7231 GET Method Characteristics:
1. Safe: No side effects on server state
2. Idempotent: Multiple requests produce same result
3. Cacheable: Responses can be cached
4. Body: Should not have request body (RFC 7231 Section 4.3.1)

Request Information:
- Method: GET
- Path: /api/info
- Version: HTTP/1.1
- Headers Count: 3

RFC References:
- RFC 7231 Section 4.3.1: GET method definition
- RFC 7234: HTTP/1.1 Caching
- RFC 3986: URI syntax and query parameters
```

#### GET with Query Parameters
```bash
curl "http://localhost:4000/?name=john&age=25&city=newyork"
```

**Response includes:**
```
Query Parameters: name=john, age=25, city=newyork
```

### RFC Compliance Features

#### RFC 7231 Compliance
- **Safe Method**: GET requests don't modify server state
- **Idempotent**: Multiple identical requests have same effect
- **No Body**: GET requests should not have request body
- **Cacheable**: Responses can be cached by clients

#### RFC 3986 URI Compliance
- **Query Parameter Parsing**: Properly parses `?key=value` format
- **URL Decoding**: Handles encoded characters correctly
- **Multiple Parameters**: Supports `&` separated parameters

#### RFC 7230 Message Format
- **Proper Headers**: Correct HTTP/1.1 header format
- **Status Codes**: Proper HTTP status codes
- **Response Format**: Correct HTTP response structure

### Error Handling

#### 404 Not Found (RFC 7231 Section 6.5.4)
```bash
curl http://localhost:4000/nonexistent
```

**Response:**
```
404 Not Found

RFC 7231: GET method for resource retrieval
Requested path '/nonexistent' not found.

Available GET endpoints:
- GET / - Welcome page
- GET /api/status - Server status
- GET /api/info - Server information

RFC 7231 Section 6.5.4: 404 Not Found status code
The origin server did not find a current representation for the target resource.
```

#### 405 Method Not Allowed
```bash
curl -X PUT http://localhost:4000/
```

**Response:**
```
405 Method Not Allowed - Method 'PUT' not supported
```

### Enhanced Logging

We now log GET-specific information:

```
=== GET Request Handling ===
RFC 7231: GET method is safe and idempotent
Path: /api/status
Headers: { host: 'localhost:4000', user-agent: 'curl/7.68.0' }
Body length: 0
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

## Testing the GET Implementation

You can test the GET method implementation:

```bash
curl http://localhost:4000/

curl "http://localhost:4000/?name=john&age=25"

curl http://localhost:4000/api/status

curl http://localhost:4000/api/info

curl http://localhost:4000/nonexistent

curl -X PUT http://localhost:4000/
```

## Learning Points

### RFC 7231 - GET Method Specification
- **Safe**: GET requests should not cause side effects
- **Idempotent**: Multiple identical requests have same effect
- **Cacheable**: Responses can be cached by clients
- **No Body**: GET requests should not have request body

### RFC 3986 - URI Query Parameters
- **Query String**: Parameters after `?` in URI
- **Format**: `key=value&key2=value2`
- **URL Encoding**: Special characters must be encoded
- **Parsing**: Split by `&` and `=` for key-value pairs

### HTTP Status Codes (RFC 7231)
- **200 OK**: Successful GET request
- **404 Not Found**: Resource not found (Section 6.5.4)
- **405 Method Not Allowed**: Method not supported
- **501 Not Implemented**: Method not yet implemented

### GET Method Best Practices
- **No Side Effects**: GET should only retrieve data
- **Idempotent**: Same request always returns same result
- **Cacheable**: Responses can be cached
- **Query Parameters**: Use for filtering/sorting, not data submission

## Next Steps

In the final step, we'll implement:
1. **POST Method Implementation**: Handle POST requests with body parsing according to RFC 7231

**Note**: We're focusing only on GET and POST methods as these are the most fundamental HTTP methods. This keeps the learning focused and manageable.

## Contributing

This is a learning project! Feel free to:
- Ask questions about the implementation
- Suggest improvements
- Create issues for bugs
- Submit pull requests with enhancements

**Current Commit**: Step 4 - GET Method Implementation (RFC 7231)
**Next**: POST Method Implementation
