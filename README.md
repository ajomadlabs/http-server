# HTTP Server from Scratch - Complete Implementation

A comprehensive step-by-step implementation of an HTTP server from scratch using Node.js. This project demonstrates how HTTP servers work at a fundamental level by building one progressively, implementing GET and POST methods according to HTTP RFC specifications.

## Project Overview

This project implements a complete HTTP server from scratch, covering:
- **TCP Socket Programming**: Raw TCP connections using Node.js `net` module
- **HTTP Request Parsing**: Manual parsing of HTTP requests according to RFC 7230
- **HTTP Response Generation**: Creating proper HTTP responses with headers and body
- **GET Method Implementation**: RFC 7231 compliant GET method with query parameter handling
- **POST Method Implementation**: RFC 7231 compliant POST method with body parsing

## Complete Implementation Journey

### Step 1: Basic TCP Server
**Files**: `http-server.js` (lines 1-50)

**What We Built**:
- TCP server using Node.js `net` module
- Socket event handling (`data`, `error`, `close`)
- Basic connection logging and data reception

**Key Concepts**:
- **TCP (Transmission Control Protocol)**: Connection-oriented protocol
- **Socket Programming**: Low-level network communication
- **Event-Driven Architecture**: Non-blocking I/O operations

### Step 2: HTTP Request Parsing
**Files**: `http-server.js` (lines 8-35)

**What We Built**:
- HTTP request parser according to RFC 7230
- Request line parsing (method, path, version)
- Header parsing with case-insensitive keys
- Body parsing for POST requests

**Key Concepts**:
- **HTTP Protocol Structure**: Request line, headers, body
- **RFC 7230 Compliance**: HTTP/1.1 message format
- **Line Endings**: `\r\n` (CRLF) as per HTTP specification

### Step 3: HTTP Response Generation
**Files**: `http-server.js` (lines 37-60)

**What We Built**:
- HTTP response generator with proper formatting
- Status line, headers, and body construction
- Content-Length calculation using `Buffer.byteLength()`
- Error response handling

**Key Concepts**:
- **HTTP Response Structure**: Status line, headers, empty line, body
- **Status Codes**: 200 OK, 400 Bad Request, 404 Not Found, 500 Internal Server Error
- **Header Management**: Content-Type, Content-Length, Connection

### Step 4: GET Method Implementation
**Files**: `http-server.js` (lines 62-130)

**What We Built**:
- RFC 7231 compliant GET method handler
- Query parameter parsing according to RFC 3986
- Multiple GET endpoints with educational content
- RFC compliance validation (no body, safe, idempotent)

**Key Concepts**:
- **RFC 7231 Section 4.3.1**: GET method characteristics
- **Safe Method**: No side effects on server state
- **Idempotent**: Multiple identical requests have same effect
- **Cacheable**: Responses can be cached (RFC 7234)

### Step 5: POST Method Implementation
**Files**: `http-server.js` (lines 132-220)

**What We Built**:
- RFC 7231 compliant POST method handler
- Body parsing for different Content-Types (JSON, form data, plain text)
- Multiple POST endpoints for different use cases
- Proper status codes (201 Created for resource creation)

**Key Concepts**:
- **RFC 7231 Section 4.3.3**: POST method characteristics
- **Not Safe**: May cause side effects on server
- **Not Idempotent**: Multiple requests may have different effects
- **Body Required**: POST requests should have a body

## Complete HTTP Server Features

### Implemented Features

#### TCP Socket Handling
- **Connection Management**: Accepts and manages TCP connections
- **Data Reception**: Accumulates data until complete HTTP request
- **Error Handling**: Graceful handling of socket errors
- **Connection Lifecycle**: Proper connection establishment and closure

#### HTTP Request Processing
- **Request Parsing**: Manual parsing of HTTP requests
- **Method Support**: GET and POST methods
- **Header Parsing**: Case-insensitive header handling
- **Body Parsing**: Support for request bodies in POST requests
- **Query Parameters**: URL parameter parsing for GET requests

#### HTTP Response Generation
- **Status Codes**: 200, 201, 400, 404, 405, 500
- **Header Management**: Content-Type, Content-Length, Connection
- **Body Formatting**: Proper HTTP response structure
- **Error Responses**: Meaningful error messages with RFC references

#### GET Method Implementation
- **RFC 7231 Compliance**: Safe, idempotent, cacheable
- **Query Parameter Support**: URL parameter parsing and decoding
- **Multiple Endpoints**: `/`, `/api/status`, `/api/info`
- **Educational Content**: Each response includes RFC references

#### POST Method Implementation
- **RFC 7231 Compliance**: Not safe, not idempotent, not cacheable
- **Body Parsing**: JSON, form data, and plain text support
- **Multiple Endpoints**: `/api/users`, `/api/data`, `/api/echo`
- **Status Codes**: 201 Created for resource creation

### Available Endpoints

#### GET Endpoints
```bash
curl http://localhost:4000/

curl http://localhost:4000/api/status

curl http://localhost:4000/api/info

curl "http://localhost:4000/?name=john&age=25"
```

