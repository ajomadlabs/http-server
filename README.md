# HTTP Server from Scratch - Learning Journey

A step-by-step implementation of an HTTP server from scratch using Node.js. This project is designed to help developers understand how HTTP servers work at a fundamental level by building one progressively.

## Project Goal

The goal is to build a complete HTTP server from scratch, understanding each component as we add it. We'll start with basic TCP connections and gradually build up to a full HTTP implementation.

## Current Implementation: Step 1 - Basic TCP Server

### What We Have So Far

In this first step, we've implemented a basic TCP server that:
- Listens on port 4000 (or a custom port)
- Accepts incoming connections
- Logs connection events
- Receives raw data from clients

### The HTTP Class

```javascript
class HTTP {
    constructor(port = 4000) {
        this.port = port;
        this.server = null;
    }
    
    start() {
        // TCP server implementation
    }
}
```

#### Constructor Explained

The constructor initializes our HTTP server class:

- **`this.port = port`**: Stores the port number (defaults to 4000 if not provided)
- **`this.server = null`**: Initializes the server property to null. This will hold our TCP server instance once created

**Why initialize these variables?**
- **Port**: We need to remember which port to listen on
- **Server**: We need a reference to the server instance so we can control it (start, stop, etc.)

### The `start()` Method

```javascript
start() {
    this.server = net.createServer((socket) => {
        // Handle incoming connections
    });
    
    this.server.listen(this.port, () => {
        console.log('Server Started at Port::', this.port);
    });
}
```

#### What `net.createServer()` Does

The `net.createServer()` function from Node.js creates a TCP server:

- **TCP (Transmission Control Protocol)**: A connection-oriented protocol that ensures reliable data delivery
- **Why TCP?**: HTTP is built on top of TCP. TCP provides the reliable connection that HTTP needs
- **Connection Callback**: The function we pass to `createServer()` is called every time a client connects

#### Socket Events Explained

```javascript
socket.on('data', (data) => {
    console.log('Received Data in Bytes::', data);
    console.log('Received Data in String::', data.toString());
});

socket.on('error', (error) => {
    console.log('Socket Error ::', error);
});

socket.on('close', () => {
    console.log('Client Disconnected::', socket.remoteAddress);
});
```

**Socket Events:**
- **`'data'`**: Fired when the server receives data from the client
  - `data` parameter contains the raw bytes received
  - We can convert it to string using `data.toString()`
- **`'error'`**: Fired when there's an error with the socket connection
  - Network issues, client disconnection, etc.
- **`'close'`**: Fired when the client disconnects
  - `socket.remoteAddress` tells us the client's IP address

### Why Use the `net` Module?

The `net` module in Node.js provides:
- **Low-level TCP networking**: Direct access to TCP sockets
- **Event-driven API**: Uses Node.js event system for handling connections
- **Cross-platform**: Works on Windows, macOS, Linux
- **Performance**: Efficient for handling multiple concurrent connections

### Current Limitations

At this stage, our server:
- ✅ Accepts TCP connections
- ✅ Receives raw data
- ✅ Logs connection events
- ❌ Doesn't understand HTTP protocol
- ❌ Doesn't parse HTTP requests
- ❌ Doesn't send proper HTTP responses
- ❌ Doesn't handle different HTTP methods (GET, POST, etc.)

## How to Run

```bash
node http-server.js
```

You should see:
```
Server Started at Port:: 4000
```

## Testing the Current Implementation

You can test the current TCP server using:

```bash
# Using telnet (if available)
telnet localhost 4000

# Using netcat (if available)
nc localhost 4000

# Using curl (will show raw TCP behavior)
curl -v http://localhost:4000
```

When you connect, you'll see logs like:
```
Client connected:: ::1
Received Data in Bytes:: <Buffer 47 45 54 20 2f 20 48 54 54 50 2f 31 2e 31 0d 0a...>
Received Data in String:: GET / HTTP/1.1
Host: localhost:4000
...
```

## Learning Points

### TCP vs HTTP
- **TCP**: Raw byte stream protocol (what we're using now)
- **HTTP**: Application protocol built on top of TCP (what we'll implement next)

### Socket Programming Concepts
- **Socket**: An endpoint for communication between two machines
- **Server Socket**: Listens for incoming connections
- **Client Socket**: Initiates connections to servers

### Node.js Event System
- **Event-driven**: Code runs in response to events
- **Non-blocking**: Can handle multiple connections simultaneously
- **Asynchronous**: Operations don't block the main thread

## Next Steps

In upcoming commits, we'll add:
1. **HTTP Request Parsing**: Parse the raw TCP data into HTTP request objects
2. **HTTP Response Generation**: Create proper HTTP responses

## 🤝 Contributing

This is a learning project! Feel free to:
- Ask questions about the implementation
- Suggest improvements
- Create issues for bugs
- Submit pull requests with enhancements

**Current Commit**: Step 1 - Basic TCP Server Implementation
**Next**: HTTP Request Parsing
