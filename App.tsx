import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { DocumentHeader } from './components/DocumentHeader';
import { CollaborativeEditor } from './components/CollaborativeEditor';
import { useSocket } from './hooks/useSocket';
import { User } from './types';
import { getRandomColor, getRandomUserName } from './utils/colors';

function App() {
  const [currentDocument, setCurrentDocument] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [language, setLanguage] = useState('javascript');
  
  const socket = useSocket('http://localhost:3001');

  useEffect(() => {
    if (!socket) return;

    const handleUsersUpdated = (usersList: User[]) => {
      setUsers(usersList);
    };

    const handleCursorChange = ({ userId, cursor, userName, userColor }: any) => {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, cursor, name: userName, color: userColor }
          : user
      ));
    };

    const handleCursorRemove = ({ userId }: { userId: string }) => {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, cursor: undefined }
          : user
      ));
    };

    socket.on('users-updated', handleUsersUpdated);
    socket.on('cursor-change', handleCursorChange);
    socket.on('cursor-remove', handleCursorRemove);

    return () => {
      socket.off('users-updated', handleUsersUpdated);
      socket.off('cursor-change', handleCursorChange);
      socket.off('cursor-remove', handleCursorRemove);
    };
  }, [socket]);

  const handleJoinDocument = (documentId: string, userName: string) => {
    if (!socket) return;

    const user: User = {
      id: socket.id || 'temp-id',
      name: userName || getRandomUserName(),
      color: getRandomColor(),
    };

    setCurrentUser(user);
    setCurrentDocument(documentId);

    socket.emit('join-document', {
      documentId,
      userName: user.name,
      userColor: user.color,
    });
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (socket && currentDocument) {
      socket.emit('language-change', {
        documentId: currentDocument,
        language: newLanguage,
      });
    }
  };

  const handleDownload = () => {
    if (!socket || !currentDocument) return;
    
    // Get current content from editor
    const content = document.querySelector('.monaco-editor textarea')?.textContent || '';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDocument}.${getFileExtension(language)}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (currentDocument) {
      const url = `${window.location.origin}?doc=${currentDocument}`;
      navigator.clipboard.writeText(url).then(() => {
        alert('Document link copied to clipboard!');
      });
    }
  };

  const getFileExtension = (lang: string): string => {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      html: 'html',
      css: 'css',
      json: 'json',
      markdown: 'md',
      sql: 'sql',
      xml: 'xml',
    };
    return extensions[lang] || 'txt';
  };

  // Check for document ID in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const docId = urlParams.get('doc');
    if (docId && !currentDocument) {
      const userName = getRandomUserName();
      handleJoinDocument(docId, userName);
    }
  }, [currentDocument]);

  if (!currentDocument || !currentUser) {
    return <WelcomeScreen onJoinDocument={handleJoinDocument} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <DocumentHeader
        documentId={currentDocument}
        users={users}
        currentUserId={currentUser.id}
        language={language}
        onLanguageChange={handleLanguageChange}
        onDownload={handleDownload}
        onShare={handleShare}
      />
      <div className="flex-1 bg-white">
        <CollaborativeEditor
          socket={socket}
          documentId={currentDocument}
          currentUser={currentUser}
          users={users}
          language={language}
          onLanguageChange={setLanguage}
        />
      </div>
    </div>
  );
}

export default App;