#### POST Endpoints
```bash

curl -X POST -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}' \
  http://localhost:4000/api/users

curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
  -d "name=John&age=30&city=NewYork" \
  http://localhost:4000/api/data

curl -X POST -H "Content-Type: application/json" \
  -d '{"message": "Hello World"}' \
  http://localhost:4000/api/echo
```

## Testing the Complete Implementation

### Basic Testing
```bash
# Start the server
node http-server.js

# Test GET requests
curl http://localhost:4000/
curl http://localhost:4000/api/status
curl "http://localhost:4000/?name=john&age=25"

# Test POST requests
curl -X POST -H "Content-Type: application/json" \
  -d '{"name": "John"}' \
  http://localhost:4000/api/users

# Test error handling
curl http://localhost:4000/nonexistent
curl -X PUT http://localhost:4000/
```

### Advanced Testing
```bash
# Test different Content-Types
curl -X POST -H "Content-Type: application/json" \
  -d '{"data": "JSON content"}' \
  http://localhost:4000/api/echo

curl -X POST -H "Content-Type: application/x-www-form-urlencoded" \
  -d "field1=value1&field2=value2" \
  http://localhost:4000/api/echo

curl -X POST -H "Content-Type: text/plain" \
  -d "Plain text content" \
  http://localhost:4000/api/echo
```

## RFC Compliance

### RFC 7231 - HTTP/1.1 Semantics and Content
- **Section 4.3.1**: GET method definition and characteristics
- **Section 4.3.3**: POST method definition and characteristics
- **Section 6.3.2**: 201 Created status code
- **Section 6.5.4**: 404 Not Found status code

### RFC 7230 - HTTP/1.1 Message Syntax and Routing
- **Message Format**: Request and response structure
- **Header Format**: Key-value pair formatting
- **Line Endings**: CRLF (`\r\n`) usage

### RFC 3986 - Uniform Resource Identifier (URI) Generic Syntax
- **Query Parameters**: `?key=value&key2=value2` format
- **URL Encoding**: Proper parameter encoding/decoding
- **URI Structure**: Scheme, authority, path, query, fragment

### RFC 7234 - HTTP/1.1 Caching
- **Cacheable Methods**: GET responses can be cached
- **Non-Cacheable Methods**: POST responses should not be cached

## Learning Outcomes

### HTTP Protocol Understanding
- **Request Structure**: Method, path, version, headers, body
- **Response Structure**: Status line, headers, empty line, body
- **Status Codes**: Meaning and proper usage
- **Headers**: Purpose and formatting
### HTTP Methods
- **GET**: Safe, idempotent, cacheable, no body
- **POST**: Not safe, not idempotent, not cacheable, has body

### TCP Socket Programming
- **Connection Management**: Accept, handle, close connections
- **Data Handling**: Buffer accumulation and processing
- **Error Handling**: Graceful error management

### RFC Compliance
- **Standards-Based**: Following official HTTP specifications
- **Best Practices**: Proper HTTP method implementation
- **Error Handling**: Correct status codes and messages

## Next Steps: Implement Remaining HTTP Methods

Now that you understand the fundamentals, try implementing the remaining HTTP methods:


### Implementation Challenges

#### 1. PUT Method Implementation
- **Resource Replacement**: Handle complete resource updates
- **Idempotency**: Ensure multiple PUT requests have same effect
- **Conflict Handling**: Deal with resource conflicts
- **Status Codes**: 200 OK, 204 No Content, 409 Conflict

#### 2. PATCH Method Implementation
- **Partial Updates**: Apply incremental changes to resources
- **Patch Formats**: JSON Patch (RFC 6902), JSON Merge Patch
- **Validation**: Ensure patch operations are valid
- **Status Codes**: 200 OK, 400 Bad Request, 422 Unprocessable Entity

#### 3. DELETE Method Implementation
- **Resource Removal**: Handle resource deletion
- **Idempotency**: Multiple DELETE requests should have same effect
- **Cascading Deletes**: Handle dependent resource cleanup
- **Status Codes**: 204 No Content, 404 Not Found

### Advanced Features to Implement

#### 1. HTTP Headers Support
```javascript
- Authorization: Bearer token support
- Accept: Content negotiation
- Cache-Control: Caching directives
- ETag: Entity tags for caching
```

#### 2. Content Negotiation
```javascript
- Accept header parsing
- Content-Type negotiation
- Multiple response formats (JSON, XML, HTML)
```

#### 3. Error Handling
```javascript
- Detailed error messages
- Proper HTTP status codes
- Error logging and monitoring
```

## 🤝 Contributing

This is a learning project! Feel free to:
- **Ask Questions**: About the implementation details
- **Suggest Improvements**: Better approaches or optimizations
- **Report Issues**: Bugs or inconsistencies
- **Submit Enhancements**: Additional features or RFC implementations

**Ready for the next challenge?** Try implementing PUT, PATCH, and DELETE methods to complete your HTTP server implementation!
