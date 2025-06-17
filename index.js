import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Store documents and their content
const documents = new Map();
const documentUsers = new Map();

// Store user cursors and selections
const userCursors = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join a document room
  socket.on('join-document', ({ documentId, userName, userColor }) => {
    socket.join(documentId);
    
    // Initialize document if it doesn't exist
    if (!documents.has(documentId)) {
      documents.set(documentId, {
        content: '// Welcome to the collaborative editor!\n// Start typing to see real-time collaboration in action.\n\nfunction hello() {\n  console.log("Hello, collaborative world!");\n}',
        language: 'javascript'
      });
      documentUsers.set(documentId, new Map());
    }

    // Add user to document
    const docUsers = documentUsers.get(documentId);
    docUsers.set(socket.id, {
      id: socket.id,
      name: userName,
      color: userColor,
      cursor: null
    });

    // Send current document content to the new user
    const document = documents.get(documentId);
    socket.emit('document-loaded', {
      content: document.content,
      language: document.language
    });

    // Send current users list to everyone in the room
    const usersList = Array.from(docUsers.values());
    io.to(documentId).emit('users-updated', usersList);

    console.log(`User ${userName} joined document ${documentId}`);
  });

  // Handle text changes
  socket.on('text-change', ({ documentId, content, changes }) => {
    if (documents.has(documentId)) {
      const document = documents.get(documentId);
      document.content = content;
      
      // Broadcast changes to all other users in the room
      socket.to(documentId).emit('text-change', {
        content,
        changes,
        userId: socket.id
      });
    }
  });

  // Handle language change
  socket.on('language-change', ({ documentId, language }) => {
    if (documents.has(documentId)) {
      const document = documents.get(documentId);
      document.language = language;
      
      // Broadcast language change to all users in the room
      io.to(documentId).emit('language-change', {
        language,
        userId: socket.id
      });
    }
  });

  // Handle cursor position updates
  socket.on('cursor-change', ({ documentId, cursor }) => {
    const rooms = Array.from(socket.rooms);
    const documentRoom = rooms.find(room => room === documentId);
    
    if (documentRoom && documentUsers.has(documentId)) {
      const docUsers = documentUsers.get(documentId);
      const user = docUsers.get(socket.id);
      
      if (user) {
        user.cursor = cursor;
        
        // Broadcast cursor position to other users
        socket.to(documentId).emit('cursor-change', {
          userId: socket.id,
          cursor,
          userName: user.name,
          userColor: user.color
        });
      }
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Remove user from all documents
    for (const [documentId, docUsers] of documentUsers.entries()) {
      if (docUsers.has(socket.id)) {
        docUsers.delete(socket.id);
        
        // Update users list for remaining users
        const usersList = Array.from(docUsers.values());
        socket.to(documentId).emit('users-updated', usersList);
        
        // Remove cursor
        socket.to(documentId).emit('cursor-remove', { userId: socket.id });
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});