import React, { useEffect, useRef, useState, useCallback } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { Socket } from 'socket.io-client';
import { User, CursorPosition, DocumentData } from '../types';
import * as monaco from 'monaco-editor';

interface CollaborativeEditorProps {
  socket: Socket | null;
  documentId: string;
  currentUser: User;
  users: User[];
  language: string;
  onLanguageChange: (language: string) => void;
}

export const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  socket,
  documentId,
  currentUser,
  users,
  language,
  onLanguageChange,
}) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const [content, setContent] = useState('');
  const [isReceivingChanges, setIsReceivingChanges] = useState(false);
  const decorationsRef = useRef<string[]>([]);

  const handleEditorDidMount = useCallback((editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Handle cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      if (socket && !isReceivingChanges) {
        const cursor: CursorPosition = {
          lineNumber: e.position.lineNumber,
          column: e.position.column,
        };
        socket.emit('cursor-change', { documentId, cursor });
      }
    });

    // Handle content changes
    editor.onDidChangeModelContent((e) => {
      if (!isReceivingChanges && socket) {
        const newContent = editor.getValue();
        setContent(newContent);
        socket.emit('text-change', {
          documentId,
          content: newContent,
          changes: e.changes,
        });
      }
    });
  }, [socket, documentId, isReceivingChanges]);

  // Update cursor decorations
  const updateCursorDecorations = useCallback(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;

    // Clear existing decorations
    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);

    // Create new decorations for other users' cursors
    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [];

    users.forEach((user) => {
      if (user.id !== currentUser.id && user.cursor) {
        newDecorations.push({
          range: new monaco.Range(
            user.cursor.lineNumber,
            user.cursor.column,
            user.cursor.lineNumber,
            user.cursor.column
          ),
          options: {
            className: 'cursor-decoration',
            beforeContentClassName: 'cursor-before',
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
            afterContentClassName: 'cursor-after',
            after: {
              content: user.name,
              inlineClassName: 'cursor-label',
              inlineClassNameAffectsLetterSpacing: false,
            },
          },
        });
      }
    });

    decorationsRef.current = editor.deltaDecorations([], newDecorations);
  }, [users, currentUser.id]);

  useEffect(() => {
    updateCursorDecorations();
  }, [updateCursorDecorations]);

  useEffect(() => {
    if (!socket) return;

    const handleDocumentLoaded = (data: DocumentData) => {
      setContent(data.content);
      onLanguageChange(data.language);
    };

    const handleTextChange = ({ content: newContent }: { content: string }) => {
      setIsReceivingChanges(true);
      setContent(newContent);
      if (editorRef.current) {
        editorRef.current.setValue(newContent);
      }
      setTimeout(() => setIsReceivingChanges(false), 100);
    };

    const handleLanguageChange = ({ language: newLanguage }: { language: string }) => {
      onLanguageChange(newLanguage);
    };

    socket.on('document-loaded', handleDocumentLoaded);
    socket.on('text-change', handleTextChange);
    socket.on('language-change', handleLanguageChange);

    return () => {
      socket.off('document-loaded', handleDocumentLoaded);
      socket.off('text-change', handleTextChange);
      socket.off('language-change', handleLanguageChange);
    };
  }, [socket, onLanguageChange]);

  return (
    <div className="flex-1 relative">
      <style>{`
        .cursor-decoration {
          border-left: 2px solid #007acc;
          position: relative;
        }
        .cursor-label {
          background: #007acc;
          color: white;
          padding: 2px 4px;
          border-radius: 2px;
          font-size: 11px;
          position: absolute;
          top: -20px;
          left: -2px;
          white-space: nowrap;
          z-index: 1000;
        }
      `}</style>
      <Editor
        height="100%"
        language={language}
        value={content}
        onMount={handleEditorDidMount}
        theme="vs-light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: 'on',
          tabSize: 2,
          insertSpaces: true,
          renderWhitespace: 'selection',
          folding: true,
          lineDecorationsWidth: 10,
          lineNumbersMinChars: 3,
        }}
      />
    </div>
  );
};