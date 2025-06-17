# Real-time Collaborative Editor

A fully functional collaborative platform for coding and note-taking with multi-user support, built with React, TypeScript, Socket.IO, and Monaco Editor.

## Features

### 🚀 Real-time Collaboration
- **Live Editing**: See changes from other users in real-time
- **Cursor Tracking**: View other users' cursor positions and selections
- **User Presence**: See who's currently editing the document
- **Conflict Resolution**: Seamless handling of simultaneous edits

### 💻 Advanced Code Editor
- **Monaco Editor**: Full-featured code editor (same as VS Code)
- **Syntax Highlighting**: Support for 12+ programming languages
- **Language Switching**: Change language on-the-fly
- **Code Folding**: Collapse and expand code blocks
- **Auto-completion**: Intelligent code suggestions

### 👥 Multi-user Support
- **User Identification**: Unique colors and names for each user
- **Real-time User List**: See all active collaborators
- **Anonymous Access**: No registration required
- **Persistent Sessions**: Maintain connection across page refreshes

### 🔧 Developer Experience
- **TypeScript**: Full type safety throughout the application
- **Modern React**: Hooks, functional components, and best practices
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean Architecture**: Well-organized, maintainable codebase

## Supported Languages

- JavaScript
- TypeScript
- Python
- Java
- C++
- C#
- HTML
- CSS
- JSON
- Markdown
- SQL
- XML

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Monaco Editor** - VS Code editor component
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Socket.IO** - WebSocket communication
- **CORS** - Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-editor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

This will start both the client (port 5173) and server (port 3001) concurrently.

### Usage

1. **Create a new document**: Click "Create New Document" to start a new collaborative session
2. **Join existing document**: Enter a document ID to join an existing session
3. **Share with others**: Use the share button to copy the document link
4. **Change language**: Select from the language dropdown to switch syntax highlighting
5. **Download**: Save your work locally using the download button

## Architecture

### Client-Server Communication

The application uses WebSocket connections via Socket.IO for real-time communication:

- **Document Management**: Join/leave document rooms
- **Text Synchronization**: Broadcast changes to all connected users
- **Cursor Tracking**: Share cursor positions and selections
- **User Presence**: Track active users in each document

### State Management

- **Local State**: React hooks for component-level state
- **Socket Events**: Real-time updates via WebSocket events
- **Document Storage**: In-memory storage on the server (can be extended with database)

### Security Considerations

- **Input Sanitization**: All user inputs are properly handled
- **CORS Configuration**: Properly configured for development
- **Rate Limiting**: Can be added for production use
- **Authentication**: Can be extended with user authentication

## Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables

For production deployment, consider these environment variables:

```env
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=production
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Monaco Editor team for the excellent code editor
- Socket.IO team for real-time communication
- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework

---

**Built with ❤️ for CODTECH Internship Program**